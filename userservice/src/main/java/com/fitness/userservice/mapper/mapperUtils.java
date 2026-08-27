package com.fitness.userservice.mapper;

import com.fitness.userservice.dto.RegisterResponse;
import com.fitness.userservice.model.User;
import org.springframework.stereotype.Component;

@Component
public class mapperUtils {
    public RegisterResponse mapUserToResponse(User savedUser) {
        RegisterResponse response = RegisterResponse.builder()
                .id(savedUser.getId())
                .keycloakId(savedUser.getKeycloakId())
                .password(savedUser.getPassword())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .createdat(savedUser.getCreatedAt())
                .updatedat(savedUser.getUpdatedAt())
                .build();

        return response;
    }
}
