package com.recipelounge.entity;

import java.util.List;


public class FolderBatchUpdateDTO {
    private List<FolderDTO> folders;

    public List<FolderDTO> getFolders() {
        return folders;
    }
    public void setFolders(List<FolderDTO> folders) {
        this.folders = folders;
    }
}
