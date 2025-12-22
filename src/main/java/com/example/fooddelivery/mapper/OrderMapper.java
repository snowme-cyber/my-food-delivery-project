package com.example.fooddelivery.mapper;

import com.example.fooddelivery.dto.response.OrderResponse;
import com.example.fooddelivery.entity.Order;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .address(order.getAddress())
                .status(order.getStatus().name())
                .totalPrice(order.getTotalPrice())
                .createdAt(order.getCreatedAt())
                .estimatedDeliveryTime(order.getEstimatedDeliveryTime()) // <-- Добавили
                .items(order.getItems().stream().map(item
                        -> OrderResponse.OrderItemResponse.builder()
                        .dishId(item.getDish().getId())
                        .dishName(item.getDish().getName())
                        .quantity(item.getQuantity())
                        .pricePerItem(item.getPriceAtPurchase())
                        
                        // --- ДОБАВЬТЕ ЭТУ СТРОКУ ---
                        .comment(item.getComment()) 
                        
                        .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
