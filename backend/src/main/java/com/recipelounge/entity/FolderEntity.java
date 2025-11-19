package com.recipelounge.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "folders")
public class FolderEntity {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Size(max = 15, message = "Title darf maximal 15 Zeichen haben")
    @Pattern(regexp = "^[A-Za-zÄÖÜäöüß0-9 ]+$", message = "Nur Buchstaben, Zahlen und Leerzeichen erlaubt")
    private String title;

    //@ManyToOne(fetch = FetchType.EAGER) // ---> Note: Save it for later, in some cases it would be better to not fetch lazy
    @ManyToOne
    @JoinColumn(name = "parent_folder_id")
    private FolderEntity parentFolder; // Note: Be careful and avoid infinite loops, limit to 3 parentFolder

    private int position;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private int folderLevel;
    private boolean isLastFolder;


    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }


    // Note: Getter and Setter could be written by Lombok
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public FolderEntity getParentFolder() { return parentFolder; }
    public void setParentFolder(FolderEntity parentFolder) { this.parentFolder = parentFolder; }

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