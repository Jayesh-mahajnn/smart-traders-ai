package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.request.LoginRequest;
import com.smarttraders.backend.dto.request.UpdateLocationRequest;
import com.smarttraders.backend.dto.request.UserRegisterRequest;
import com.smarttraders.backend.dto.response.LoginResponse;
import com.smarttraders.backend.dto.response.NearbyTraderResponse;
import com.smarttraders.backend.dto.response.UserResponse;
import com.smarttraders.backend.dto.request.UpdateProfileRequest;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRegisterRequest request);
    List<UserResponse> getAllUsers();
    LoginResponse login(LoginRequest request);

    UserResponse updateLocation(UpdateLocationRequest request, String email);
    List<NearbyTraderResponse> getNearbyTraders(Double latitude, Double longitude, Double radiusKm);
    UserResponse getMyProfile(String email);
    UserResponse updateProfile(UpdateProfileRequest request, String email);
}