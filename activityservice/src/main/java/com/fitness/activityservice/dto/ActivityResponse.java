package com.fitness.activityservice.dto;

import com.fitness.activityservice.model.ActivityType;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ActivityResponse {
    private String id;
    private String keycloakId;
    private ActivityType type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Map<String,Object> additionalMetrics;
}
