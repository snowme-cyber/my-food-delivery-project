package com.example.fooddelivery.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "dish_id")
    private Dish dish;

    private Integer quantity; // Количество (например, 2 пиццы)

    private BigDecimal priceAtPurchase; // Цена на момент покупки
    
    // --- НОВОЕ ПОЛЕ ---
    private String comment; 

}
