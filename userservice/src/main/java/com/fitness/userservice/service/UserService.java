package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.RegisterResponse;
import com.fitness.userservice.exception.DuplicateResourceException;
import com.fitness.userservice.mapper.mapperUtils;
import com.fitness.userservice.model.User;
import com.fitness.userservice.model.UserRole;
import com.fitness.userservice.userRepository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final mapperUtils mapperUtils;

    public RegisterResponse registerUser(RegisterRequest request) {

       if(userRepository.existsByEmail(request.getEmail())){
           User existingUser = userRepository.findByEmail(request.getEmail());
           return mapperUtils.mapUserToResponse(existingUser);
       }


       User user = User.builder()
               .email(request.getEmail())
               .keycloakId(request.getKeycloakId())
               .firstName(request.getFirstName())
               .lastName(request.getLastName())
               .password(request.getPassword())
               .role(UserRole.USER)
               .build();

       User savedUser = userRepository.save(user);

       return mapperUtils.mapUserToResponse(savedUser);
    }

    public RegisterResponse getUserById(String userId) {
        User user =  userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found : " + userId));

        return mapperUtils.mapUserToResponse(user);
    }

    public boolean existByUserId(String keycloakId) {
        log.info("Validating the user in user service (using keycloakId) : " + keycloakId);
        return userRepository.existsByKeycloakId(keycloakId);
    }
}
