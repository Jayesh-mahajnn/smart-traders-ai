package com.smarttraders.backend.service.impl;

import com.smarttraders.backend.ai.ChatMemoryManager;
import com.smarttraders.backend.ai.RagContextService;
import com.smarttraders.backend.dto.response.ChatMessageResponse;
import com.smarttraders.backend.repository.ChatMessageRepository;
import com.smarttraders.backend.service.ChatService;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
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

            When platform listing data is provided below under "Current relevant listings",
            base your answer only on that data and do not invent prices or quantities beyond
            what is listed.
            """;

    private final ChatLanguageModel chatLanguageModel;
    private final ChatMemoryManager chatMemoryManager;
    private final ChatMessageRepository chatMessageRepository;
    private final RagContextService ragContextService;

    @Override
    public String sendMessage(String userEmail, String userMessage) {
        chatMemoryManager.addUserMessage(userEmail, userMessage);

        ChatMemory memory = chatMemoryManager.getMemoryForUser(userEmail);

        String cropContext = ragContextService.buildCropContext(userMessage);
        String fullSystemPrompt = cropContext.isEmpty()
                ? SYSTEM_PROMPT
                : SYSTEM_PROMPT + "\n\n" + cropContext;

        List<ChatMessage> messagesWithSystemPrompt = new ArrayList<>();
        messagesWithSystemPrompt.add(SystemMessage.from(fullSystemPrompt));
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