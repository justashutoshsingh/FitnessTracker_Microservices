package com.fitness.activityservice.controller;

import com.fitness.activityservice.service.ActivityService;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/add")
    public ResponseEntity<ActivityResponse> addActivity(@RequestHeader("X-UserKeycloak-ID") String userKeycloakId ,
                                                        @RequestBody ActivityRequest request) {
        ActivityResponse response = activityService.addActivity(request , userKeycloakId);
        return ResponseEntity.ok(response);
    }
}
