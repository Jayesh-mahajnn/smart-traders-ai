package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.request.CropRequest;
import com.smarttraders.backend.dto.response.CropResponse;

import java.util.List;

public interface CropService {
    CropResponse createCrop(CropRequest request, String farmerEmail);
    List<CropResponse> getMyCrops(String farmerEmail);
    List<CropResponse> getAllCrops();
    List<CropResponse> searchCrops(String cropName, Double minPrice, Double maxPrice);
    CropResponse updateCrop(Long cropId, CropRequest request, String farmerEmail);
    void deleteCrop(Long cropId, String farmerEmail);
}