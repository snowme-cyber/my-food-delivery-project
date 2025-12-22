package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.request.DishRequest;
import com.example.fooddelivery.dto.response.DishResponse;
import com.example.fooddelivery.entity.Category;
import com.example.fooddelivery.entity.Dish;
import com.example.fooddelivery.mapper.DishMapper;
import com.example.fooddelivery.repository.CategoryRepository;
import com.example.fooddelivery.repository.DishRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List; 
@RestController
@RequestMapping("/admin/menu")
@RequiredArgsConstructor
@Tag(name = "5. Администрирование меню", description = "Управление блюдами")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')") // Доступ только админам
public class AdminMenuController {

    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;
    private final DishMapper dishMapper;

    @Operation(summary = "Получить все блюда (для админки)")
    @GetMapping
    public List<DishResponse> getAllDishes() {
        // ИСПОЛЬЗУЕМ НОВЫЙ МЕТОД С СОРТИРОВКОЙ
        return dishRepository.findAllByOrderByIdAsc().stream()
                .map(dishMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Operation(summary = "Добавить новое блюдо")
    @PostMapping
    public DishResponse addDish(@RequestBody @Valid DishRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Dish dish = Dish.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .category(category)
                .build();

        Dish savedDish = dishRepository.save(dish);
        return dishMapper.toResponse(savedDish);
    }

    @Operation(summary = "Обновить блюдо по ID")
    @PutMapping("/{id}")
    public DishResponse updateDish(@PathVariable Long id, @RequestBody @Valid DishRequest request) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        dish.setName(request.getName());
        dish.setDescription(request.getDescription());
        dish.setPrice(request.getPrice());
        dish.setImageUrl(request.getImageUrl());
        dish.setIsAvailable(request.getIsAvailable());
        dish.setCategory(category);

        return dishMapper.toResponse(dishRepository.save(dish));
    }

    @Operation(summary = "Удалить блюдо")
    @DeleteMapping("/{id}")
    public void deleteDish(@PathVariable Long id) {
        dishRepository.deleteById(id);
    }
}
