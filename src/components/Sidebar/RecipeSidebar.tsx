import { useCallback, useState } from 'react'
import './sidebar.css'
import FolderItem from './FolderItem';
import type { FolderData } from "../../types/FolderData";


function RecipeSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [folders, setFolders] = useState<FolderData[]>([]);
    const [draggedFolder, setDraggedFolder] = useState<FolderData | null>(null);
    const [dragTarget, setDragTarget] = useState<string | null>(null);


    const createFolder = () => {
      const folder: FolderData = {
        id: crypto.randomUUID(),
        title: "",
        folderLevel: 1,
        subfolders: [],
        isSubfolder: false,
        isOpen: false,
        isEditing: true,
        isSelected: false
      };
      const updated = [...folders, folder];
      setFolders(updated);

      console.clear();
      console.log(
        "%c📁 Folder created:",
        "color: limegreen; font-weight: bold;",
        JSON.stringify(updated, null, 2)
      );
    };

    const updateData = (id: string, updates: Partial<FolderData>) => {
      const updated = folders.map(f => f.id === id ? { ...f, ...updates } : f);
      setFolders(updated);

      console.clear();
      console.log(
        "%c📁 Folder updated:",
        "color: limegreen; font-weight: bold;",
        JSON.stringify(updated, null, 2)
      );
    }

    const updateSelect = (id: string, selected:boolean) => {
      const updated = folders.map(f => f.id === id ? { ...f, isSelected: selected } : { ...f, isSelected: false });
      setFolders(updated);

      console.clear();
      console.log(
        "%c📁 Folder updated:",
        "color: limegreen; font-weight: bold;",
        JSON.stringify(updated, null, 2)
      );
    }

    return (
      <div className="app-container">
        {!sidebarOpen && (
          <img 
            src="src/assets/menu.svg"
            className="hamburger-closed" 
            onClick={() => setSidebarOpen(true)}
            alt="menu"
          />
        )}

        <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="topbar">
            <img 
              className="recipe-lounge-logo"
              src="src/assets/recipe-lounge-logo.svg"
              alt="logo"
            />
            <h3 className="logo-title">RecipeLounge</h3>
            <img 
              src="src/assets/x-close.svg"
              className={`hamburger-opened ${sidebarOpen ? 'not-displayed' : ''}`}
              onClick={() => setSidebarOpen(false)}
              alt="close"
            />
          </div>

          <button className="create-recipe-folder-btn" onClick={createFolder}>
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E"
              alt="plus"
            />
            New Recipe Folder
          </button>
          {folders.map((f) => (
            <FolderItem 
            key={f.id} 
            folderData={f} 
            onUpdateData={updateData} 
            onUpdateSelect={updateSelect}
            />
          ))}
        </nav>
      </div>
    )
}

export default RecipeSidebar