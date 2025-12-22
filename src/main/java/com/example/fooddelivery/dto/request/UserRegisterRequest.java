package com.example.fooddelivery.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterRequest {

    @NotBlank(message = "Имя обязательно")
    @Size(min = 2, max = 50, message = "Имя от 2 до 50 символов")
    private String username;

    @NotBlank(message = "Пароль обязателен")
    @Size(min = 6, message = "Пароль минимум 6 символов")
    private String password;

    @NotBlank(message = "Email обязателен")
    // СТРОГАЯ ПРОВЕРКА ДОМЕНА
    @Pattern(
        regexp = "^[a-zA-Z0-9._-]+@(gmail\\.com|mail\\.ru|yandex\\.ru|yandex\\.by|bk\\.ru|inbox\\.ru|list\\.ru|icloud\\.com|yahoo\\.com|outlook\\.com)$", 
        message = "Разрешены только: gmail, mail.ru, yandex, bk, inbox, list, icloud, yahoo, outlook"
    )
    private String email;

    @NotBlank(message = "Адрес обязателен")
    private String address;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Телефон должен содержать только цифры (10-15 знаков)")
    private String phone;
}