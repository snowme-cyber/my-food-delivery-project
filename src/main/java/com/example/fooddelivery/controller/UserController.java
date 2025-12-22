package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.request.UserProfileUpdateDto;
import com.example.fooddelivery.dto.response.UserProfileDto;
import com.example.fooddelivery.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "6. Профиль пользователя", description = "Управление личными данными")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Получить мой профиль")
    @GetMapping("/me")
    public UserProfileDto getMyProfile(Principal principal) {
        return userService.getProfile(principal.getName());
    }

    @Operation(summary = "Обновить мой профиль")
    @PutMapping("/me")
    public UserProfileDto updateMyProfile(Principal principal, @RequestBody @Valid UserProfileUpdateDto request) {
        return userService.updateProfile(principal.getName(), request);
    }
}
