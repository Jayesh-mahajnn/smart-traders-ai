package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {
    void createNotification(Long userId, String message);
    List<NotificationResponse> getMyNotifications(String email);
    void markAsRead(Long notificationId, String email);
}