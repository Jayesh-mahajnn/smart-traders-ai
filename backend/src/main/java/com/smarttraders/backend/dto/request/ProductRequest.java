package com.smarttraders.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotNull(message = "Quantity needed is required")
    @Positive(message = "Quantity must be greater than zero")
    private Double quantityNeeded;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Max price per unit is required")
    @Positive(message = "Max price must be greater than zero")
    private Double maxPricePerUnit;

    private String description;
}