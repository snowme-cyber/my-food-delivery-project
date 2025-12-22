package com.example.fooddelivery.dto.request;

import com.example.fooddelivery.entity.DeliveryMethod;
import com.example.fooddelivery.entity.PaymentMethod;
import lombok.Data;
import java.util.List;

@Data
public class OrderCreateRequest {

    private Long userId;
    private String address;
    private List<OrderItemRequest> items;
    private DeliveryMethod deliveryMethod;
    private PaymentMethod paymentMethod;

    @Data
    public static class OrderItemRequest {
        private Long dishId;
        private Integer quantity;
        
        // --- ДОБАВЬТЕ ЭТУ СТРОКУ ---
        private String comment; 
    }
}