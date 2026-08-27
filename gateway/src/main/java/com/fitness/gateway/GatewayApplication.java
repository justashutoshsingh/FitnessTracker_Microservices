package com.fitness.gateway;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

	@Bean
	public CommandLineRunner printLoadedRoutes(RouteDefinitionLocator locator) {
		return args -> {
			System.out.println("====== GATEWAY LOADED ROUTES ======");
			locator.getRouteDefinitions().subscribe(route -> {
				System.out.println("🚀 Route ID: " + route.getId() + " | URI: " + route.getUri());
				System.out.println("   Predicates: " + route.getPredicates());
			});
		};
	}

}
