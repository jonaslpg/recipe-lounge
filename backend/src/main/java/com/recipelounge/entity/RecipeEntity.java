package com.recipelounge.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "recipes")
public class RecipeEntity {

    @Id
    private String id;

    private String name;

    private String description;

    private String image;

    private Integer servings;

    private String cookDuration;

    private BigDecimal calories;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id", nullable = false)
    private List<IngredientEntity> ingredients = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id", nullable = false)
    private List<NutritionEntity> nutritions = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id", nullable = false)
    private List<DirectionEntity> directions = new ArrayList<>();

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public String getCookDuration() {
        return cookDuration;
    }

    public void setCookDuration(String cookDuration) {
        this.cookDuration = cookDuration;
    }

    public List<IngredientEntity> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<IngredientEntity> ingredients) {
        this.ingredients = ingredients;
    }

    public List<NutritionEntity> getNutritions() {
        return nutritions;
    }

    public void setNutritions(List<NutritionEntity> nutritions) {
        this.nutritions = nutritions;
    }

    public List<DirectionEntity> getDirections() {
        return directions;
    }

    public void setDirections(List<DirectionEntity> directions) {
        this.directions = directions;
    }

    public BigDecimal getCalories() {
        return calories;
    }

    public void setCalories(BigDecimal calories) {
        this.calories = calories;
    }
}