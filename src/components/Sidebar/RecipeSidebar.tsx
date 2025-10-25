import { useState } from 'react'
import './sidebar.css'
import FolderItem from './FolderItem';
import type { FolderData } from "../../types/FolderData";
import { v4 as uuidv4 } from 'uuid';


function RecipeSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [folders, setFolders] = useState<FolderData[]>([]);
    const [draggedFolder, setDraggedFolder] = useState<FolderData | null>(null);
    const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

    const createFolder = () => {
      const folder: FolderData = {
        id: uuidv4(),
        title: "Untitled",
        folderLevel: 0,
        subfolders: [],
        isSubfolder: false,
        isLastFolder: false,
        isOpen: false,
        isEditing: true,
        isSelected: false,
      };
      let updated = [...folders, folder];
      updated = updateLastFolderPropRecursive(updated);
      setFolders(updated);

      console.clear();
      console.log(
        "%c📁 Folder created:",
        "color: limegreen; font-weight: bold;",
        JSON.stringify(updated, null, 2)
      );
    };

    // function, when hovering over a folder: toggles CSS-class for user-feedback
    const onSidebarDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      const target = (e.target as HTMLElement).closest('.recipe-folder-container') as HTMLDivElement;
      const targetId = target?.dataset.id;

      if(target && draggedFolder && targetId && targetId !== draggedFolder.id){
        setTargetFolderId(targetId);
      } else if (targetId && draggedFolder && targetId === draggedFolder.id){
        setTargetFolderId(null);
      }
    };

    // function, when dropping a folder: creates new subfolder and updates the folders-array
    const updateDragEnd = () => {
      if(!draggedFolder || !targetFolderId) return;

      if(cannotDragToSubfolder(draggedFolder)) return;

      let folderWarning: boolean = false; // = ONLY FOR DEV MODE: to prevent double render from strict-mode =
      
      setFolders(prevFolders => {
      
        // // prevents to drag parentFolder to their subfolders
        // for (const s of draggedFolder.subfolders) { // needs to be for instead of forEach
        //   if (s.id === targetFolderId) return prevFolders;
        // }

        console.clear();

        // calculate the new folderLevel
        let newFolderLevel = findFolderLevelRecursive(prevFolders);

        // checking that the user can't have more than 4 subfolders (for readibility-purposes)
        let noAllowMoveSubfolderL2 = false;
        for (const sf of draggedFolder.subfolders) {
          if (sf.subfolders.length > 0) {
            noAllowMoveSubfolderL2 = true;
            break;
          }
        }

        let noAllowMoveSubfolderL1 = false;
        for (const sf of draggedFolder.subfolders) {
          for(const sf2 of sf.subfolders){
            if (sf2.subfolders.length > 0) {
              noAllowMoveSubfolderL1 = true;
              break;
            }
          }
        }

        if(newFolderLevel > 3 ||
          (newFolderLevel == 3 && draggedFolder.subfolders.length > 0) ||
          (newFolderLevel == 2 && noAllowMoveSubfolderL2) ||
          (newFolderLevel == 1 && noAllowMoveSubfolderL1)
        ){
          folderWarning = true; // = ONLY FOR DEV MODE: to prevent double render from strict-mode =
          console.clear();
          console.log(
            "%c📁 Folder didn't move:",
            "color: limegreen; font-weight: bold;",
            JSON.stringify(prevFolders, null, 2)
          );
          return prevFolders;
        }

        // copy dragged folder as subfolder with all properties including title
        // now this subfolder is always the last one
        const newSubfolder: FolderData = {
          ...structuredClone(draggedFolder),
          isSubfolder: true,
          isLastFolder: true,
          folderLevel: newFolderLevel,
        };

        newSubfolder.subfolders.forEach((sf) => {
          sf.folderLevel = newFolderLevel+1;
        })

        // for the case, that an open empty folder is put as last possible subfolder
        if(newSubfolder.folderLevel === 3) newSubfolder.isOpen = false;

        // delete old dragged folder
        prevFolders = deleteFolderRecursive(prevFolders, draggedFolder.id);

        // add new subfolder in the FolderData-array
        prevFolders = addSubfolderRecursive(prevFolders, newSubfolder);

        prevFolders = updateLastFolderPropRecursive(prevFolders);

        console.clear();
        console.log(
          "%c📁 Folder moved:",
          "color: limegreen; font-weight: bold;",
          JSON.stringify(prevFolders, null, 2)
        );

        return prevFolders;
      });

      if(folderWarning) alert("Warning: A folder can't hold more than 3 subfolders."); // TODO: Change to UI warning

      setDraggedFolder(null);
      setTargetFolderId(null);
    };

    const addSubfolderRecursive = ((givenFolders: FolderData[], newSubfolder: FolderData): FolderData[] => {    
      if(givenFolders.length === 0) {
        return [];
      } else {
        return givenFolders.map((f) => {
          if (f.id === targetFolderId) {
            return {
              ...f,
              subfolders: [
                ...f.subfolders,
                newSubfolder
              ]
            };
          } else {
            return {
              ...f,
              subfolders: addSubfolderRecursive(f.subfolders, newSubfolder)
            }
          }
        })
      }
    })
    
    // makes the property "isLastFolder" false for every last folder/subfolder
    const updateLastFolderPropRecursive = (givenFolders: FolderData[]): FolderData[] => {
        return givenFolders.map((f, index) => {
            return {
                      ...f,
                      isLastFolder: index === givenFolders.length-1 ? true : false,
                      subfolders: updateLastFolderPropRecursive(f.subfolders)
            }
        })
    }

    const findFolderLevelRecursive = (givenFolders: FolderData[]): number => {
      if (givenFolders.length === 0) return 0;

      for (const f of givenFolders) {
        if (f.id === targetFolderId) {
          return f.folderLevel + 1;
        }

        const subResult = findFolderLevelRecursive(f.subfolders);

        if (subResult > 0) {
          return subResult;
        }
      }

      return 0;
    };

    const deleteFolderRecursive = (folders: FolderData[], id: string): FolderData[] => {
      return folders
        .filter(f => f.id !== id)
        .map(f => ({
          ...f,
          subfolders: deleteFolderRecursive(f.subfolders, id)
        }));
    };

    const updateDraggedFolder = (folder: FolderData) => {
      setDraggedFolder(folder);
    };

    const updateData = (id: string, updates: Partial<FolderData>) => {
      const updateRecursive = (folders: FolderData[]): FolderData[] => {
        return folders.map(f => {
          if (f.id === id) {
            return { ...f, ...updates };
          }
          if (f.subfolders.length > 0) {
            return { ...f, subfolders: updateRecursive(f.subfolders) };
          }
          return f;
        });
      };

      const updated = updateRecursive(folders);
      setFolders(updated);

      console.clear();
      console.log(
        "%c📁 Folder updated:",
        "color: limegreen; font-weight: bold;",
        JSON.stringify(updated, null, 2)
      );
    };

    const updateSelect = (id: string, selected:boolean) => {
      const updateRecursive = (folders: FolderData[]): FolderData[] => {
        return folders.map(f => {
          const updatedFolder = f.id === id ? { ...f, isSelected: selected } : { ...f, isSelected: false };
          if (updatedFolder.subfolders.length > 0) {
            return { ...updatedFolder, subfolders: updateRecursive(updatedFolder.subfolders) };
          }
          return updatedFolder;
        });
      };

      const updated = updateRecursive(folders);
      setFolders(updated);

      console.clear();
      console.log(
        "%c📁 Folder updated:",
        "color: limegreen; font-weight: bold;",
        JSON.stringify(updated, null, 2)
      );
    };

    // prevents to drag parentFolder to their subfolders
    const cannotDragToSubfolder = (tmpFolder: FolderData): boolean => {
      if (!tmpFolder) return false;

      for (const s of tmpFolder.subfolders) {
        if (s.id === targetFolderId) {
          setDraggedFolder(null);
          setTargetFolderId(null);
          return true;
        }

        if (cannotDragToSubfolder(s)) {
          return true;
        }
      }

      return false;
    };

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
          onDragOver={onSidebarDragOver}>
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
          <button className="sidebar-item" onClick={createFolder} style={{ marginBottom: "24px" }}>
            <img 
              src="src/assets/plus-icon.svg"
              alt="plus"
            />
            New Recipe Folder
          </button>

          <p className="sidebar-subtitle">FOLDERS</p>
          {folders.map((f) => (
            <FolderItem 
            key={f.id} 
            folderData={f} 
            onUpdateData={updateData} 
            onUpdateSelect={updateSelect}
            onUpdateDraggedFolder={updateDraggedFolder}
            onUpdateDragEnd={updateDragEnd}
            targetFolderId={targetFolderId}
            />
          ))}

          <button className="sidebar-item" style={{ marginTop: "4px" }}>
            <img 
              src="src/assets/settings-icon.svg"
              alt="settings"
            />
            Settings
          </button>
        </nav>
      </div>
    )
}

export default RecipeSidebar