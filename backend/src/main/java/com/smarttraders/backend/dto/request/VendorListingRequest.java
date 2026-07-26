package com.smarttraders.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VendorListingRequest {

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Price per unit is required")
    @Positive(message = "Price must be greater than zero")
    private Double pricePerUnit;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String description;
}