package com.smarttraders.backend.repository;

import com.smarttraders.backend.entity.VendorListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorListingRepository extends JpaRepository<VendorListing, Long> {
    List<VendorListing> findByVendorId(Long vendorId);
}