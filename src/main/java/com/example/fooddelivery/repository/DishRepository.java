package com.example.fooddelivery.repository;

import com.example.fooddelivery.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {

    // 1. Получить ВСЕ с сортировкой по ID (чтобы не прыгали)
    List<Dish> findAllByOrderByIdAsc();

    // 2. Получить по КАТЕГОРИИ с сортировкой по ID
    List<Dish> findByCategoryIdOrderByIdAsc(Long categoryId);

    // 3. Поиск доступных (для надежности тоже можно сортировать)
    List<Dish> findByIsAvailableTrueOrderByIdAsc();

    // 4. Поиск (добавляем ORDER BY d.id)
    @Query("SELECT d FROM Dish d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.category.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY d.id ASC")
    List<Dish> searchByNameOrCategory(@Param("query") String query);
}