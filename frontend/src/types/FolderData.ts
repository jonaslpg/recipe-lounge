// DB-Modell
export interface FolderEntity {
  id: string;
  title: string;
  parentFolder: FolderEntity | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  isLastFolder: boolean;
  folderLevel: number;
}

// UI-Modell (erweitert um visuelle Zustände)
// Die Daten werden aus DB geholt,
// UI-Zustände werden dann zusätzlich rangeheftet für die Session:
export interface FolderView {
  //id: string;
  isOpen: boolean;
  isSelected: boolean;
  //(isLastFolder: boolean;
  //folderLevel: number;
  //isVisible: boolean;
  isEditing: boolean;
}

  //isSubfolder: boolean;
  //isLastFolder: boolean;


export type FolderData = FolderEntity & FolderView;