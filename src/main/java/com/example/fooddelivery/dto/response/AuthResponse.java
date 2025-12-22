package com.example.fooddelivery.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private Long id;
    private String username;
    private String token; // Задел на будущее (JWT)
    private String role;
}
