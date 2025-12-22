package com.example.fooddelivery.repository;

import com.example.fooddelivery.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Пока пусто, базовых методов CRUD достаточно
}
