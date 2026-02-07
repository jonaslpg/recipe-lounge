package com.recipelounge.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    // @PostMapping
    // @ResponseStatus(HttpStatus.CREATED)
    // @Transactional
    // public RecipeEntity createRecipe(@RequestBody @Valid RecipeEntity recipe) {
    //     return recipeRepository.save(recipe);
    // }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public RecipeEntity createRecipeWithImage(
            @RequestPart("recipe") RecipeEntity recipe,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        // if (image != null && !image.isEmpty()) {
        //     String imagePath = saveImage(image, recipe.getId());
        //     recipe.setImage(imagePath);
        // }

        // return recipeRepository.save(recipe);
        RecipeEntity saved = recipeRepository.save(recipe);

        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image, saved.getId());
            saved.setImage(imagePath);
        }

        return recipeRepository.save(saved);
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

    // helper method
    private String saveImage(MultipartFile file, String recipeId) {
        try {
            String uploadDir = "uploads/recipes";
            Files.createDirectories(Paths.get(uploadDir));

            String extension = Objects.requireNonNull(file.getOriginalFilename())
                    .substring(file.getOriginalFilename().lastIndexOf("."));

            String filename = recipeId + extension;
            Path path = Paths.get(uploadDir, filename);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/recipes/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }
}