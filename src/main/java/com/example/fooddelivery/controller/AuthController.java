package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.request.AuthRequest;
import com.example.fooddelivery.dto.request.UserRegisterRequest;
import com.example.fooddelivery.dto.response.AuthResponse;
import com.example.fooddelivery.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "1. Аутентификация", description = "Регистрация и вход в систему")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Регистрация нового пользователя")
    @PostMapping("/register")
    public AuthResponse register(@RequestBody @Valid UserRegisterRequest request) {
        return authService.register(request);
    }

    @Operation(summary = "Вход в систему (Получение токена)")
    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid AuthRequest request) {
        return authService.login(request);
    }
}
