package com.example.fooddelivery.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonIgnore // ИСПРАВЛЕНИЕ: Пароль никогда не попадет в JSON ответ
    @Column(nullable = false)
    private String password; // Будем хранить хеш пароля

    @Column(nullable = false, unique = true)
    private String email;

    private String address;

    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    @Builder.Default // Важно для Lombok, чтобы по умолчанию было false
    private Boolean isBlocked = false;
}
