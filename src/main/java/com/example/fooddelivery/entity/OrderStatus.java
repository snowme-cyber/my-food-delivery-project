package com.example.fooddelivery.entity;

public enum OrderStatus {
    CREATED, // Создан
    PAID, // Оплачен
    COOKING, // Готовится
    DELIVERING, // В пути
    COMPLETED, // Доставлен
    CANCELLED   // Отменен
}
