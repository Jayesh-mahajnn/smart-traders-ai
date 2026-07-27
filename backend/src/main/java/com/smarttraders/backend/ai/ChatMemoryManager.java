package com.smarttraders.backend.ai;

import com.smarttraders.backend.entity.ChatMessage;
import com.smarttraders.backend.entity.ChatMessageRole;
import com.smarttraders.backend.repository.ChatMessageRepository;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class ChatMemoryManager {

    private final ChatMessageRepository chatMessageRepository;
    private final Map<String, ChatMemory> memoryByUser = new ConcurrentHashMap<>();

    public ChatMemory getMemoryForUser(String userEmail) {
        return memoryByUser.computeIfAbsent(userEmail, email -> rebuildMemoryFromDb(email));
    }

    private ChatMemory rebuildMemoryFromDb(String userEmail) {
        ChatMemory memory = MessageWindowChatMemory.withMaxMessages(20);

        chatMessageRepository.findByUserEmailOrderByCreatedAtAsc(userEmail)
                .forEach(msg -> {
                    if (msg.getRole() == ChatMessageRole.USER) {
                        memory.add(UserMessage.from(msg.getContent()));
                    } else {
                        memory.add(AiMessage.from(msg.getContent()));
                    }
                });

        return memory;
    }

    public void addUserMessage(String userEmail, String content) {
        getMemoryForUser(userEmail).add(UserMessage.from(content));
        persistMessage(userEmail, ChatMessageRole.USER, content);
    }

    public void addAiMessage(String userEmail, String content) {
        getMemoryForUser(userEmail).add(AiMessage.from(content));
        persistMessage(userEmail, ChatMessageRole.AI, content);
    }

    private void persistMessage(String userEmail, ChatMessageRole role, String content) {
        ChatMessage message = new ChatMessage();
        message.setUserEmail(userEmail);
        message.setRole(role);
        message.setContent(content);
        chatMessageRepository.save(message);
    }

    public void clearMemoryForUser(String userEmail) {
        memoryByUser.remove(userEmail);
        chatMessageRepository.deleteByUserEmail(userEmail);
    }
}