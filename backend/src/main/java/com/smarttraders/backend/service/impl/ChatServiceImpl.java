package com.smarttraders.backend.service.impl;

import com.smarttraders.backend.ai.ChatMemoryManager;
import com.smarttraders.backend.dto.response.ChatMessageResponse;
import com.smarttraders.backend.repository.ChatMessageRepository;
import com.smarttraders.backend.service.ChatService;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final String SYSTEM_PROMPT = """
            You are an agricultural assistant for Smart Traders AI, a marketplace connecting
            farmers, traders, and vendors in India. You help users with crop information,
            fair pricing guidance, and general farming/trading questions. Keep answers concise
            and practical. If asked about specific live prices or platform data you don't have
            access to, say so honestly rather than guessing.
            """;

    private final ChatLanguageModel chatLanguageModel;
    private final ChatMemoryManager chatMemoryManager;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public String sendMessage(String userEmail, String userMessage) {
        chatMemoryManager.addUserMessage(userEmail, userMessage);

        ChatMemory memory = chatMemoryManager.getMemoryForUser(userEmail);

        List<ChatMessage> messagesWithSystemPrompt = new ArrayList<>();
        messagesWithSystemPrompt.add(SystemMessage.from(SYSTEM_PROMPT));
        messagesWithSystemPrompt.addAll(memory.messages());

        AiMessage aiResponse = chatLanguageModel.generate(messagesWithSystemPrompt).content();

        chatMemoryManager.addAiMessage(userEmail, aiResponse.text());

        return aiResponse.text();
    }

    @Override
    public List<ChatMessageResponse> getHistory(String userEmail) {
        return chatMessageRepository.findByUserEmailOrderByCreatedAtAsc(userEmail)
                .stream()
                .map(msg -> new ChatMessageResponse(msg.getRole(), msg.getContent(), msg.getCreatedAt()))
                .toList();
    }

    @Override
    public void clearHistory(String userEmail) {
        chatMemoryManager.clearMemoryForUser(userEmail);
    }
}