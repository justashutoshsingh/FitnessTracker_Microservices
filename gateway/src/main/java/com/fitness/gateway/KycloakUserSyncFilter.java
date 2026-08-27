package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.text.ParseException;

@Component
@Slf4j
@RequiredArgsConstructor
public class KycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String userKeycloakId = exchange.getRequest().getHeaders().getFirst("X-UserKeycloak-ID");

        String token =  exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return Mono.error(new RuntimeException("Missing or invalid Authorization header"));
        }

        RegisterRequest registerRequest = getUserDetails(token);


        if(userKeycloakId == null){
            userKeycloakId = registerRequest.getKeycloakId();
        }


        if(userKeycloakId != null && token != null) {
            String finaluserKeycloakId = userKeycloakId;
            return userService.validateUser(userKeycloakId)
                    .flatMap(exist -> {
                        if(!exist){
                            if(registerRequest != null)
                              return userService.registerUser(registerRequest)
                                      .then(Mono.empty());

                            else
                                return Mono.empty();

                        } else {
                            log.info("user already exist , Skipping sync");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-UserKeycloak-ID" , finaluserKeycloakId)
                                .build();
                        log.info("Header being set: X-UserKeycloak-ID = {}", finaluserKeycloakId);
                        log.info("Mutated request headers: {}", mutatedRequest.getHeaders().get("X-UserKeycloak-ID"));
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }



        return Mono.empty();
    }

    private RegisterRequest getUserDetails(String token) {
        try{
            String tokenWithoutBearer = token.substring("Bearer ".length());
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));
            registerRequest.setPassword("12345@Ashu");

            return  registerRequest;

        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

    }
}
