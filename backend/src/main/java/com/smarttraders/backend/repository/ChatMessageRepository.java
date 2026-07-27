package com.smarttraders.backend.repository;

import com.smarttraders.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserEmailOrderByCreatedAtAsc(String userEmail);
    void deleteByUserEmail(String userEmail);
}