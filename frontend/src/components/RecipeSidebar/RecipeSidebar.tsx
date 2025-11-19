import { useState, useEffect } from 'react'
import './sidebar.css'
import FolderItem from './FolderItem/FolderItem';
import FolderItemSettingsMenu from './FolderItemSettingsMenu';
import type { FolderData } from "../../types/FolderData";
import { motion, AnimatePresence } from "framer-motion";

// Imports of the custom-hooks- and utils-folder
import { useFolderActions } from "./hooks/useFolderActions";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useContextMenu } from "./hooks/useContextMenu";
import { loadUIState } from "./utils/folderHelpers";


function RecipeSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [folders, setFolders] = useState<FolderData[]>([]); // Collection of all FolderData

  const [draggedFolder, setDraggedFolder] = useState<FolderData | null>(null);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [settingsMenuOpened, setSettingsMenuOpened] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const { handleCreateFolderClick, handleUpdateFolderData, handleFolderSelect, handleDeleteFolder } = useFolderActions({
    activeFolderId,
    setContextMenu,
    setSettingsMenuOpened,
    setActiveFolderId,
    folders,
    setFolders
  });

  const { handleFinalizeFolderSettingsClick } = useContextMenu({
    settingsMenuOpened,
    activeFolderId,
    setSettingsMenuOpened,
    setActiveFolderId,
    setContextMenu
  });
  
  const { handleFinalizeFolderDragEnd, handleSidebarDragOver, handleUpdateDraggedFolder } = useDragAndDrop({
    folders,
    setFolders,
    draggedFolder,
    setDraggedFolder,
    targetFolderId,
    setTargetFolderId
  });



  // When opening the website first time (loading RecipeSidebar component), load data out of local storage
  useEffect(() => {
    async function loadFolders() {
      const res = await fetch("http://localhost:8080/api/folders");
      const uiState = loadUIState();

      // In the Backend we use ParentFolder instead of ParentFolderId to have better readibilty
      // We need to extract parentFolder and set the id instead
      const dbFoldersRaw = await res.json();
      const dbFolders: FolderData[] = dbFoldersRaw.map((f: FolderData) => {
        return {
          ...f,
          ...(uiState[f.id] || {
            isOpen: false,
            isSelected: false,
            isLastFolder: false,
            folderLevel: 0,
            isVisible: true,
            isEditing: false,
          }),
        };
      });

      setFolders(dbFolders);
    }

    loadFolders();
  }, []);


 
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
      setActiveFolderId(null);
      setSettingsMenuOpened(false);
    }

    window.addEventListener("click", handleClick);
    window.addEventListener("blur", handleClick);

    return () => { 
      window.removeEventListener("click", handleClick)
      window.removeEventListener("blur", handleClick);
    };
  }, []);
  

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

      <nav 
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        onDragOver={handleSidebarDragOver}>
        <div className="topbar">
          <img 
            className="recipe-lounge-logo"
            src="src/assets/recipe-lounge-logo.svg"
            alt="logo"
          />
          <h3 className="logo-title">RecipeLounge</h3>
          <img 
            src="src/assets/x-close.svg"
            className={`hamburger-opened ${!sidebarOpen ? 'not-displayed' : ''}`}
            onClick={() => setSidebarOpen(false)}
            alt="close"
          />
        </div>

        <button className="sidebar-item">
          <img 
            src="src/assets/home-icon.svg"
            alt="home"
          />
          Home
        </button>
        <button className="sidebar-item">
          <img 
            src="src/assets/search-icon.svg"
            alt="search"
          />
          Search
        </button>
        <button className="sidebar-item" onClick={handleCreateFolderClick} style={{ marginBottom: "24px" }}>
          <img 
            src="src/assets/plus-icon.svg"
            alt="plus"
          />
          New Recipe Folder
        </button>

        <p className="sidebar-subtitle">FOLDERS</p>
        {folders
          .filter(f => !f.parentFolder)
          .map(f => (
            <FolderItem
              key={f.id}
              folderData={f}
              onUpdateFolderData={handleUpdateFolderData}
              onFolderSelect={handleFolderSelect}
              onUpdateDraggedFolder={handleUpdateDraggedFolder}
              onFinalizeFolderDragEnd={handleFinalizeFolderDragEnd}
              onFinalizeFolderSettingsClick={handleFinalizeFolderSettingsClick}
              targetFolderId={targetFolderId}
              activeFolderId={activeFolderId}
              folders={folders}
            />
          ))
        }

        <button className="sidebar-item" style={{ marginTop: "4px" }}>
          <img 
            src="src/assets/settings-icon.svg"
            alt="settings"
          />
          Settings
        </button>
      </nav>

      <AnimatePresence>
      {settingsMenuOpened && contextMenu && (
        <motion.div
          key={activeFolderId}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.05, ease: "easeOut" }}
          style={{
            top: contextMenu.y + 20,
            left: contextMenu.x - 20,
            position: "absolute",
          }}
        >
          <FolderItemSettingsMenu
            onDeleteFolder={handleDeleteFolder}
            onUpdateFolderData={handleUpdateFolderData}
            activeFolderId={activeFolderId}
          />
        </motion.div>
      )}
    </AnimatePresence>

    </div>
  )
}

export default RecipeSidebar