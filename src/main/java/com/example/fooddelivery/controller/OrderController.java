package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.request.OrderCreateRequest;
import com.example.fooddelivery.dto.response.OrderResponse;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.repository.UserRepository;
import com.example.fooddelivery.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "3. Заказы", description = "Управление заказами")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository; // Добавить этот репозиторий, если нет

    @Operation(summary = "Создать новый заказ")
    @PostMapping
    public OrderResponse createOrder(@RequestBody OrderCreateRequest request, Principal principal) {
        // ИСПРАВЛЕНИЕ: Берем email из токена, а не верим request.getUserId()
        if (principal == null) {
            throw new RuntimeException("Требуется авторизация");
        }
        return orderService.createOrder(request, principal.getName());
    }

    
    @Operation(summary = "Получить историю моих заказов")
    @GetMapping
    public List<OrderResponse> getMyOrders(Principal principal) {
        // Principal - это объект безопасности Spring, в нем лежит email из токена
        if (principal == null) {
            throw new RuntimeException("Требуется авторизация");
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return orderService.getUserOrders(user.getId());
    }

	   // --- НОВОЕ: Отмена заказа ---
    @Operation(summary = "Отменить заказ (только если статус CREATED)")
    @PostMapping("/{id}/cancel")
    public OrderResponse cancelOrder(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Требуется авторизация");
        }
        // Передаем email пользователя, чтобы сервис проверил, его ли это заказ
        return orderService.cancelOrder(id, principal.getName());
    }

	   @Operation(summary = "Оплатить заказ (Эмуляция)")
    @PostMapping("/{id}/pay")
    public OrderResponse payOrder(@PathVariable Long id) {
        return orderService.payOrder(id);
    }

    @Operation(summary = "Восстановить отмененный заказ")
    @PostMapping("/{id}/restore")
    public OrderResponse restoreOrder(@PathVariable Long id, Principal principal) {
        return orderService.restoreOrder(id, principal.getName());
    }

    @Operation(summary = "Удалить заказ из истории")
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id, Principal principal) {
        orderService.deleteOrder(id, principal.getName());
    }

}
