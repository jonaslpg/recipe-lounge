import type { RecipeData } from "./types/RecipeData";
import RecipeSidebar from "./components/RecipeSidebar/RecipeSidebar";
import CreateRecipePage from "./components/CreateRecipePage/CreateRecipePage";
import RecipePage from "./components/RecipePage/RecipePage";
import { useState } from 'react';
import { Routes, Route } from "react-router-dom";

function App() {
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <RecipeSidebar />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/create"
            element={<CreateRecipePage onCreate={setRecipe} />}
          />
          <Route
            path="/recipe"
            element={<RecipePage recipe={recipe} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App