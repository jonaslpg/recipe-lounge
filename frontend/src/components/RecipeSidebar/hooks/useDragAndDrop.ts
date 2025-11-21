import type { FolderData } from "../../../types/FolderData";
import { getAllSubfolders } from "../utils/folderHelpers";

type DragAndDropParams = {
  folders: FolderData[];
  setFolders: React.Dispatch<React.SetStateAction<FolderData[]>>;
  draggedFolder: FolderData | null;
  setDraggedFolder: React.Dispatch<React.SetStateAction<FolderData | null>>;
  targetFolderId: string | null;
  setTargetFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  setTouchPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
};

export function useDragAndDrop({
  folders,
  setFolders,
  draggedFolder,
  setDraggedFolder,
  targetFolderId,
  setTargetFolderId,
  setTouchPos
}: DragAndDropParams) {


  async function handleFinalizeFolderDragEnd() {
    console.clear();

    if (!draggedFolder || !targetFolderId) return;

    // prevent dragEnd on subfolders of a dragged folder
    // and prevent dragEnd on targetFolder itself
    if(checkIfTargetFolderIsNotValid()) {
      setDraggedFolder(null);
      setTargetFolderId(null);
      return;
    };

    const oldFolders: FolderData[] = folders;
    // shouldn't avoke if folderLevel > 3
    const updatedFolders: FolderData[] | null = updateFoldersDragEnd();
    if (!updatedFolders) {
      setDraggedFolder(null);
      setTargetFolderId(null);
      return;
    };

    // PERSIST BULK PATCH
    try {
      const response = await fetch(`http://localhost:8080/api/folders`, {
      //const response = await fetch(`http://xxx.xxx.x.xxx:8080/api/folders`, {
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
      console.error("Error: Can't update folder.", error);
      setFolders(oldFolders);
      // TODO: Error-Notification
    }

    console.log(
      "%c📁 Updated Folders:",
      "color: red; font-weight: bold;",
      JSON.stringify(updatedFolders, null, 2)
    );

    setDraggedFolder(null);
    setTargetFolderId(null);
  }

  function updateFoldersDragEnd(): FolderData[] | null {

    if(!draggedFolder) return null;
    // 1: calculate new position point of dragged folder and the subfolders of it
    let updatedFolders: FolderData[] = folders;

    const {
      targetFolder,
      allSubfoldersOfDraggedFolder,
      maxPosOfSubfolderOfTarget,
      posOfDraggedFolderOld,
      maxPosOfSubfolderOfDraggedOld,
      dragUp
    } = setupVariablesDragEnd(folders, draggedFolder, targetFolderId);


    // 2: set updated parent folder
    updatedFolders = updatedFolders.map(f => ({
      ...f,
      parentFolder: f.id == draggedFolder.id ? targetFolder : f.parentFolder
    }));

    // 3: set new positions and folderLevel of dragged folder and the subfolders of it
    const newPosDF: number = maxPosOfSubfolderOfTarget + 1;
    const newLevelDF: number = targetFolder.folderLevel+1;
    if(newLevelDF > 3) return null;
    draggedFolder.position = newPosDF;
    draggedFolder.folderLevel = newLevelDF;
    updatedFolders = updatePosLevelInFolders(updatedFolders, draggedFolder, newPosDF, newLevelDF);

    allSubfoldersOfDraggedFolder.forEach((sf, i) => {
      const newLevelSubfolderDF: number = calculateFolderLevel(updatedFolders, sf);
      sf.position = newPosDF+(i+1);
      sf.folderLevel = newLevelSubfolderDF;
      updatedFolders = updatePosLevelInFolders(updatedFolders, sf, (newPosDF+(i+1)), newLevelSubfolderDF);
    });

    const maxPosOfSubfolderOfDraggedNew: number = 
      allSubfoldersOfDraggedFolder.length > 0
        ? Math.max(...allSubfoldersOfDraggedFolder.map(f => f.position))
        : draggedFolder.position;

    // for case 2
    const sfOfDraggedFolderNew: FolderData[] = getAllSubfolders(updatedFolders, draggedFolder.id);


    // 4: get list from folders that need updated position
    if(dragUp) {
      // case 1:
      // 4.1: get list
      const foldersRepositioning: FolderData[] = updatedFolders.filter(f => {
        const isInRange: boolean =
          f.position >= (maxPosOfSubfolderOfTarget + 1) &&
          f.position <= (posOfDraggedFolderOld - 1);

        const isNotDragged: boolean = f.id !== draggedFolder.id;

        const isNotChildOfDragged: boolean = !allSubfoldersOfDraggedFolder
          .some(sub => sub.id === f.id);

        return isInRange && isNotDragged && isNotChildOfDragged;
      }).sort((a, b) => a.position - b.position);

      /*console.log(
        "%c📁 Folders in List BEFORE:",
        "color: red; font-weight: bold;",
        JSON.stringify(foldersRepositioning, null, 2)
      );*/

      // 4.2: set pos of items in list
      foldersRepositioning.forEach((f, i) => {
        const newPos: number = maxPosOfSubfolderOfDraggedNew + (i + 1);
        updatedFolders = updatePosLevelInFolders(updatedFolders, f, newPos);
        //f.position = newPos; // das muss da bleiben - oder doch nicht
      });

      /*console.log(
        "%c📁 Folders in List AFTER:",
        "color: red; font-weight: bold;",
        JSON.stringify(foldersRepositioning, null, 2)
      );*/


    // case 2:
    } else {
      // 4.1: get list
      const foldersRepositioning: FolderData[] = updatedFolders
        .filter(f => {
          if (f.id === draggedFolder.id) {
            return true;
          }

          const isInRange =
            f.position >= (maxPosOfSubfolderOfDraggedOld + 1) &&
            f.position <= (maxPosOfSubfolderOfDraggedNew);

          const isFolderOfDraggedNew = sfOfDraggedFolderNew.some(sf => sf.id === f.id);

          const isInDraggedRange =
            f.position >= (maxPosOfSubfolderOfDraggedOld + 1) &&
            f.position <= (draggedFolder.position - 1);

          return (
            (isInRange && isFolderOfDraggedNew) ||
            isInDraggedRange
          );
        })
        .sort((a, b) => a.position - b.position);


      // 4.2: set pos of items in list
      const newPositionMargin: number = posOfDraggedFolderOld;

      /*console.log(
        "%c📁 Folders in List BEFORE:",
        "color: red; font-weight: bold;",
        JSON.stringify(foldersRepositioning, null, 2)
      );*/

      foldersRepositioning.forEach((f, i) => {
        const newPos: number = newPositionMargin + i;
        updatedFolders = updatePosLevelInFolders(updatedFolders, f, newPos);
        //f.position = newPos;
      });
    
      /*console.log(
        "%c📁 Folders in List AFTER:",
        "color: red; font-weight: bold;",
        JSON.stringify(foldersRepositioning, null, 2)
      );*/
    }

    // 5: sort
    updatedFolders = updatedFolders.sort((a, b) => a.position - b.position);

    // 6: update isLastFolder
    updatedFolders = updateIsLastFolderOfFolders(updatedFolders);

    // 7: update
    setFolders(updatedFolders);

    return updatedFolders;
  }
 

  // helper function for "updateFoldersDragEnd"
  function updateIsLastFolderOfFolders(folders: FolderData[]): FolderData[] {
    const updatedFolders = folders.map(folder => ({ ...folder }));
    
    const foldersByParent = new Map<string | null, FolderData[]>();
    
    updatedFolders.forEach(folder => {
      const parentId = folder.parentFolder?.id ?? null;
      if (!foldersByParent.has(parentId)) {
        foldersByParent.set(parentId, []);
      }
      foldersByParent.get(parentId)!.push(folder);
    });
    
    foldersByParent.forEach((group) => {
      group.sort((a, b) => a.position - b.position);
      
      group.forEach((folder, index) => {
        folder.isLastFolder = index === group.length - 1;
      });
    });
    
    return updatedFolders;
  }


  // helper function for "updateFoldersDragEnd"
  function setupVariablesDragEnd(folders: FolderData[], draggedFolder: FolderData, targetFolderId: string | null) {
    const targetFolder: FolderData = folders.find(f => f.id === targetFolderId)!;

    let allSubfoldersOfTargetFolder: FolderData[] | undefined = undefined;
    if(targetFolderId) allSubfoldersOfTargetFolder = getAllSubfolders(folders, targetFolderId);
    let allSubfoldersOfDraggedFolder: FolderData[] = getAllSubfolders(folders, draggedFolder.id);

    let maxPosOfSubfolderOfTarget: number = 0;
    if(allSubfoldersOfTargetFolder) {
      maxPosOfSubfolderOfTarget =
            allSubfoldersOfTargetFolder.length > 0
              ? Math.max(...allSubfoldersOfTargetFolder.map(f => f.position))
              : targetFolder?.position;
    }

    const posOfDraggedFolderOld: number = draggedFolder.position;

    const maxPosOfSubfolderOfDraggedOld: number = 
    allSubfoldersOfDraggedFolder.length > 0
      ? Math.max(...allSubfoldersOfDraggedFolder.map(f => f.position))
      : draggedFolder?.position; // NOTE: If you copy code and change it, have attention..

    let dragUp: boolean = draggedFolder.position - targetFolder.position < 0 ? false : true;

    return {
      targetFolder,
      allSubfoldersOfTargetFolder,
      allSubfoldersOfDraggedFolder,
      maxPosOfSubfolderOfTarget,
      posOfDraggedFolderOld,
      maxPosOfSubfolderOfDraggedOld,
      dragUp
    };
  }


  // helper function for "updateFoldersDragEnd" that updates a single folder-data (2 props)
  function updatePosLevelInFolders(folders: FolderData[], updatedFolder: FolderData, newPos: number, newFolderLevel?: number) {
    return folders.map(f => ({
      ...f,
      position: f.id === updatedFolder.id ? newPos : f.position,
      folderLevel: f.id === updatedFolder.id && newFolderLevel !== undefined ? newFolderLevel : f.folderLevel,
    }));
  }


  // helper function for "updateFoldersDragEnd"
  function calculateFolderLevel(folders: FolderData[], folder: FolderData): number {
    let level = 0;
    let currentParentId = folder.parentFolder?.id;

    while (currentParentId) {
      level++;
      const parent = folders.find(f => f.id === currentParentId);
      currentParentId = parent?.parentFolder?.id;
    }

    return level;
  }


  // helper function for "handleFinalizeFolderDragEnd"
  function checkIfTargetFolderIsNotValid(): boolean {
    // prevent dragEnd on the dragged folder itself
    if (draggedFolder?.id === targetFolderId) return true;

    const allParentsOfDragged: FolderData[] = folders.filter(f => (f.id === draggedFolder?.parentFolder?.id) || // L1
                                                                f.id === draggedFolder?.parentFolder?.parentFolder?.id || // L2
                                                                f.id === draggedFolder?.parentFolder?.parentFolder?.parentFolder?.id); // L3

    for (const s of allParentsOfDragged) {
      if (s.id === targetFolderId) {
        return true;
      }
    }

    return false;
  };

  // -- for mobile
  function handleSidebarDragMove(e: React.TouchEvent<HTMLDivElement>) {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });
    
    const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    const target = el?.closest(".recipe-folder-container") as HTMLDivElement;
    const targetId = target?.dataset.id;

    if (target && draggedFolder && targetId && targetId !== draggedFolder.id) {
        setTargetFolderId(targetId);
    } else {
        setTargetFolderId(null);
    }
  }

  function handleSidebarDragOver(e: React.DragEvent) {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest(".recipe-folder-container") as HTMLDivElement;
    const targetId = target?.dataset.id;

    if (target && draggedFolder && targetId && targetId !== draggedFolder.id) {
      setTargetFolderId(targetId);
    } else {
      setTargetFolderId(null);
    }
  }


  function handleUpdateDraggedFolder(folder: FolderData) {
    setDraggedFolder(folder);
  }

  return {
    handleFinalizeFolderDragEnd,
    handleSidebarDragOver,
    handleUpdateDraggedFolder,
    handleSidebarDragMove
  };
}