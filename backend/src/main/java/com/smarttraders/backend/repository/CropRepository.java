package com.smarttraders.backend.repository;

import com.smarttraders.backend.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long>, JpaSpecificationExecutor<Crop> {
    List<Crop> findByFarmerId(Long farmerId);
}