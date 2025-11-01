import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RecipeSidebar from "./components/RecipeSidebar/RecipeSidebar";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecipeSidebar />
  </StrictMode>,
)
