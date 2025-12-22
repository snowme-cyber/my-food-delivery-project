package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.request.UserRegisterRequest;
import com.example.fooddelivery.entity.Role;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@Tag(name = "7. Управление сотрудниками", description = "Только для администраторов")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Этот email берется из настроек (application.properties или Render)
    @Value("${app.admin.email:admin@example.com}")
    private String mainAdminEmail;

    @Operation(summary = "Получить список всех пользователей")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Operation(summary = "Блокировать/Разблокировать пользователя")
    @PutMapping("/{id}/block")
    public void toggleBlock(@PathVariable Long id, Principal principal) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        String currentUserEmail = principal.getName();

        // 1. ЗАЩИТА ГЛАВНОГО АДМИНА
        // Если email цели совпадает с email главного админа - запрещаем
        if (targetUser.getEmail().equalsIgnoreCase(mainAdminEmail)) {
            throw new RuntimeException("ЭТО ГЛАВНЫЙ АДМИНИСТРАТОР! Его блокировка запрещена на уровне сервера.");
        }

        // 2. ЗАЩИТА ОТ БЛОКИРОВКИ САМОГО СЕБЯ
        // Если email цели совпадает с email того, кто нажал кнопку - запрещаем
        if (targetUser.getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new RuntimeException("Вы не можете заблокировать собственный аккаунт.");
        }

        // Если проверки пройдены - переключаем статус
        targetUser.setIsBlocked(!targetUser.getIsBlocked());
        userRepository.save(targetUser);
    }

    @Operation(summary = "Создать нового администратора")
    @PostMapping("/create-admin")
    public User createAdmin(@RequestBody @Valid UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email уже занят");
        }
        
        User admin = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address("Офис")
                .role(Role.ROLE_ADMIN)
                .isBlocked(false)
                .build();

        return userRepository.save(admin);
    }
}