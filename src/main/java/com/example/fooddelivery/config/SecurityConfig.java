package com.example.fooddelivery.config;

import com.example.fooddelivery.security.TokenFilter;
import com.example.fooddelivery.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final TokenFilter tokenFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

   @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(org.springframework.security.config.Customizer.withDefaults()) 
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint((request, response, authException) -> {
                // Если это запрос к API, отдаем 401 ошибку
                if (request.getServletPath().startsWith("/api") || 
                    request.getServletPath().startsWith("/auth") ||
                    request.getServletPath().startsWith("/menu") ||
                    request.getServletPath().startsWith("/orders") ||
                    request.getServletPath().startsWith("/admin/")) {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.getWriter().write("Unauthorized");
                } else {
                    // Если это просто страница, разрешаем или редиректим на главную
                    response.sendRedirect("/");
                }
            })
        )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            // РАЗРЕШАЕМ ВСЕ СТАТИЧЕСКИЕ ФАЙЛЫ И СТРАНИЦЫ
            .requestMatchers("/", "/index.html", "/admin", "/admin.html", "/favicon.ico").permitAll()
            .requestMatchers("/css/**", "/js/**", "/assets/**", "/images/**").permitAll()
            
            // РАЗРЕШАЕМ ПУБЛИЧНЫЕ ЭНДПОИНТЫ
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/menu/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
            
            // ЗАЩИЩАЕМ ВСЕ ОСТАЛЬНЫЕ API (Заказы, Админские действия)
            .anyRequest().authenticated()
        )
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
}
