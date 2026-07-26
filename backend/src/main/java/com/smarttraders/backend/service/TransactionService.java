package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.request.TransactionRequest;
import com.smarttraders.backend.dto.response.TransactionResponse;

import java.util.List;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request, String buyerEmail);
    List<TransactionResponse> getMyPurchases(String buyerEmail);
    List<TransactionResponse> getMySales(String farmerEmail);
    TransactionResponse updateStatus(Long transactionId, String status, String farmerEmail);
}