package com.example.fooddelivery.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {

    @NotBlank(message = "Email не может быть пустым")
    private String email;

    @NotBlank(message = "Пароль не может быть пустым")
    private String password;
}
