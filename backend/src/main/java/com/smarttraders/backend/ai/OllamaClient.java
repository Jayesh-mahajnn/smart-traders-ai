package com.smarttraders.backend.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OllamaClient {

    private final RestClient restClient;

    @Value("${ai.ollama.model}")
    private String model;

    public OllamaClient(@Value("${ai.ollama.base-url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public String generate(String prompt) {
        OllamaRequest request = new OllamaRequest(model, prompt, false);

        OllamaResponse response = restClient.post()
                .uri("/api/generate")
                .body(request)
                .retrieve()
                .body(OllamaResponse.class);

        return response != null ? response.getResponse() : "AI service returned no response.";
    }
}