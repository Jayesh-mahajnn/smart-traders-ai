package com.smarttraders.backend.controller;

import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LangChainTestController {

    private final ChatLanguageModel chatLanguageModel;

    @GetMapping("/api/langchain-test")
    public String testLangChain(@RequestParam(defaultValue = "Say hello in one sentence") String prompt) {
        return chatLanguageModel.generate(prompt);
    }
}