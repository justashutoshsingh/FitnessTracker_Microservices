package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.mapper.MapperUtils;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final MapperUtils mapperUtils;
    private final UserValidationService userValidationService;


    private final KafkaTemplate<String , Activity> kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;

    public ActivityResponse addActivity(ActivityRequest request, String userKeycloakId) {


        log.info("🪪 Validating user (using keycloakId): {} " , userKeycloakId);
        boolean isValidUser = userValidationService.validateUser(userKeycloakId);

        if(!isValidUser){
            log.error("❌ Invalid user : {} " , userKeycloakId);
            throw new RuntimeException("❌ Invalid user : "+userKeycloakId );
        }

        log.info("✅ User Validated : {} , Now adding the activity to the corresponding user. " ,userKeycloakId);


        Activity activity = Activity.builder()
                .type(request.getType())
                .additionalMetrics(request.getAdditionalMetrics())
                .caloriesBurned(request.getCaloriesBurned())
                .keycloakId(userKeycloakId)
                .duration(request.getDuration())
                .startTime(request.getStartTime())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        log.info("Activity Saved :{} ", savedActivity);



        try {
            log.info("Sending saved activity to Kafka Topic : {}", topicName);
            kafkaTemplate.send(topicName , savedActivity.getKeycloakId(), savedActivity);

            log.info("Activity SUCCESSFULLY Sent to Kafka Topic : {}", topicName);
        } catch (Exception e) {
            log.error("ERROR SENDING MESSAGE TO KAFKA: {}", e.getMessage());
            e.printStackTrace();
        }

        return mapperUtils.mapActivityToActivityResponse(savedActivity);

    }
}
