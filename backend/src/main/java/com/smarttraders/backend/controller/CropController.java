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

    @GetMapping("/my-crops")
    public ResponseEntity<List<CropResponse>> getMyCrops(Authentication authentication) {
        return new ResponseEntity<>(cropService.getMyCrops(authentication.getName()), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CropResponse>> getAllCrops() {
        return new ResponseEntity<>(cropService.getAllCrops(), HttpStatus.OK);
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