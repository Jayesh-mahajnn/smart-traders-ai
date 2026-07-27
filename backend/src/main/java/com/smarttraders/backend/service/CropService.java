package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.request.CropRequest;
import com.smarttraders.backend.dto.response.CropResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface CropService {
    CropResponse createCrop(CropRequest request, String farmerEmail);
    List<CropResponse> getMyCrops(String farmerEmail);
    List<CropResponse> getAllCrops();
    List<CropResponse> searchCrops(String cropName, Double minPrice, Double maxPrice);
    CropResponse updateCrop(Long cropId, CropRequest request, String farmerEmail);
    CropResponse uploadImage(Long cropId, MultipartFile file, String farmerEmail);
    Page<CropResponse> searchCropsPaginated(String cropName, Double minPrice, Double maxPrice, Pageable pageable);
    void deleteCrop(Long cropId, String farmerEmail);
    CropResponse getCropById(Long cropId);
}