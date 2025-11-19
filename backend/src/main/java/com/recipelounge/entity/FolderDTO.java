package com.recipelounge.entity;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class FolderDTO {

    @Size(max = 15)
    @Pattern(regexp = "^[A-Za-zÄÖÜäöüß0-9 ]*$")
    private String title;
    private String parentFolderId;
    private int position;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int folderLevel;
    private boolean isLastFolder;

    private String id;
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getParentFolderId() { return parentFolderId; }
    public void setParentFolderId(String parentFolderId) { this.parentFolderId = parentFolderId; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public int getFolderLevel() { return folderLevel; }
    public void setFolderLevel(int folderLevel) { this.folderLevel = folderLevel; }

    public boolean getIsLastFolder() { return isLastFolder; }
    public void setIsLastFolder(boolean isLastFolder) { this.isLastFolder = isLastFolder; }
}

