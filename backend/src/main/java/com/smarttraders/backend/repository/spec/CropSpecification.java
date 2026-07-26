package com.smarttraders.backend.repository.spec;

import com.smarttraders.backend.entity.Crop;
import org.springframework.data.jpa.domain.Specification;

public class CropSpecification {

    public static Specification<Crop> hasCropName(String cropName) {
        return (root, query, criteriaBuilder) -> {
            if (cropName == null || cropName.isBlank()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("cropName")),
                    "%" + cropName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Crop> hasMinPrice(Double minPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("pricePerUnit"), minPrice);
        };
    }

    public static Specification<Crop> hasMaxPrice(Double maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (maxPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("pricePerUnit"), maxPrice);
        };
    }
}