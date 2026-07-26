package com.smarttraders.backend.dto.response;

import com.smarttraders.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long id;
    private String fullName;
    private String email;
    private Role role;
}