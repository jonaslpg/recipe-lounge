import type { NutritionData } from "../../../types/NutritionData";
import type { IngredientData } from "../../../types/IngredientData";
import { useState } from 'react';


export function useMeasuredItems() {
    
    const [nutritionItems, setNutritionItems] = useState<NutritionData[]>([
        // { name: "Calories", amount: "0", unit: "kcal", id: crypto.randomUUID() },
        // { name: "Carbonhydrates", amount: "0", unit: "kcal", id: crypto.randomUUID() }
    ]);

    const [ingredientItems, setIngredientItems] = useState<IngredientData[]>([
        // { name: "sugar", amount: "200", unit: "g", id: crypto.randomUUID() }
    ]);

    // NUTRITION //
    function handleAddNutrition(input: string) {
        const parts: string[] = input
            .split(",")
            .map(p => p.trim())
            .filter(Boolean); // delete all empty strings

        const newItems: NutritionData[] = [];

        for (let i = 0; i < parts.length; i++) {
            const match = parts[i].match(/^(\d+)\s*(\w+)\s*(.*)$/);
            if (!match) continue;

            const [, amount, unit, name] = match;

            newItems.push({
                id: crypto.randomUUID(),
                name,
                amount,
                unit
            });
        }

        if (newItems.length > 0) {
            setNutritionItems(prev => [...prev, ...newItems]);
        }
    }

    function handleDeleteNutrition(id: string){
        setNutritionItems(prev => prev.filter(n => n.id !== id));
    }

    function handleAmountChangeNutrition(id: string, newAmount: string) {
        setNutritionItems(prev =>
            prev.map(item =>
            item.id === id
                ? { ...item, amount: newAmount }
                : item
            )
        );
    }


    // INGREDIENTS //
    function handleAddIngredient(input: string) {
        const parts: string[] = input
            .split(",")
            .map(p => p.trim())
            .filter(Boolean); // delete all empty strings

        const newItems: IngredientData[] = [];

        for (let i = 0; i < parts.length; i++) {
            const match = parts[i].match(/^(\d+)\s*(\w+)\s*(.*)$/);
            if (!match) continue;

            const [, amount, unit, name] = match;

            newItems.push({
                id: crypto.randomUUID(),
                name,
                amount,
                unit
            });
        }

        if (newItems.length > 0) {
            setIngredientItems(prev => [...prev, ...newItems]);
        }
    }

    function handleDeleteIngredient(id: string){
        setIngredientItems(prev => prev.filter(n => n.id !== id));
    }

    function handleAmountChangeIngredient(id: string, newAmount: string) {
        setIngredientItems(prev =>
            prev.map(item =>
            item.id === id
                ? { ...item, amount: newAmount }
                : item
            )
        );
    }


    return {
        handleAddNutrition,
        handleDeleteNutrition,
        handleAmountChangeNutrition,
        handleAddIngredient,
        handleDeleteIngredient,
        handleAmountChangeIngredient,
        nutritionItems,
        ingredientItems
    };
}