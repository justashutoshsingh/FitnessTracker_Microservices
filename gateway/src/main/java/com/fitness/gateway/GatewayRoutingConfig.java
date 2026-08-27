package com.fitness.gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutingConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-servcie", r -> r.path("/api/users/**")
                        .uri("lb://USER-SERVICE"))
                .route("activity-service", r -> r.path("/api/activities/**")
                        .uri("lb://ACTIVITY-SERVICE"))
                .route("recommendation-service", r -> r.path("/api/recommendations/**")
                        .uri("lb://RECOMMENDATION-SERVICE"))
                .build();
    }
}