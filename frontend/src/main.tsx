import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import RecipeSidebar from "./components/RecipeSidebar/RecipeSidebar";
// import CreateRecipePage from "./components/CreateRecipePage/CreateRecipePage";
// import RecipePage from "./components/RecipePage/RecipePage";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

document.body.style.margin = '0';
document.body.style.padding = '0';

// createRoot(document.getElementById('root')!).render(
//   // <StrictMode>
//   //   <RecipeSidebar />
//   // </StrictMode>,
//     <StrictMode>
//     <div style={{ display: 'flex', height: '100vh' }}>
//       <RecipeSidebar />
//       <div style={{ flex: 1 }}>
//         <CreateRecipePage />
//         {/* <RecipePage /> */}
//       </div>
//     </div>
//   </StrictMode>
// )

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
