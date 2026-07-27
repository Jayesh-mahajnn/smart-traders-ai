package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.response.AdminStatsResponse;
import com.smarttraders.backend.dto.response.CropResponse;
import com.smarttraders.backend.dto.response.ProductResponse;
import com.smarttraders.backend.dto.response.TransactionResponse;
import com.smarttraders.backend.entity.*;
import com.smarttraders.backend.exception.ResourceNotFoundException;
import com.smarttraders.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse stats = new AdminStatsResponse(
                userRepository.count(),
                userRepository.countByRole(Role.FARMER),
                userRepository.countByRole(Role.TRADER),
                userRepository.countByRole(Role.VENDOR),
                cropRepository.count(),
                productRepository.count(),
                transactionRepository.count()
        );
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return new ResponseEntity<>(auditLogRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/crops")
    public ResponseEntity<List<CropResponse>> getAllCropsAdmin() {
        List<CropResponse> crops = cropRepository.findAll().stream()
                .map(c -> new CropResponse(
                        c.getId(), c.getCropName(), c.getQuantity(), c.getUnit(),
                        c.getPricePerUnit(), c.getDescription(), c.getFarmer().getFullName(),
                        c.getImageUrl(), c.getCreatedAt()
                ))
                .toList();
        return new ResponseEntity<>(crops, HttpStatus.OK);
    }

    @DeleteMapping("/crops/{id}")
    public ResponseEntity<Void> deleteCropAdmin(@PathVariable Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + id));
        cropRepository.delete(crop);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAllProductsAdmin() {
        List<ProductResponse> products = productRepository.findAll().stream()
                .map(p -> new ProductResponse(
                        p.getId(), p.getProductName(), p.getQuantityNeeded(), p.getUnit(),
                        p.getMaxPricePerUnit(), p.getDescription(), p.getTrader().getFullName(),
                        p.getCreatedAt()
                ))
                .toList();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProductAdmin(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getAllTransactionsAdmin() {
        List<TransactionResponse> transactions = transactionRepository.findAll().stream()
                .map(t -> new TransactionResponse(
                        t.getId(), t.getCrop().getCropName(), t.getCrop().getFarmer().getFullName(),
                        t.getBuyer().getFullName(), t.getQuantity(), t.getTotalPrice(),
                        t.getStatus(), t.getCreatedAt()
                ))
                .toList();
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getAllNotificationsAdmin() {
        return new ResponseEntity<>(notificationRepository.findAll(), HttpStatus.OK);
    }
}