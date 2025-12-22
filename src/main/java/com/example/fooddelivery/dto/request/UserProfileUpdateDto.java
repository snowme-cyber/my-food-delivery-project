package com.example.fooddelivery.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserProfileUpdateDto {

    private String username;

    // ТА ЖЕ СТРОГАЯ ПРОВЕРКА
    @Pattern(
        regexp = "^[a-zA-Z0-9._-]+@(gmail\\.com|mail\\.ru|yandex\\.ru|yandex\\.by|bk\\.ru|inbox\\.ru|list\\.ru|icloud\\.com|yahoo\\.com|outlook\\.com)$", 
        message = "Недопустимый почтовый домен. Используйте популярные сервисы."
    )
    private String email;

    private String phone;
    private String address;
}