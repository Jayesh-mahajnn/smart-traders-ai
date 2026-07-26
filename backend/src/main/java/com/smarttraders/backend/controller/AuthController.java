package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.request.LoginRequest;
import com.smarttraders.backend.dto.request.UserRegisterRequest;
import com.smarttraders.backend.dto.response.LoginResponse;
import com.smarttraders.backend.dto.response.UserResponse;
import com.smarttraders.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        UserResponse response = userService.createUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

   @PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    LoginResponse response = userService.login(request);
    return new ResponseEntity<>(response, HttpStatus.OK);
}
}