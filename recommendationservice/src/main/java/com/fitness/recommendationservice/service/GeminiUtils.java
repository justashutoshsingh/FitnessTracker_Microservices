package com.fitness.recommendationservice.service;

import com.fitness.recommendationservice.model.Activity;
import lombok.Data;
import org.springframework.stereotype.Component;


@Component
public class GeminiUtils {
    public String buildPrompt(Activity activity) {
        return """
            Analyze this fitness activity and provide detailed recommendations in EXACT JSON format shown below.
            Do not add any extra text, markdown, or code blocks. Return only the JSON object.
            
            Activity Details:
            - Type: %s
            - Duration: %d minutes
            - Calories Burned: %d
            - Start Time: %s
            
            You MUST respond with this exact JSON structure, no deviations:
            {
                "recommendation": "2-3 lines overall verdict about this workout",
                "analysis": "Detailed 3-4 sentence analysis covering: how effective this workout was, whether duration and calories are well balanced, how the timing affects performance, and what this indicates about the user's current fitness level",
                "improvements": [
                    "Specific improvement with reasoning",
                    "Specific improvement with reasoning",
                    "Specific improvement with reasoning"
                ],
                "suggestions": [
                    "Actionable next step suggestion",
                    "Actionable next step suggestion",
                    "Actionable next step suggestion"
                ],
                "safety": [
                    "Safety consideration specific to this activity type and duration",
                    "Safety consideration specific to this activity type and duration",
                    "Safety consideration specific to this activity type and duration"
                ]
            }
            """.formatted(
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getStartTime());
    }
}
