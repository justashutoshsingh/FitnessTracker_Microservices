package com.fitness.recommendationservice.repository;

import com.fitness.recommendationservice.dto.RecommendationResponse;
import com.fitness.recommendationservice.model.Recommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationRepository extends MongoRepository<Recommendation,String> {
    List<RecommendationResponse> findByKeycloakId(String userId);

    Optional<RecommendationResponse> findByActivityId(String activityId);
}
