package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.request.VendorListingRequest;
import com.smarttraders.backend.dto.response.VendorListingResponse;
import com.smarttraders.backend.service.VendorListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor-listings")
@RequiredArgsConstructor
public class VendorListingController {

    private final VendorListingService vendorListingService;

    @PostMapping
    public ResponseEntity<VendorListingResponse> createListing(
            @Valid @RequestBody VendorListingRequest request, Authentication authentication) {
        VendorListingResponse response = vendorListingService.createListing(request, authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<VendorListingResponse>> getMyListings(Authentication authentication) {
        return new ResponseEntity<>(vendorListingService.getMyListings(authentication.getName()), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<VendorListingResponse>> getAllListings() {
        return new ResponseEntity<>(vendorListingService.getAllListings(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorListingResponse> updateListing(
            @PathVariable Long id, @Valid @RequestBody VendorListingRequest request, Authentication authentication) {
        VendorListingResponse response = vendorListingService.updateListing(id, request, authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id, Authentication authentication) {
        vendorListingService.deleteListing(id, authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}