package com.example.fooddelivery.mapper;

import com.example.fooddelivery.dto.response.DishResponse;
import com.example.fooddelivery.entity.Dish;
import org.springframework.stereotype.Component;

@Component
public class DishMapper {

    public DishResponse toResponse(Dish dish) {
        return DishResponse.builder()
                .id(dish.getId())
                .name(dish.getName())
                .description(dish.getDescription())
                .price(dish.getPrice())
                .imageUrl(dish.getImageUrl())
                .categoryName(dish.getCategory().getName())
                .isAvailable(dish.getIsAvailable()) 
                .build();
    }
}
