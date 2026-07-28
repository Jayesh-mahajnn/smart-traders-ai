package com.smarttraders.backend.repository;

import com.smarttraders.backend.entity.Crop;
import com.smarttraders.backend.entity.Role;
import com.smarttraders.backend.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class CropRepositoryIntegrationTest {

    @Autowired private CropRepository cropRepository;
    @Autowired private UserRepository userRepository;

    @Test
    void saveCrop_andFindByFarmerId_returnsCorrectCrop() {
        User farmer = new User();
        farmer.setFullName("Integration Farmer");
        farmer.setEmail("integration-farmer@test.com");
        farmer.setPassword("hashedplaceholder");
        farmer.setRole(Role.FARMER);
        User savedFarmer = userRepository.save(farmer);

        Crop crop = new Crop();
        crop.setCropName("Rice");
        crop.setQuantity(200.0);
        crop.setUnit("kg");
        crop.setPricePerUnit(30.0);
        crop.setFarmer(savedFarmer);
        cropRepository.save(crop);

        var results = cropRepository.findByFarmerId(savedFarmer.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCropName()).isEqualTo("Rice");
    }
}