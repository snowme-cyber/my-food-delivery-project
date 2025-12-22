package com.example.fooddelivery.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DishRequest {

    @NotBlank(message = "Название не может быть пустым")
    @Size(max = 100, message = "Название слишком длинное")
    private String name;

    @Size(max = 500, message = "Описание слишком длинное")
    private String description;

    @NotNull(message = "Цена обязательна")
    @DecimalMin(value = "0.01", message = "Цена должна быть больше 0")
    private BigDecimal price;

    private String imageUrl;
    private Boolean isAvailable;
    
    @NotNull
    private Long categoryId;
}