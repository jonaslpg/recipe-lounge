export interface FolderData {
  id: string;
  title: string;
  folderLevel: number; // -> nicht für DB relevant?
  subfolders: FolderData[];
  isSubfolder: boolean; // -> nicht für DB relevant?
  isLastFolder: boolean; // -> nicht für DB relevant?
  isOpen: boolean;
  isEditing: boolean; // -> nicht für DB relevant?
  isSelected: boolean;
}