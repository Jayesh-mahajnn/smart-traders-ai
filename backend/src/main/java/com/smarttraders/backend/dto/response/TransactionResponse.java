package com.smarttraders.backend.dto.response;

import com.smarttraders.backend.entity.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String cropName;
    private String farmerName;
    private String buyerName;
    private Double quantity;
    private Double totalPrice;
    private TransactionStatus status;
    private LocalDateTime createdAt;
}