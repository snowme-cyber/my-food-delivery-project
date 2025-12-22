package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.request.DishRequest;
import com.example.fooddelivery.dto.response.DishResponse;
import com.example.fooddelivery.entity.Category;
import com.example.fooddelivery.entity.Dish;
import com.example.fooddelivery.mapper.DishMapper;
import com.example.fooddelivery.repository.CategoryRepository;
import com.example.fooddelivery.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;
    private final DishMapper dishMapper;

    @Transactional(readOnly = true)
    public List<DishResponse> getAllDishes() {
        // ИСПРАВЛЕНИЕ: Используем метод с сортировкой по ID
        return dishRepository.findAllByOrderByIdAsc().stream()
                .map(dishMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DishResponse> getDishesByCategory(Long categoryId) {
        // ИСПРАВЛЕНИЕ: Сортировка по ID внутри категории
        return dishRepository.findByCategoryIdOrderByIdAsc(categoryId).stream()
                .map(dishMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DishResponse> searchDishes(String query) {
        // Поиск уже содержит ORDER BY в репозитории
        return dishRepository.searchByNameOrCategory(query).stream()
                .map(dishMapper::toResponse)
                .collect(Collectors.toList());
    }

    // --- Остальные методы (Create, Update, Delete) оставляем как были ---
    
    @Transactional
    public DishResponse createDish(DishRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));

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

    @Transactional
    public DishResponse updateDish(Long id, DishRequest request) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Блюдо не найдено"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));

        dish.setName(request.getName());
        dish.setDescription(request.getDescription());
        dish.setPrice(request.getPrice());
        dish.setImageUrl(request.getImageUrl());
        dish.setIsAvailable(request.getIsAvailable());
        dish.setCategory(category);

        return dishMapper.toResponse(dishRepository.save(dish));
    }

    @Transactional
    public void deleteDish(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Блюдо не найдено"));
        // Физическое удаление (или можно делать isAvailable = false)
        dishRepository.delete(dish);
    }
}