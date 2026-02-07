import RecipeSidebar from "./components/RecipeSidebar/RecipeSidebar";
import CreateRecipePage from "./components/CreateRecipePage/CreateRecipePage";
import RecipePage from "./components/RecipePage/RecipePage";
import RecipesPage from "./components/RecipesPage/RecipesPage";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <RecipeSidebar />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/home"
            element={<RecipesPage />}
          />
          <Route
            path="/create"
            element={<CreateRecipePage />}
          />
          <Route
            path="/recipe/:id"
            element={<RecipePage />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App