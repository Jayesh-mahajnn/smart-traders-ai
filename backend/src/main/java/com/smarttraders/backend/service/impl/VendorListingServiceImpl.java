package com.smarttraders.backend.service.impl;

import com.smarttraders.backend.dto.request.VendorListingRequest;
import com.smarttraders.backend.dto.response.VendorListingResponse;
import com.smarttraders.backend.entity.User;
import com.smarttraders.backend.entity.VendorListing;
import com.smarttraders.backend.exception.ResourceNotFoundException;
import com.smarttraders.backend.exception.UnauthorizedActionException;
import com.smarttraders.backend.repository.UserRepository;
import com.smarttraders.backend.repository.VendorListingRepository;
import com.smarttraders.backend.service.VendorListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorListingServiceImpl implements VendorListingService {

    private final VendorListingRepository vendorListingRepository;
    private final UserRepository userRepository;

    @Override
    public VendorListingResponse createListing(VendorListingRequest request, String vendorEmail) {
        User vendor = getVendorByEmail(vendorEmail);

        VendorListing listing = new VendorListing();
        listing.setItemName(request.getItemName());
        listing.setCategory(request.getCategory());
        listing.setPricePerUnit(request.getPricePerUnit());
        listing.setUnit(request.getUnit());
        listing.setDescription(request.getDescription());
        listing.setVendor(vendor);

        VendorListing savedListing = vendorListingRepository.save(listing);
        return mapToResponse(savedListing);
    }

    @Override
    public List<VendorListingResponse> getMyListings(String vendorEmail) {
        User vendor = getVendorByEmail(vendorEmail);
        return vendorListingRepository.findByVendorId(vendor.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<VendorListingResponse> getAllListings() {
        return vendorListingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public VendorListingResponse updateListing(Long listingId, VendorListingRequest request, String vendorEmail) {
        VendorListing listing = vendorListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor listing not found with id: " + listingId));

        if (!listing.getVendor().getEmail().equals(vendorEmail)) {
            throw new UnauthorizedActionException("You can only update your own listings");
        }

        listing.setItemName(request.getItemName());
        listing.setCategory(request.getCategory());
        listing.setPricePerUnit(request.getPricePerUnit());
        listing.setUnit(request.getUnit());
        listing.setDescription(request.getDescription());

        VendorListing updatedListing = vendorListingRepository.save(listing);
        return mapToResponse(updatedListing);
    }

    @Override
    public void deleteListing(Long listingId, String vendorEmail) {
        VendorListing listing = vendorListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor listing not found with id: " + listingId));

        if (!listing.getVendor().getEmail().equals(vendorEmail)) {
            throw new UnauthorizedActionException("You can only delete your own listings");
        }

        vendorListingRepository.delete(listing);
    }

    private User getVendorByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private VendorListingResponse mapToResponse(VendorListing listing) {
        return new VendorListingResponse(
                listing.getId(),
                listing.getItemName(),
                listing.getCategory(),
                listing.getPricePerUnit(),
                listing.getUnit(),
                listing.getDescription(),
                listing.getVendor().getFullName(),
                listing.getCreatedAt()
        );
    }
}