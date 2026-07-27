package com.smarttraders.backend.service.impl;

import com.smarttraders.backend.dto.request.CropRequest;
import com.smarttraders.backend.dto.response.CropResponse;
import com.smarttraders.backend.entity.Crop;
import com.smarttraders.backend.entity.User;
import com.smarttraders.backend.exception.ResourceNotFoundException;
import com.smarttraders.backend.exception.UnauthorizedActionException;
import com.smarttraders.backend.repository.CropRepository;
import com.smarttraders.backend.repository.UserRepository;
import com.smarttraders.backend.service.CropService;
import com.smarttraders.backend.service.FileStorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.smarttraders.backend.repository.spec.CropSpecification;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    

    @Override
    public CropResponse createCrop(CropRequest request, String farmerEmail) {
        User farmer = getFarmerByEmail(farmerEmail);

        Crop crop = new Crop();
        crop.setCropName(request.getCropName());
        crop.setQuantity(request.getQuantity());
        crop.setUnit(request.getUnit());
        crop.setPricePerUnit(request.getPricePerUnit());
        crop.setDescription(request.getDescription());
        crop.setFarmer(farmer);

        Crop savedCrop = cropRepository.save(crop);
        return mapToResponse(savedCrop);
    }
    

    @Override
    public List<CropResponse> getMyCrops(String farmerEmail) {
        User farmer = getFarmerByEmail(farmerEmail);
        return cropRepository.findByFarmerId(farmer.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CropResponse> getAllCrops() {
        return cropRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CropResponse updateCrop(Long cropId, CropRequest request, String farmerEmail) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + cropId));

        if (!crop.getFarmer().getEmail().equals(farmerEmail)) {
            throw new UnauthorizedActionException("You can only update your own crops");
        }

        crop.setCropName(request.getCropName());
        crop.setQuantity(request.getQuantity());
        crop.setUnit(request.getUnit());
        crop.setPricePerUnit(request.getPricePerUnit());
        crop.setDescription(request.getDescription());

        Crop updatedCrop = cropRepository.save(crop);
        return mapToResponse(updatedCrop);
    }

    @Override
    public void deleteCrop(Long cropId, String farmerEmail) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + cropId));

        if (!crop.getFarmer().getEmail().equals(farmerEmail)) {
            throw new UnauthorizedActionException("You can only delete your own crops");
        }

        cropRepository.delete(crop);
    }

    private User getFarmerByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

     @Override
public List<CropResponse> searchCrops(String cropName, Double minPrice, Double maxPrice) {
    Specification<Crop> spec = Specification
            .where(CropSpecification.hasCropName(cropName))
            .and(CropSpecification.hasMinPrice(minPrice))
            .and(CropSpecification.hasMaxPrice(maxPrice));

    return cropRepository.findAll(spec)
            .stream()
            .map(this::mapToResponse)
            .toList();
} 

private final FileStorageService fileStorageService; // add to fields

@Override
public CropResponse uploadImage(Long cropId, MultipartFile file, String farmerEmail) {
    Crop crop = cropRepository.findById(cropId)
            .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + cropId));

    if (!crop.getFarmer().getEmail().equals(farmerEmail)) {
        throw new UnauthorizedActionException("You can only update your own crops");
    }

    String imageUrl = fileStorageService.storeFile(file);
    crop.setImageUrl(imageUrl);

    return mapToResponse(cropRepository.save(crop));
}

@Override
public Page<CropResponse> searchCropsPaginated(String cropName, Double minPrice, Double maxPrice, Pageable pageable) {
    Specification<Crop> spec = Specification
            .where(CropSpecification.hasCropName(cropName))
            .and(CropSpecification.hasMinPrice(minPrice))
            .and(CropSpecification.hasMaxPrice(maxPrice));

    return cropRepository.findAll(spec, pageable).map(this::mapToResponse);
}
@Override
public CropResponse getCropById(Long cropId) {
    Crop crop = cropRepository.findById(cropId)
            .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + cropId));
    return mapToResponse(crop);
}


    private CropResponse mapToResponse(Crop crop) {
    return new CropResponse(
            crop.getId(),
            crop.getCropName(),
            crop.getQuantity(),
            crop.getUnit(),
            crop.getPricePerUnit(),
            crop.getDescription(),
            crop.getFarmer().getFullName(),
            crop.getImageUrl(),
            crop.getCreatedAt()
    );
}
}