package com.smarttraders.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NearbyTraderResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
}