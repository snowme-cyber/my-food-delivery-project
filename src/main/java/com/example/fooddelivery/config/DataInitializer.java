package com.example.fooddelivery.config;

import com.example.fooddelivery.entity.Role;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // УБРАЛИ "hardcoded" пароли. Теперь Java будет искать их в переменных окружения.
    @Value("${app.admin.email}") 
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .username("Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ROLE_ADMIN)
                    .address("Admin Office")
                    .phone("000-000-0000")
                    .isBlocked(false) // Явно указываем, что админ не заблокирован
                    .build();

            userRepository.save(admin);
            System.out.println("ADMIN CREATED. Email: " + adminEmail);
        }
    }
}