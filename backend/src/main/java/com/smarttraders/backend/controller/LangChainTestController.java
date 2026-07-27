package com.smarttraders.backend.controller;

import com.smarttraders.backend.ai.ChatMemoryManager;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LangChainTestController {

    private final ChatLanguageModel chatLanguageModel;
    private final ChatMemoryManager chatMemoryManager;

    @GetMapping("/api/langchain-test")
    public String testLangChain(@RequestParam String prompt, Authentication authentication) {
        String userEmail = authentication.getName();

        chatMemoryManager.addUserMessage(userEmail, prompt);

        ChatMemory memory = chatMemoryManager.getMemoryForUser(userEmail);
        AiMessage aiResponse = chatLanguageModel.generate(memory.messages()).content();

        chatMemoryManager.addAiMessage(userEmail, aiResponse.text());

        return aiResponse.text();
    }
}