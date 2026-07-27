package com.smarttraders.backend.dto.response;

import com.smarttraders.backend.entity.ChatMessageRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ChatMessageResponse {
    private ChatMessageRole role;
    private String content;
    private LocalDateTime createdAt;
}