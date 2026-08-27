//package com.fitness.recommendationservice.service;
//
//
//import com.fitness.recommendationservice.model.Activity;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Service;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//public class ActivityKafkaMessageListner {
//
//    private final GeminiService geminiService;
//
//    @KafkaListener(topics = "${kafka.topic.name}" , groupId = "activity-processor-group")
//    public void processActivity(Activity activity) {
//        log.info("Processing activity {}", activity.getUserId());
//        String aiRawResponse = geminiService.generateRecommendations(activity);
//
//    }
//}


package com.fitness.recommendationservice.service;

import com.fitness.recommendationservice.mapper.RecommendationMapper;
import com.fitness.recommendationservice.model.Activity;
import com.fitness.recommendationservice.model.Recommendation;
import com.fitness.recommendationservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityKafkaMessageListner {
    private final RecommendationMapper  recommendationMapper;
    private final RecommendationRepository recommendationRepository;
    private final GeminiService geminiService;

    @KafkaListener(topics = "${kafka.topic.name}", groupId = "activity-processor-group")
    public void processActivity(Activity activity) {
        log.info("Processing activity for User: {}", activity.getKeycloakId());

        try {
            String aiResponse = geminiService.generateRecommendations(activity);
            log.info("✅ Recommendation generated successfully!");

            Recommendation recommendation = recommendationMapper.mapAiResponseToRecommendation(activity, aiResponse);

            if (recommendation != null)
            {
                log.info("✅ Recommendation Object parsed successfully! AI Message: {}", recommendation);
                recommendationRepository.save(recommendation);
                log.info("✅ Recommendation object saved successfully!");

            }
            else
            {
                log.error("❌ Failed to create Recommendation Object from AI Response.");
            }



        } catch (WebClientResponseException.TooManyRequests e) {
            log.error("❌ Gemini API Limit Reached ! Please wait a few minutes.");
        } catch (Exception e) {
            log.error("❌ Error processing activity: {}", e.getMessage());
        }


    }
}