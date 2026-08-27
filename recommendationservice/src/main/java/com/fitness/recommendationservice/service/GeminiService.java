package com.fitness.recommendationservice.service;

import com.fitness.recommendationservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {
    private final WebClient webClient;

    private final GeminiUtils geminiUtils;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value(("${gemini.api.key}"))
    private String geminiApiKey;


    public String generateRecommendations(Activity activity){

        String prompt = geminiUtils.buildPrompt(activity);

        Map<String,Object> requestBody = Map.of(

                "contents" , List.of(
                        Map.of("parts" , List.of(
                                Map.of("text" , prompt)
                        ))
                )
        );

        String response = webClient.post()
                .uri(geminiApiUrl)
                .header("Content-Type" , "application/json")
                .header("x-goog-api-key" , geminiApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return response;
    }
}
