package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.request.CropRequest;
import com.smarttraders.backend.dto.response.CropResponse;
import com.smarttraders.backend.service.CropService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @PostMapping
    public ResponseEntity<CropResponse> createCrop(
            @Valid @RequestBody CropRequest request, Authentication authentication) {
        CropResponse response = cropService.createCrop(request, authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @PostMapping("/{id}/image")
public ResponseEntity<CropResponse> uploadCropImage(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file,
        Authentication authentication) {
    return new ResponseEntity<>(cropService.uploadImage(id, file, authentication.getName()), HttpStatus.OK);
}

    @GetMapping("/my-crops")
    public ResponseEntity<List<CropResponse>> getMyCrops(Authentication authentication) {
        return new ResponseEntity<>(cropService.getMyCrops(authentication.getName()), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CropResponse>> getAllCrops() {
        return new ResponseEntity<>(cropService.getAllCrops(), HttpStatus.OK);
    }

    @GetMapping("/search")
public ResponseEntity<List<CropResponse>> searchCrops(
        @RequestParam(required = false) String cropName,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice) {
    return new ResponseEntity<>(cropService.searchCrops(cropName, minPrice, maxPrice), HttpStatus.OK);
}

@GetMapping("/search/paginated")
public ResponseEntity<Page<CropResponse>> searchCropsPaginated(
        @RequestParam(required = false) String cropName,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        Pageable pageable) {
    return new ResponseEntity<>(
            cropService.searchCropsPaginated(cropName, minPrice, maxPrice, pageable), HttpStatus.OK);
}
@GetMapping("/{id}")
public ResponseEntity<CropResponse> getCropById(@PathVariable Long id) {
    return new ResponseEntity<>(cropService.getCropById(id), HttpStatus.OK);
}

    @PutMapping("/{id}")
    public ResponseEntity<CropResponse> updateCrop(
            @PathVariable Long id, @Valid @RequestBody CropRequest request, Authentication authentication) {
        CropResponse response = cropService.updateCrop(id, request, authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id, Authentication authentication) {
        cropService.deleteCrop(id, authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}