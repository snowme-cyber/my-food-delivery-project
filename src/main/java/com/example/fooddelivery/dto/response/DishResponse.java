package com.example.fooddelivery.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty; // <--- ДОБАВИТЬ ИМПОРТ

@Data
@Builder
public class DishResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String categoryName; // Вместо ID категории покажем её название
    @JsonProperty("isAvailable")
    private Boolean isAvailable; 

}
