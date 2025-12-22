package com.example.fooddelivery.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long id;
    private String status;
    private String address;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    
    // --- НОВОЕ ПОЛЕ ---
    private LocalDateTime estimatedDeliveryTime; 
    
    private List<OrderItemResponse> items;

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long dishId; // <--- ДОБАВЬ ЭТО ПОЛЕ
        private String dishName;
        private Integer quantity;
        private BigDecimal pricePerItem;
        private String comment;
    }

}
