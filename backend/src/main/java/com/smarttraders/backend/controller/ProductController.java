package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.request.ProductRequest;
import com.smarttraders.backend.dto.response.ProductResponse;
import com.smarttraders.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request, Authentication authentication) {
        ProductResponse response = productService.createProduct(request, authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(Authentication authentication) {
        return new ResponseEntity<>(productService.getMyProducts(authentication.getName()), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
    }
}