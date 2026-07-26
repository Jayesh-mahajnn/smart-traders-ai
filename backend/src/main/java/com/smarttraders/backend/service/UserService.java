package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.request.LoginRequest;
import com.smarttraders.backend.dto.request.UserRegisterRequest;
import com.smarttraders.backend.dto.response.LoginResponse;
import com.smarttraders.backend.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRegisterRequest request);
    List<UserResponse> getAllUsers();
    LoginResponse login(LoginRequest request);
}