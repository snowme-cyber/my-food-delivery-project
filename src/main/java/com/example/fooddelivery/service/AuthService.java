package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.request.AuthRequest;
import com.example.fooddelivery.dto.request.UserRegisterRequest;
import com.example.fooddelivery.dto.response.AuthResponse;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.mapper.UserMapper;
import com.example.fooddelivery.repository.UserRepository;
import com.example.fooddelivery.security.JwtCore;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; 
    private final AuthenticationManager authenticationManager; 
    private final JwtCore jwtCore; 
    private final UserMapper userMapper;

 @Transactional
    public AuthResponse register(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email уже занят!");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Имя пользователя уже занято!");
        }

        String email = request.getEmail().toLowerCase();
        if (!email.matches("^[\\w-\\.]+@(gmail\\.com|mail\\.ru|yandex\\.ru|yandex\\.by|bk\\.ru|list\\.ru)$")) {
            throw new RuntimeException("Разрешены только почты: gmail, mail.ru, yandex");
        }
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser, null);
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtCore.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toResponse(user, jwt);
    }
}
