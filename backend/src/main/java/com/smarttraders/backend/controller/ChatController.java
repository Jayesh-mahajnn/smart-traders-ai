package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.request.ChatRequest;
import com.smarttraders.backend.dto.response.ChatMessageResponse;
import com.smarttraders.backend.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> sendMessage(
            @Valid @RequestBody ChatRequest request, Authentication authentication) {
        String reply = chatService.sendMessage(authentication.getName(), request.getMessage());
        return new ResponseEntity<>(Map.of("reply", reply), HttpStatus.OK);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageResponse>> getHistory(Authentication authentication) {
        return new ResponseEntity<>(chatService.getHistory(authentication.getName()), HttpStatus.OK);
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearHistory(Authentication authentication) {
        chatService.clearHistory(authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}