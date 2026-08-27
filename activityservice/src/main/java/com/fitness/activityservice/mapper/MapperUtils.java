package com.fitness.activityservice.mapper;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import org.springframework.stereotype.Component;

@Component
public class MapperUtils {
    public ActivityResponse mapActivityToActivityResponse(Activity savedActivity) {
        ActivityResponse activityResponse = ActivityResponse.builder()
                .id(savedActivity.getId())
                .keycloakId(savedActivity.getKeycloakId())
                .type(savedActivity.getType())
                .additionalMetrics(savedActivity.getAdditionalMetrics())
                .caloriesBurned(savedActivity.getCaloriesBurned())
                .updatedAt(savedActivity.getUpdatedAt())
                .duration(savedActivity.getDuration())
                .createdAt(savedActivity.getCreatedAt())
                .startTime(savedActivity.getStartTime())
                .build();

        return activityResponse;
    }
}
