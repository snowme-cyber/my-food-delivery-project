package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.request.UserProfileUpdateDto;
import com.example.fooddelivery.dto.response.UserProfileDto;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileDto getProfile(String email) {
        User user = findByEmail(email);
        return mapToDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UserProfileUpdateDto request) {
        User user = findByEmail(email);

        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Этот email уже занят");
            }
            user.setEmail(request.getEmail());
        }

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }

    private UserProfileDto mapToDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole().name())
                .build();
    }
}
