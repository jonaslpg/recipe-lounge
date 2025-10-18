import { useState } from 'react'
import './sidebar.css'
import FolderItem from './FolderItem';
import type { FolderData } from "../../types/FolderData";


function RecipeSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [folders, setFolders] = useState<FolderData[]>([]);
    const [draggedFolder, setDraggedFolder] = useState<FolderData | null>(null);
    const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

    const createFolder = () => {
      const folder: FolderData = {
        id: crypto.randomUUID(),
        title: "",
        folderLevel: 0,
        subfolders: [],
        //amountOfAllSubfolders: 0,
        isSubfolder: false,
        isLastSubfolder: false,
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

      setFolders(() => {
        console.clear();

        // make all subfolders of targetFolder to isLastSubfolder: false
        let updated = makeLastSubfolderFalseRecursive(folders);

        // calculate the new folderLevel
        let newFolderLevel = findFolderLevelRecursive(updated);


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
          alert("Warning: A folder can't hold more than 3 subfolders.");
          console.log(
            "%c📁 Folder didn't move:",
            "color: limegreen; font-weight: bold;",
            JSON.stringify(folders, null, 2)
          );
          return folders;
        }

        // copy dragged folder as subfolder with all properties including title
        // now this subfolder is always the last one
        const newSubfolder: FolderData = {
          ...structuredClone(draggedFolder),
          isSubfolder: true,
          isLastSubfolder: true,
          folderLevel: newFolderLevel,
        };

        newSubfolder.subfolders.forEach((sf) => {
          sf.folderLevel = newFolderLevel+1;
        })

        // delete old dragged folder
        updated = deleteFolderRecursive(updated, draggedFolder.id);

        // add new subfolder in the FolderData-array
        updated = addSubfolderRecursive(updated, newSubfolder);

        console.log(
          "%c📁 Folder moved:",
          "color: limegreen; font-weight: bold;",
          JSON.stringify(updated, null, 2)
        );

        return updated;
      });

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
              //amountOfAllSubfolders: f.amountOfAllSubfolders + 1,
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
    
    const makeLastSubfolderFalseRecursive = (givenFolders: FolderData[]): FolderData[] => {
      return givenFolders.map((f) => {
        if(targetFolderId === f.id){
          return {
            ...f,
            subfolders: f.subfolders.map(sf => {
                  return {
                    ...sf,
                    isLastSubfolder: false,
                  }
              })
          }
        } else {
          return {
            ...f,
            subfolders: makeLastSubfolderFalseRecursive(f.subfolders)
          }
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

          <button className="create-recipe-folder-btn" onClick={createFolder}>
            <img 
              src="src/assets/plus-icon.svg"
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
            onUpdateDraggedFolder={updateDraggedFolder}
            onUpdateDragEnd={updateDragEnd}
            targetFolderId={targetFolderId}
            />
          ))}
        </nav>
      </div>
    )
}

export default RecipeSidebar