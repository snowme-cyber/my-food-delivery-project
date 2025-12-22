package com.example.fooddelivery.repository;

import com.example.fooddelivery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Найти пользователя по email (для логина)
    Optional<User> findByEmail(String email);

    // Найти по имени пользователя
    Optional<User> findByUsername(String username);

    // Проверка существования (для валидации при регистрации)
    // SELECT COUNT(*) > 0 FROM users WHERE email = ?
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
