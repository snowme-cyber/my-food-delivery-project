package com.example.fooddelivery.repository;

import com.example.fooddelivery.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Найти все заказы конкретного пользователя (История заказов)
    // Сортируем по дате создания (сначала новые)
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Найти вообще все заказы (для Админа), отсортированные по дате
    List<Order> findAllByOrderByCreatedAtDesc();
}
