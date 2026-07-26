package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.request.VendorListingRequest;
import com.smarttraders.backend.dto.response.VendorListingResponse;

import java.util.List;

public interface VendorListingService {
    VendorListingResponse createListing(VendorListingRequest request, String vendorEmail);
    List<VendorListingResponse> getMyListings(String vendorEmail);
    List<VendorListingResponse> getAllListings();
    VendorListingResponse updateListing(Long listingId, VendorListingRequest request, String vendorEmail);
    void deleteListing(Long listingId, String vendorEmail);
}