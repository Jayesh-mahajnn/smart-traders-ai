package com.smarttraders.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CropResponse {

    private Long id;
    private String cropName;
    private Double quantity;
    private String unit;
    private Double pricePerUnit;
    private String description;
    private String farmerName;
    private String imageUrl;      // Add this
    private LocalDateTime createdAt;
}