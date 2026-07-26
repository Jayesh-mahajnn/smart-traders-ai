package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.request.TransactionRequest;
import com.smarttraders.backend.dto.response.TransactionResponse;
import com.smarttraders.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request, Authentication authentication) {
        return new ResponseEntity<>(
                transactionService.createTransaction(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping("/my-purchases")
    public ResponseEntity<List<TransactionResponse>> getMyPurchases(Authentication authentication) {
        return new ResponseEntity<>(transactionService.getMyPurchases(authentication.getName()), HttpStatus.OK);
    }

    @GetMapping("/my-sales")
    public ResponseEntity<List<TransactionResponse>> getMySales(Authentication authentication) {
        return new ResponseEntity<>(transactionService.getMySales(authentication.getName()), HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TransactionResponse> updateStatus(
            @PathVariable Long id, @RequestParam String status, Authentication authentication) {
        return new ResponseEntity<>(
                transactionService.updateStatus(id, status, authentication.getName()), HttpStatus.OK);
    }
}