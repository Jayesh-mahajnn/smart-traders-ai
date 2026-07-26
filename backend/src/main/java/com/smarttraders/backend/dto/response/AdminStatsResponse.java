package com.smarttraders.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalFarmers;
    private long totalTraders;
    private long totalVendors;
    private long totalCrops;
    private long totalProducts;
    private long totalTransactions;
}