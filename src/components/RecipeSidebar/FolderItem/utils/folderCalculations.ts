import type { FolderData } from "../../../../types/FolderData";

export function calculateSubfolderCounts(folderData: FolderData) {
  let amountOfActiveSubfolders = 0;
  let amountOfAllSubfolders = 0;

  folderData.subfolders.forEach((f) => {
    if (f.isOpen) {
      amountOfActiveSubfolders += f.subfolders.length;
      amountOfAllSubfolders += f.subfolders.length;
    }

    f.subfolders.forEach((sf) => {
      if (sf.isOpen) {
        amountOfAllSubfolders += sf.subfolders.length;
      }
    });
  });

  if (!folderData.isOpen) {
    amountOfActiveSubfolders = 0;
    amountOfAllSubfolders = 0;
  } else {
    amountOfActiveSubfolders += folderData.subfolders.length;
    amountOfAllSubfolders += folderData.subfolders.length;
  }

  return { amountOfActiveSubfolders, amountOfAllSubfolders };
}
