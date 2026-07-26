package com.smarttraders.backend.service.impl;

import com.smarttraders.backend.dto.request.TransactionRequest;
import com.smarttraders.backend.dto.response.TransactionResponse;
import com.smarttraders.backend.entity.Crop;
import com.smarttraders.backend.entity.Transaction;
import com.smarttraders.backend.entity.TransactionStatus;
import com.smarttraders.backend.entity.User;
import com.smarttraders.backend.exception.ResourceNotFoundException;
import com.smarttraders.backend.exception.UnauthorizedActionException;
import com.smarttraders.backend.repository.CropRepository;
import com.smarttraders.backend.repository.TransactionRepository;
import com.smarttraders.backend.repository.UserRepository;
import com.smarttraders.backend.service.AuditLogService;
import com.smarttraders.backend.service.NotificationService;
import com.smarttraders.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService; // add to fields
    private final NotificationService notificationService; // add to fields
    

    @Override
    public TransactionResponse createTransaction(TransactionRequest request, String buyerEmail) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + buyerEmail));

        Crop crop = cropRepository.findById(request.getCropId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + request.getCropId()));

                

        Transaction transaction = new Transaction();
        transaction.setCrop(crop);
        transaction.setBuyer(buyer);
        transaction.setQuantity(request.getQuantity());
        transaction.setTotalPrice(request.getQuantity() * crop.getPricePerUnit());
        transaction.setStatus(TransactionStatus.PENDING);

        auditLogService.log(buyerEmail, "CREATE_TRANSACTION", "Transaction id: " + transaction.getId());
        notificationService.createNotification(
    crop.getFarmer().getId(),
    "New purchase request for " + crop.getCropName() + " from " + buyer.getFullName()
);

        return mapToResponse(transactionRepository.save(transaction));
    }

    @Override
    public List<TransactionResponse> getMyPurchases(String buyerEmail) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + buyerEmail));
        return transactionRepository.findByBuyerId(buyer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<TransactionResponse> getMySales(String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + farmerEmail));
        return transactionRepository.findByCrop_Farmer_Id(farmer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public TransactionResponse updateStatus(Long transactionId, String status, String farmerEmail) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        if (!transaction.getCrop().getFarmer().getEmail().equals(farmerEmail)) {
            throw new UnauthorizedActionException("You can only update transactions for your own crops");
        }

        transaction.setStatus(TransactionStatus.valueOf(status.toUpperCase()));

        auditLogService.log(farmerEmail, "UPDATE_TRANSACTION_STATUS", "Transaction id: " + transactionId + ", new status: " + status);
        return mapToResponse(transactionRepository.save(transaction));
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getCrop().getCropName(),
                transaction.getCrop().getFarmer().getFullName(),
                transaction.getBuyer().getFullName(),
                transaction.getQuantity(),
                transaction.getTotalPrice(),
                transaction.getStatus(),
                transaction.getCreatedAt()
        );
    }
}