package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.response.ChatMessageResponse;

import java.util.List;

public interface ChatService {
    String sendMessage(String userEmail, String userMessage);
    List<ChatMessageResponse> getHistory(String userEmail);
    void clearHistory(String userEmail);
}