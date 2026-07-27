package com.smarttraders.backend.ai;

import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatMemoryManager {

    private final Map<String, ChatMemory> memoryByUser = new ConcurrentHashMap<>();

    public ChatMemory getMemoryForUser(String userEmail) {
        return memoryByUser.computeIfAbsent(userEmail, email ->
                MessageWindowChatMemory.withMaxMessages(20)
        );
    }

    public void clearMemoryForUser(String userEmail) {
        memoryByUser.remove(userEmail);
    }
}