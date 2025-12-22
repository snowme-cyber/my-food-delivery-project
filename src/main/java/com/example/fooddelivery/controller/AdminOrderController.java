package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.response.OrderResponse;
import com.example.fooddelivery.entity.OrderStatus;
import com.example.fooddelivery.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@Tag(name = "4. Администрирование заказов", description = "Только для администраторов")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')") // Весь контроллер только для админа
public class AdminOrderController {

    private final OrderService orderService;

    @Operation(summary = "Получить все заказы в системе")
    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @Operation(summary = "Изменить статус заказа")
    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return orderService.changeStatus(id, status);
    }

    @Operation(summary = "Очистить всю историю заказов (Сброс ID)")
    @DeleteMapping("/reset")
    public void resetOrderHistory() {
        orderService.resetAllOrders();
    }
}
