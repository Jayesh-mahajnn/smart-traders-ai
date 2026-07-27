package com.smarttraders.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message must be under 2000 characters")
    private String message;
}