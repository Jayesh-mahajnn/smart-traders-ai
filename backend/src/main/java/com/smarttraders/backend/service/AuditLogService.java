package com.smarttraders.backend.service;

public interface AuditLogService {
    void log(String userEmail, String action, String details);
}