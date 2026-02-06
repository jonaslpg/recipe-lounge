package com.recipelounge.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recipelounge.entity.RecipeEntity;

public interface RecipeRepository extends JpaRepository<RecipeEntity, String> { }
