package com.fitness.userservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RegisterResponse {
    private String id;
    private String keycloakId;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime createdat;
    private LocalDateTime updatedat;

}
