package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.response.DishResponse;
import com.example.fooddelivery.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.example.fooddelivery.dto.request.DishRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;


import java.util.List;

@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
@Tag(name = "2. Меню", description = "Просмотр блюд и категорий")
public class MenuController {

    private final MenuService menuService;

    @Operation(summary = "Получить все блюда")
    @GetMapping
    public List<DishResponse> getAllDishes() {
        return menuService.getAllDishes();
    }

    @Operation(summary = "Получить блюда конкретной категории")
    @GetMapping("/category/{categoryId}")
    public List<DishResponse> getDishesByCategory(@PathVariable Long categoryId) {
        return menuService.getDishesByCategory(categoryId);
    }

    @Operation(summary = "Добавить новое блюдо (Только Админ)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") 
    @SecurityRequirement(name = "bearerAuth") 
    @ResponseStatus(HttpStatus.CREATED)
    public DishResponse createDish(@RequestBody @Valid DishRequest request) {
        return menuService.createDish(request);
    }

    @Operation(summary = "Обновить блюдо (Только Админ)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public DishResponse updateDish(@PathVariable Long id, @RequestBody @Valid DishRequest request) {
        return menuService.updateDish(id, request);
    }

    @Operation(summary = "Удалить блюдо (Только Админ)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDish(@PathVariable Long id) {
        menuService.deleteDish(id);
    }

	   // --- НОВОЕ: Поиск ---
    @Operation(summary = "Поиск блюд по названию")
    @GetMapping("/search")
    public List<DishResponse> searchDishes(@RequestParam String query) {
        return menuService.searchDishes(query);
    }

}
