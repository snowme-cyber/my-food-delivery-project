package com.example.fooddelivery.security;

import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден: " + username));

    // ДОБАВЛЕНА ПРОВЕРКА БЛОКИРОВКИ
        if (user.getIsBlocked()) {
            throw new org.springframework.security.authentication.LockedException("Ваш аккаунт заблокирован администратором");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().name()) // <--- БЫЛО .roles, СТАЛО .authorities
                .accountLocked(user.getIsBlocked()) // Сообщаем Spring Security
                .build();
    }
}
