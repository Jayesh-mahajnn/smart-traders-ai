package com.smarttraders.backend.controller;

import com.smarttraders.backend.ai.OllamaClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AiTestController {

    private final OllamaClient ollamaClient;

    @GetMapping("/api/ai-test")
    public String testAi(@RequestParam(defaultValue = "Say hello in one sentence") String prompt) {
        return ollamaClient.generate(prompt);
    }
}