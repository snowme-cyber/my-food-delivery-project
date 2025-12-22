package com.example.fooddelivery.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "dishes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean isAvailable; // Есть ли в наличии

    // Связь: У блюда одна категория (Many-to-One)
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
