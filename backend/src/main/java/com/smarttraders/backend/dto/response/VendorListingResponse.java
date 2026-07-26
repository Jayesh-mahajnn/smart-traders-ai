package com.smarttraders.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class VendorListingResponse {
    private Long id;
    private String itemName;
    private String category;
    private Double pricePerUnit;
    private String unit;
    private String description;
    private String vendorName;
    private LocalDateTime createdAt;
}