export interface FolderData {
  id: string;
  title: string;
  folderLevel: number;
  subfolders: FolderData[];
  isSubfolder: boolean;
  isLastFolder: boolean;
  isOpen: boolean;
  isEditing: boolean;
  isSelected: boolean;
}