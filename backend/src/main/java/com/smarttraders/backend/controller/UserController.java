package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.request.UpdateLocationRequest;
import com.smarttraders.backend.dto.request.UpdateProfileRequest;
import com.smarttraders.backend.dto.request.UserRegisterRequest;
import com.smarttraders.backend.dto.response.NearbyTraderResponse;
import com.smarttraders.backend.dto.response.UserResponse;
import com.smarttraders.backend.entity.AuditLog;
import com.smarttraders.backend.service.UserService;
import jakarta.validation.Valid;
import com.smarttraders.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuditLogRepository auditLogRepository;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRegisterRequest request) {
        UserResponse response = userService.createUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @PutMapping("/location")
public ResponseEntity<UserResponse> updateLocation(
        @Valid @RequestBody UpdateLocationRequest request, Authentication authentication) {
    return new ResponseEntity<>(userService.updateLocation(request, authentication.getName()), HttpStatus.OK);
}

@GetMapping("/me")
public ResponseEntity<UserResponse> getMyProfile(Authentication authentication) {
    return new ResponseEntity<>(userService.getMyProfile(authentication.getName()), HttpStatus.OK);
}

@PutMapping("/me")
public ResponseEntity<UserResponse> updateProfile(
        @Valid @RequestBody UpdateProfileRequest request, Authentication authentication) {
    return new ResponseEntity<>(userService.updateProfile(request, authentication.getName()), HttpStatus.OK);
}

@GetMapping("/api/admin/audit-logs")
public ResponseEntity<List<AuditLog>> getAuditLogs() {
    return new ResponseEntity<>(auditLogRepository.findAll(), HttpStatus.OK);
}

@GetMapping("/nearby-traders")
public ResponseEntity<List<NearbyTraderResponse>> getNearbyTraders(
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @RequestParam(defaultValue = "50") Double radiusKm) {
    return new ResponseEntity<>(userService.getNearbyTraders(latitude, longitude, radiusKm), HttpStatus.OK);
}

}