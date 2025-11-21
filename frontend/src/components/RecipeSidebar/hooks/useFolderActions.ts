import type { FolderData, FolderEntity, FolderView } from "../../../types/FolderData";
import { getAllSubfolders, saveUIState } from "../utils/folderHelpers";

type FolderActionsParams = {
  activeFolderId: string | null;
  setContextMenu: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  setSettingsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  folders: FolderData[];
  setFolders: React.Dispatch<React.SetStateAction<FolderData[]>>;
};

export function useFolderActions({
  activeFolderId,
  setContextMenu,
  setSettingsMenuOpened,
  setActiveFolderId,
  folders,
  setFolders,
}: FolderActionsParams) {

  async function handleCreateFolderClick() {

    // reset isLastFolder to false on all main-folders 
    let updated: FolderData[] = folders.map(f => {
      if (!f.parentFolder?.id) {
        return { ...f, isLastFolder: false };
      }
      return f;
    });

    try {
      const res = await fetch("http://localhost:8080/api/folders", {
      //const res = await fetch("http://xxx.xxx.x.xxx:8080/api/folders", {
        method: "POST", // POST = CREATE NEW OBJECT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            title: "Untitled",
            parentFolder: null,
            createdAt: new Date(),
            updatedAt: new Date(), // not fully implemented rn
            isLastFolder: false,
            folderLevel: 0
          }),
      });

      const savedFolder: FolderEntity = await res.json();

      // Create ui-relevant data for local storage
      const uiState: FolderView = {
        isOpen: true,
        isSelected: false,
        isEditing: true
      };

      const newFolder: FolderData = { ...savedFolder, ...uiState };

      // Optimistic UI: Update frontend and then backend, then eventually rollback on error
      updated = [...folders, newFolder];
      setFolders(updated);
      persistUIState(updated);

    } catch (err) {
      console.error("❌ Folder creation failed:", err);
    }

    console.clear();
    console.log(
      "%c📁 Folder created:",
      "color: limegreen; font-weight: bold;",
      JSON.stringify(updated, null, 2)
    );
  }



  function handleUpdateFolderData(id: string, updates: Partial<FolderData>, e?: React.MouseEvent<HTMLDivElement>) {
    if (activeFolderId && e) {
      const folderElement = (e.target as HTMLElement).closest(".recipe-folder-container");
      const clickedId = folderElement?.getAttribute("data-id");
      setContextMenu(null);
      setSettingsMenuOpened(false);
      if (clickedId) setActiveFolderId(clickedId);
    }

    const updated = folders.map(f =>
      f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f
    );

    setFolders(updated);
    persistUIState(updated);

    // Persist no ui-relevant data in database
    if (updates.title !== undefined || updates.parentFolder?.id !== undefined) {
      fetch(`http://localhost:8080/api/folders/${id}`, {
      //fetch(`http://xxx.xxx.x.xxx:8080/api/folders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).catch(err => console.error("Failed to update folder:", err));
    }

    console.log("%c📁 Folder updated:", "color: limegreen; font-weight: bold;", updates);
  }

  function persistUIState(allFolders: FolderData[]) {
    const uiStateMap: Record<string, FolderView> = {};

    for (const f of allFolders) {
      uiStateMap[f.id] = {
        isOpen: f.isOpen,
        isSelected: f.isSelected,
        isEditing: f.isEditing
      };
    }

    saveUIState(uiStateMap);
  }


  function updateFolderIsSelected(
    folders: FolderData[],
    id: string,
    selected: boolean
  ): FolderData[] {
    return folders.map(f => ({
      ...f,
      isSelected: f.id === id ? selected : false,
    }));
  }

  function handleFolderSelect(
    id: string,
    selected: boolean,
    e: React.MouseEvent<HTMLDivElement>
  ) {
    // Update context menu
    if (activeFolderId) {
      const folderElement = (e.target as HTMLElement).closest('.recipe-folder-container');
      const clickedId = folderElement?.getAttribute('data-id');
      setContextMenu(null);
      setSettingsMenuOpened(false);
      if (clickedId) setActiveFolderId(clickedId);
    }

    const updated = updateFolderIsSelected(folders, id, selected);
    setFolders(updated);

    // persist UI state
    //localStorage.setItem("recipe_folders_ui", JSON.stringify(updated));
    const updatedUIState: Record<string, FolderView> = updated.reduce((acc, folder) => {
      acc[folder.id] = {
        isOpen: folder.isOpen,
        isSelected: folder.isSelected,
        isEditing: folder.isEditing,
      };
      return acc;
    }, {} as Record<string, FolderView>);

    saveUIState(updatedUIState);

    console.log("%c📁 Folder selection updated", "color: limegreen", updated);
  }

  async function handleDeleteFolder() {
    console.clear();
    if (!activeFolderId) return;

    // SETUP VARIABLES
    const oldFolders: FolderData[] = folders;

    const activeFolder: FolderData | undefined = folders.find(f => f.id === activeFolderId);
    const allSubfoldersOfActiveFolder: FolderData[] = getAllSubfolders(folders, activeFolderId);
    const maxPosInSubfOfActiveFolder: number | undefined =
    allSubfoldersOfActiveFolder.length > 0
      ? Math.max(...allSubfoldersOfActiveFolder.map(f => f.position))
      : activeFolder?.position;
    const marginRepositioning: number = allSubfoldersOfActiveFolder ? (allSubfoldersOfActiveFolder.length+1) : 1;

    let foldersRepositioning: FolderData[] | undefined = undefined;
    if(maxPosInSubfOfActiveFolder) foldersRepositioning = folders.filter(f => f.position > maxPosInSubfOfActiveFolder);

    // "DELETE" FOLDER + SUBFOLDERS
    let updatedFolders: FolderData[] = folders.filter(
      f => f.id !== activeFolderId && 
          !allSubfoldersOfActiveFolder.some(sf => sf.id === f.id)
    );

    let foldersToDelete: FolderData[] | undefined = undefined;
    if(activeFolder) foldersToDelete = [activeFolder, ...allSubfoldersOfActiveFolder];

    /*console.log("activeFolder: " + activeFolder?.title);

    console.log(
      "%c📁 allSubfoldersOfActive:",
      "color: red; font-weight: bold;",
      JSON.stringify(allSubfoldersOfActiveFolder, null, 2)
    );

    console.log("maxPosOfSubfolders: " + maxPosInSubfOfActiveFolder);

    console.log("marginRepositioning: " + marginRepositioning);

    console.log(
      "%c📁 DAVOR Folders:",
      "color: red; font-weight: bold;",
      JSON.stringify(updatedFolders, null, 2)
    );*/

    // REPOSITION FOLDERS
    updatedFolders = updatedFolders.map((f) => {
      if (foldersRepositioning?.some(fr => fr.id === f.id)) { // NOTE FOR ME: some = boolean, find = object
        return {
          ...f,
          position: f.position - marginRepositioning
        };
      } else {
        return f;
      }
    });

    /*console.log(
      "%c📁 DANACH Folders:",
      "color: red; font-weight: bold;",
      JSON.stringify(updatedFolders, null, 2)
    );*/

    setFolders(updatedFolders);

    // PERSIST: Delete folders
    if(foldersToDelete) {
      try {
        const response = await fetch("http://localhost:8080/api/folders", {
        //const response = await fetch("http://xxx.xxx.x.xxx:8080/api/folders", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folders: foldersToDelete.map(f => ({
              id: f.id,
              title: f.title,
              position: f.position,
              parentFolderId: f.parentFolder?.id || null,
              folderLevel: f.folderLevel,
              isLastFolder: f.isLastFolder,
              updatedAt: new Date()
            }))
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
      } catch (error) {
        console.error("Error: Can't delete folder.", error);
        setFolders(oldFolders);
        
        return;
        // TODO: Error-Notification
      }
    } else return;

    // PERSIST: Reposition folders (BULKD PATCH)
    try {
      const response = await fetch("http://localhost:8080/api/folders", {
      //const response = await fetch("http://xxx.xxx.x.xxx:8080/api/folders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folders: updatedFolders.map(f => ({
            id: f.id,
            title: f.title,
            position: f.position,
            parentFolderId: f.parentFolder?.id || null,
            folderLevel: f.folderLevel,
            isLastFolder: f.isLastFolder,
            updatedAt: new Date()
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error: Can't delete folder.", error);
      setFolders(oldFolders);
      return;
      // TODO: Error-Notification
    }
  }

  return {
    handleCreateFolderClick,
    handleUpdateFolderData,
    handleFolderSelect,
    handleDeleteFolder
  };
}