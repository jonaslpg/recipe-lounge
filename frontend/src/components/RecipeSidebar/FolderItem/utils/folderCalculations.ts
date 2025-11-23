import type { FolderData } from "../../../../types/FolderData";

/**
 * Calculates the amount of active subfolders of a folder.
 * 
 * @param folderData 
 * @param allFolders 
 * @returns 
 */
export function calculateAmountAllSubfolders(folderData: FolderData, allFolders: FolderData[]) {
  //let amountOfAllSubfolders = 0; // falsch
  let amountOfActiveSubfolders = 0;

  function countSubfoldersRecursive(parentId: string, countOnlyOpen: boolean): number {
    const subfolders = allFolders.filter(f => f.parentFolder?.id === parentId);
    let count = subfolders.length;

    for (const sf of subfolders) {
      if (sf.isOpen || !countOnlyOpen) {
        count += countSubfoldersRecursive(sf.id, countOnlyOpen);
      }
    }

    return count;
  }

  if (!folderData.isOpen) {
    //amountOfAllSubfolders = countSubfoldersRecursive(folderData.id, false);
    amountOfActiveSubfolders = 0;
  } else {
    //amountOfAllSubfolders = countSubfoldersRecursive(folderData.id, false);
    amountOfActiveSubfolders = countSubfoldersRecursive(folderData.id, true);
  }

  return { amountOfActiveSubfolders/*, amountOfAllSubfolders*/ };
}
