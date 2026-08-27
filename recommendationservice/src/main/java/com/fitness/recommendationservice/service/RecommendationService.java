package com.fitness.recommendationservice.service;

import com.fitness.recommendationservice.dto.RecommendationResponse;
import com.fitness.recommendationservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;

    public List<RecommendationResponse> getUserRecommendations(String keycloakId) {
        return recommendationRepository.findByKeycloakId(keycloakId);
    }

    public RecommendationResponse getActivityRecommendation(String activityId) {
        return recommendationRepository.findByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found : " + activityId));
    }
}
