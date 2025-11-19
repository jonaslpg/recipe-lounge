package com.recipelounge.controller;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.recipelounge.entity.FolderBatchUpdateDTO;
import com.recipelounge.entity.FolderDTO;
import com.recipelounge.entity.FolderEntity;
import com.recipelounge.repository.FolderRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "http://localhost:5173")
public class FolderController {

    private final FolderRepository folderRepository;

    public FolderController(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    @GetMapping
    public List<FolderEntity> getAllFolders() {
        return folderRepository.findAll(Sort.by(Sort.Direction.ASC, "position"));
    }

    @GetMapping("/{id}")
    public FolderEntity getFolder(@PathVariable("id") String id) {
        FolderEntity folder = folderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        return folder;
    }

    @PostMapping
    public FolderEntity createFolder(@RequestBody @Valid FolderDTO dto) {

        FolderEntity folder = new FolderEntity();
        folder.setTitle(dto.getTitle());
        folder.setCreatedAt(dto.getCreatedAt());
        folder.setUpdatedAt(dto.getUpdatedAt());
        folder.setParentFolder(null);
        folder.setPosition(((int)folderRepository.count())+1); // new folder always has the highest position (is last folder)
        folder.setFolderLevel(dto.getFolderLevel());
        folder.setIsLastFolder(dto.getIsLastFolder());

        return folderRepository.save(folder);
    }

    @PutMapping("/{id}")
    public FolderEntity replaceFolder(@PathVariable("id") String id, @RequestBody @Valid FolderDTO dto) {
        FolderEntity folder = folderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        folder.setTitle(dto.getTitle());
        folder.setPosition(dto.getPosition());
        folder.setCreatedAt(dto.getCreatedAt());
        folder.setUpdatedAt(dto.getUpdatedAt());
        folder.setFolderLevel(dto.getFolderLevel());
        folder.setIsLastFolder(dto.getIsLastFolder());

        if (dto.getParentFolderId() != null) {
            FolderEntity parent = folderRepository.findById(dto.getParentFolderId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
            folder.setParentFolder(parent);
        } else {
            folder.setParentFolder(null);
        }

        return folderRepository.save(folder);
    }


    @PatchMapping("/{id}")
    public FolderEntity updateFolder(@PathVariable("id") String id, @RequestBody @Valid FolderDTO dto) {
        FolderEntity folder = folderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        if (dto.getTitle() != null) folder.setTitle(dto.getTitle());
        if (dto.getCreatedAt() != null) folder.setCreatedAt(dto.getCreatedAt());
        if (dto.getUpdatedAt() != null) folder.setUpdatedAt(dto.getUpdatedAt());
        if (dto.getParentFolderId() != null) {
            FolderEntity parent = folderRepository.findById(dto.getParentFolderId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
            folder.setParentFolder(parent);
        }
        if (dto.getPosition() != 0) folder.setPosition(dto.getPosition()); // ?

        if (dto.getFolderLevel() != 0) folder.setFolderLevel(dto.getFolderLevel()); // ?
        folder.setIsLastFolder(dto.getIsLastFolder()); // ?

        return folderRepository.save(folder);
    }

    @PatchMapping
    @Transactional
    public List<FolderEntity> updateMany(@RequestBody FolderBatchUpdateDTO dto) {

        for (FolderDTO f : dto.getFolders()) {

            FolderEntity folder = folderRepository.findById(f.getId())
                .orElseThrow(() -> new RuntimeException("Folder not found: " + f.getId()));

            if (f.getTitle() != null) folder.setTitle(f.getTitle());
            if (f.getPosition() != 0) folder.setPosition(f.getPosition());
            if (f.getUpdatedAt() != null) folder.setUpdatedAt(f.getUpdatedAt());
            folder.setIsLastFolder(f.getIsLastFolder());
            if (f.getFolderLevel() != 0) folder.setFolderLevel(f.getFolderLevel());

            if (f.getParentFolderId() != null) {
                FolderEntity parent = folderRepository.findById(f.getParentFolderId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
                folder.setParentFolder(parent);
            }

            folderRepository.save(folder);
        }

        return folderRepository.findAll(Sort.by(Sort.Direction.ASC, "position"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public List<FolderEntity> deleteFolder(@PathVariable("id") String id) {

        // get folder to delete
        FolderEntity toDelete = folderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Folder not found"));

        //FolderEntity parent = toDelete.getParentFolder();

        // delete children of the deleted folder
        List<FolderEntity> children = folderRepository.findByParentFolderId(id);
        for (FolderEntity child : children) {
            folderRepository.delete(child);
        }

        folderRepository.delete(toDelete);

        return folderRepository.findAll(Sort.by(Sort.Direction.ASC, "position"));
    }

}
