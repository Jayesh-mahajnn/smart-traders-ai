package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.request.CropRequest;
import com.smarttraders.backend.entity.Crop;
import com.smarttraders.backend.entity.Role;
import com.smarttraders.backend.entity.User;
import com.smarttraders.backend.exception.ResourceNotFoundException;
import com.smarttraders.backend.exception.UnauthorizedActionException;
import com.smarttraders.backend.repository.CropRepository;
import com.smarttraders.backend.repository.UserRepository;
import com.smarttraders.backend.service.impl.CropServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CropServiceImplTest {

    @Mock private CropRepository cropRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private CropServiceImpl cropService;

    private User farmer;
    private Crop crop;

    @BeforeEach
    void setUp() {
        farmer = new User();
        farmer.setId(1L);
        farmer.setEmail("farmer@test.com");
        farmer.setFullName("Test Farmer");
        farmer.setRole(Role.FARMER);

        crop = new Crop();
        crop.setId(10L);
        crop.setCropName("Tomato");
        crop.setQuantity(100.0);
        crop.setUnit("kg");
        crop.setPricePerUnit(20.0);
        crop.setFarmer(farmer);
    }

    @Test
    void createCrop_success_savesAndReturnsMappedResponse() {
        when(userRepository.findByEmail("farmer@test.com")).thenReturn(Optional.of(farmer));
        when(cropRepository.save(any(Crop.class))).thenReturn(crop);

        CropRequest request = new CropRequest();
        request.setCropName("Tomato");
        request.setQuantity(100.0);
        request.setUnit("kg");
        request.setPricePerUnit(20.0);

        var response = cropService.createCrop(request, "farmer@test.com");

        assertThat(response.getCropName()).isEqualTo("Tomato");
        assertThat(response.getFarmerName()).isEqualTo("Test Farmer");
        verify(cropRepository, times(1)).save(any(Crop.class));
    }

    @Test
    void updateCrop_wrongOwner_throwsUnauthorized() {
        when(cropRepository.findById(10L)).thenReturn(Optional.of(crop));

        CropRequest request = new CropRequest();
        request.setCropName("Wheat");
        request.setQuantity(50.0);
        request.setUnit("kg");
        request.setPricePerUnit(15.0);

        assertThatThrownBy(() -> cropService.updateCrop(10L, request, "someoneelse@test.com"))
                .isInstanceOf(UnauthorizedActionException.class);

        verify(cropRepository, never()).save(any());
    }

    @Test
    void updateCrop_cropNotFound_throwsResourceNotFound() {
        when(cropRepository.findById(999L)).thenReturn(Optional.empty());

        CropRequest request = new CropRequest();

        assertThatThrownBy(() -> cropService.updateCrop(999L, request, "farmer@test.com"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}