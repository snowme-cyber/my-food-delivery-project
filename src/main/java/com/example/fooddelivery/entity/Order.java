package com.example.fooddelivery.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // (Можно оставить null пока не реализуем выбор на фронте)

    @Enumerated(EnumType.STRING)
    private DeliveryMethod deliveryMethod; // (Можно оставить null)

    private LocalDateTime createdAt;
    
    // --- НОВОЕ ПОЛЕ ---
    private LocalDateTime estimatedDeliveryTime; // Ожидаемое время доставки

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // По умолчанию ставим доставку через 60 минут после создания
        estimatedDeliveryTime = createdAt.plusMinutes(60); 
    }
}
