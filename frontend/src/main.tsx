import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RecipeSidebar from "./components/RecipeSidebar/RecipeSidebar";
import CreateRecipePage from "./components/CreateRecipePage/CreateRecipePage";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <RecipeSidebar />
  // </StrictMode>,
    <StrictMode>
    <div style={{ display: 'flex', height: '100vh' }}>
      <RecipeSidebar />
      <div style={{ flex: 1 }}>
        <CreateRecipePage />
      </div>
    </div>
  </StrictMode>,
)
