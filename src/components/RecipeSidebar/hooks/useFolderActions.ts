import { v4 as uuidv4 } from 'uuid';
import type { FolderData } from "../../../types/FolderData";
import { updateLastFolderPropRecursive } from "../utils/folderHelpers";

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
  setFolders
}: FolderActionsParams) {

  function handleCreateFolderClick() {
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
  }
    
  function handleUpdateFolderData(id: string, updates: Partial<FolderData>, e?: React.MouseEvent<HTMLDivElement>) {
    if(activeFolderId && e) {
      const folderElement = (e.target as HTMLElement).closest('.recipe-folder-container');
      const id = folderElement?.getAttribute('data-id');
      setContextMenu(null);
      setSettingsMenuOpened(false);
      if(id) setActiveFolderId(id);
    }
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

  // helper method for "handleFolderSelect"
  function updateFolderIsSelected(
    folders: FolderData[],
    id: string,
    selected: boolean
  ): FolderData[] {
    const updateRecursive = (folders: FolderData[]): FolderData[] => {
      return folders.map(f => {
        const updatedFolder =
          f.id === id
            ? { ...f, isSelected: selected }
            : { ...f, isSelected: false };

        return {
          ...updatedFolder,
          subfolders: updateRecursive(updatedFolder.subfolders),
        };
      });
    };

    return updateRecursive(folders);
  }

  function handleFolderSelect(
    id: string,
    selected: boolean,
    e: React.MouseEvent<HTMLDivElement>
  ) {
    // Update UI (Context Menu)
    if (activeFolderId) {
      const folderElement = (e.target as HTMLElement).closest('.recipe-folder-container');
      const clickedId = folderElement?.getAttribute('data-id');
      setContextMenu(null);
      setSettingsMenuOpened(false);
      if (clickedId) setActiveFolderId(clickedId);
    }

    // Update data
    const updated = updateFolderIsSelected(folders, id, selected);
    setFolders(updated);

    console.log("%c📁 Folder selection updated", "color: limegreen", updated);
  }

  return {
    handleCreateFolderClick,
    handleUpdateFolderData,
    handleFolderSelect
  };
}