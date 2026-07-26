package com.smarttraders.backend.controller;

import com.smarttraders.backend.dto.response.AdminStatsResponse;
import com.smarttraders.backend.entity.AuditLog;
import com.smarttraders.backend.entity.Role;
import com.smarttraders.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}