export interface FolderData {
  id: string;
  title: string;
  folderLevel: number;
  subfolders: FolderData[];
  //amountOfAllSubfolders: number;
  isSubfolder: boolean;
  isLastSubfolder: boolean;
  isOpen: boolean;
  isEditing: boolean;
  isSelected: boolean;
}