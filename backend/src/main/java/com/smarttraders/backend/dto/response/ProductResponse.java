package com.smarttraders.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String productName;
    private Double quantityNeeded;
    private String unit;
    private Double maxPricePerUnit;
    private String description;
    private String traderName;
    private LocalDateTime createdAt;
}