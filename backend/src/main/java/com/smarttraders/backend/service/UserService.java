package com.smarttraders.backend.service;

import com.smarttraders.backend.entity.User;

import java.util.List;

public interface UserService {
    User createUser(User user);
    List<User> getAllUsers();
}