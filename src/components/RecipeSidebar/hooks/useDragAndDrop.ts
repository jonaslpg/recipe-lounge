import type { FolderData } from "../../../types/FolderData";
import { updateLastFolderPropRecursive, findFolderLevelRecursive, deleteFolderRecursive, addSubfolderRecursive } from "../utils/folderHelpers";

type DragAndDropParams = {
  setFolders: React.Dispatch<React.SetStateAction<FolderData[]>>;
  draggedFolder: FolderData | null;
  setDraggedFolder: React.Dispatch<React.SetStateAction<FolderData | null>>;
  targetFolderId: string | null;
  setTargetFolderId: React.Dispatch<React.SetStateAction<string | null>>;
};

export function useDragAndDrop({
  setFolders,
  draggedFolder,
  setDraggedFolder,
  targetFolderId,
  setTargetFolderId,
}: DragAndDropParams) {


    // function, when dropping a folder: creates new subfolder and updates the folders-array
    function handleFinalizeFolderDragEnd() {
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
        let newFolderLevel = findFolderLevelRecursive(prevFolders, targetFolderId);

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

          sf.subfolders.forEach((sf2) => {
            sf2.folderLevel = newFolderLevel+2;
          })
        })

        // for the case, that an open empty folder is put as last possible subfolder
        if(newSubfolder.folderLevel === 3) newSubfolder.isOpen = false;

        // delete old dragged folder
        prevFolders = deleteFolderRecursive(prevFolders, draggedFolder.id);

        // add new subfolder in the FolderData-array
        prevFolders = addSubfolderRecursive(prevFolders, newSubfolder, targetFolderId);

        prevFolders = updateLastFolderPropRecursive(prevFolders);

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


    // helper method for "handleFinalizeFolderDragEnd"
    function cannotDragToSubfolder(tmpFolder: FolderData): boolean {
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



    function handleSidebarDragOver(e: React.DragEvent) {
      e.preventDefault();
      const target = (e.target as HTMLElement).closest('.recipe-folder-container') as HTMLDivElement;
      const targetId = target?.dataset.id;

      if(target && draggedFolder && targetId && targetId !== draggedFolder.id){
        setTargetFolderId(targetId);
      } else if (targetId && draggedFolder && targetId === draggedFolder.id){
        setTargetFolderId(null);
      }
    };

    function handleUpdateDraggedFolder(folder: FolderData) {
      setDraggedFolder(folder);
    };

    return {
    handleFinalizeFolderDragEnd,
    handleSidebarDragOver,
    handleUpdateDraggedFolder
  };
}