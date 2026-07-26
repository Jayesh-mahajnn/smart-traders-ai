package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.request.UpdateLocationRequest;
import com.smarttraders.backend.dto.request.UserRegisterRequest;
import com.smarttraders.backend.dto.response.NearbyTraderResponse;
import com.smarttraders.backend.dto.response.UserResponse;
import com.smarttraders.backend.service.UserService;
import jakarta.validation.Valid;
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

@GetMapping("/nearby-traders")
public ResponseEntity<List<NearbyTraderResponse>> getNearbyTraders(
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @RequestParam(defaultValue = "50") Double radiusKm) {
    return new ResponseEntity<>(userService.getNearbyTraders(latitude, longitude, radiusKm), HttpStatus.OK);
}
}