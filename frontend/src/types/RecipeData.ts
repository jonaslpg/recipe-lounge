import type { NutritionData } from "./NutritionData";
import type { IngredientData } from "./IngredientData";
import type { DirectionData } from "./DirectionData";

export interface RecipeData {
  id: number;
  name: string;
  description?: string;
  image?: string;
  servings?: number;
  cookDuration?: string;
  calories: number;
  ingredients: IngredientData[];
  nutritions: NutritionData[];
  directions: DirectionData[];
}
