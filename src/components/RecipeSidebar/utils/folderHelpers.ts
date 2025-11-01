import type { FolderData } from "../../../types/FolderData";

export function updateLastFolderPropRecursive(givenFolders: FolderData[]): FolderData[] {
    return givenFolders.map((f, index) => {
        return {
            ...f,
            isLastFolder: index === givenFolders.length-1 ? true : false,
            subfolders: updateLastFolderPropRecursive(f.subfolders)
        }
    })
};

export function findFolderLevelRecursive(
    givenFolders: FolderData[],
    targetFolderId: string
): number {
if (givenFolders.length === 0) return 0;

for (const f of givenFolders) {
    if (f.id === targetFolderId) {
    return f.folderLevel + 1;
    }

    const subResult = findFolderLevelRecursive(f.subfolders, targetFolderId);
    if (subResult > 0) return subResult;
}

return 0;
}

export function deleteFolderRecursive(folders: FolderData[], id: string): FolderData[] {
    return folders
    .filter(f => f.id !== id)
    .map(f => ({
        ...f,
        subfolders: deleteFolderRecursive(f.subfolders, id)
    }));
};

export function addSubfolderRecursive(
    givenFolders: FolderData[],
    newSubfolder: FolderData,
    targetFolderId: string
): FolderData[] {
if (givenFolders.length === 0) return [];

return givenFolders.map((f) => {
    if (f.id === targetFolderId) {
    return {
        ...f,
        subfolders: [...f.subfolders, newSubfolder],
    };
    }

    return {
    ...f,
    subfolders: addSubfolderRecursive(f.subfolders, newSubfolder, targetFolderId),
    };
});
}
