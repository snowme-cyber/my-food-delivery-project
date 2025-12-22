package com.example.fooddelivery.repository;

import com.example.fooddelivery.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Spring сам поймет запрос по названию метода:
    // SELECT * FROM categories WHERE name = ?
    Optional<Category> findByName(String name);
}
