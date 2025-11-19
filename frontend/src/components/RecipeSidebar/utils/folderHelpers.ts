import type { FolderView, FolderData } from "../../../types/FolderData";



export function getAllSubfolders(
  folders: FolderData[],
  parentId: string
): FolderData[] {
  const directChildren = folders.filter(f => f.parentFolder?.id === parentId);

  const allSubfolders = directChildren.flatMap(child => [
    child,
    ...getAllSubfolders(folders, child.id)
  ]);

  return allSubfolders;
}





/* ==== FOR LOCALSTORAGE ==== */

const UI_STATE_KEY = "folder_ui_state";

export function loadUIState(): Record<string, FolderView> {
  try {
    const data = localStorage.getItem(UI_STATE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveUIState(uiState: Record<string, FolderView>) {
  try {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
  } catch (e) {
    console.warn("Failed to save UI state", e);
  }
}

export function saveUIStateSingleFolder(folderId: string, uiPatch: Partial<FolderView>) {
  const state = loadUIState();
  state[folderId] = { ...state[folderId], ...uiPatch };
  saveUIState(state);
}
