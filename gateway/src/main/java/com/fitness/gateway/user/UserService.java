package com.fitness.gateway.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId) {
        try {
            return userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate" , userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .onErrorResume(WebClientResponseException.class , e-> {
                        if(e.getStatusCode() == HttpStatus.NOT_FOUND)
                            return Mono.error(new RuntimeException("User not found : " + userId ));

                        else if(e.getStatusCode() == HttpStatus.BAD_REQUEST)
                                return Mono.error(new RuntimeException("Invalid user id : " + userId));

                        return Mono.error(new  RuntimeException("Unexpected error: " + userId));
                    });
        } catch (WebClientResponseException e) {
            log.error("Cant call the validation controller 😭😭😭");
            e.printStackTrace();
        }

        return Mono.just(false);
    }

    public Mono<RegisterResponse> registerUser(RegisterRequest registerRequest) {
        log.info("Calling User registration API for : " + registerRequest.getEmail());

        try {
            return userServiceWebClient.post()
                    .uri("/api/users/register" )
                    .bodyValue(registerRequest)
                    .retrieve()
                    .bodyToMono(RegisterResponse.class)
                    .onErrorResume(WebClientResponseException.class , e-> {
                        if(e.getStatusCode() == HttpStatus.BAD_REQUEST)
                            return Mono.error(new RuntimeException("Bad Request : " + e.getMessage()));


                        return Mono.error(new  RuntimeException("Unexpected error: " + e.getMessage()));
                    });
        } catch (WebClientResponseException e) {
            log.error("Cant call the registration controller 😭😭😭");
            e.printStackTrace();
        }

        return Mono.just(null);
    }
}
