package com.example.fooddelivery.mapper;

import com.example.fooddelivery.dto.request.UserRegisterRequest;
import com.example.fooddelivery.dto.response.AuthResponse;
import com.example.fooddelivery.entity.Role;
import com.example.fooddelivery.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRegisterRequest request) {
        return User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .address(request.getAddress())
                .phone(request.getPhone())
                .role(Role.ROLE_USER) // По умолчанию обычный пользователь
                .build();
    }

    public AuthResponse toResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole() != null ? user.getRole().toString() : "ROLE_USER")
                .token(token)
                .build();
    }
}
