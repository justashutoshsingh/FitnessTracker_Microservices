package com.fitness.recommendationservice.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.recommendationservice.model.Activity;
import com.fitness.recommendationservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RecommendationMapper {

    private final ObjectMapper objectMapper;

    public Recommendation mapAiResponseToRecommendation(Activity activity , String aiResponse){
        try{
            JsonNode rootNode = objectMapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String rawText = textNode.asText();

            String cleanJson = rawText.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            Recommendation recommendation = objectMapper.readValue(cleanJson, Recommendation.class);

            // Setting custom properties
            recommendation.setKeycloakId(activity.getKeycloakId());
            recommendation.setActivityId(activity.getId());
            recommendation.setCreationAt(activity.getCreatedAt());

            return recommendation;

        } catch(Exception e){
            log.error("❌ Failed to parse Gemini response into Recommendation object: {}", e.getMessage());
            e.printStackTrace();
        }

        return null;
    }
}
