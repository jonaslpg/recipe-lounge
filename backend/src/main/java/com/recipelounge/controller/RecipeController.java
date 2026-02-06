package com.recipelounge.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.recipelounge.entity.RecipeEntity;
import com.recipelounge.repository.RecipeRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

    private final RecipeRepository recipeRepository;

    public RecipeController(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @GetMapping
    public List<RecipeEntity> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @GetMapping("/{id}")
    public RecipeEntity getRecipeById(@PathVariable("id") String id) {
        return recipeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Recipe with id " + id + " not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public RecipeEntity createRecipe(@RequestBody @Valid RecipeEntity recipe) {
        return recipeRepository.save(recipe);
    }

    @PutMapping("/{id}")
    @Transactional
    public RecipeEntity replaceRecipe(@PathVariable("id") String id, @RequestBody @Valid RecipeEntity newRecipe) {
        return recipeRepository.findById(id)
                .map(existingRecipe -> {
                    newRecipe.setId(id);
                    return recipeRepository.save(newRecipe);
                })
                .orElseThrow(() -> new RuntimeException("Recipe with id " + id + " not found"));
    }

    @PatchMapping("/{id}")
    @Transactional
    public RecipeEntity updateRecipe(@PathVariable("id") String id, @RequestBody RecipeEntity updates) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                    if (updates.getName() != null) recipe.setName(updates.getName());
                    if (updates.getDescription() != null) recipe.setDescription(updates.getDescription());
                    if (updates.getImage() != null) recipe.setImage(updates.getImage());
                    if (updates.getServings() != null) recipe.setServings(updates.getServings());
                    if (updates.getCookDuration() != null) recipe.setCookDuration(updates.getCookDuration());
                    
                    if (updates.getIngredients() != null) {
                        recipe.getIngredients().clear();
                        updates.getIngredients().forEach(ingredient -> {
                            recipe.getIngredients().add(ingredient);
                        });
                    }
                    
                    if (updates.getNutritions() != null) {
                        recipe.getNutritions().clear();
                        updates.getNutritions().forEach(nutrition -> {
                            recipe.getNutritions().add(nutrition);
                        });
                    }
                    
                    if (updates.getDirections() != null) {
                        recipe.getDirections().clear();
                        updates.getDirections().forEach(direction -> {
                            recipe.getDirections().add(direction);
                        });
                    }
                    
                    return recipeRepository.save(recipe);
                })
                .orElseThrow(() -> new RuntimeException("Recipe with id " + id + " not found"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteRecipe(@PathVariable("id") String id) {
        if (!recipeRepository.existsById(id)) {
            throw new RuntimeException("Recipe with id " + id + " not found");
        }
        recipeRepository.deleteById(id);
    }

}