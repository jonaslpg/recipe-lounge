package com.recipelounge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recipelounge.entity.FolderEntity;

public interface FolderRepository extends JpaRepository<FolderEntity, String> {

    List<FolderEntity> findByParentFolderId(String parentFolderId);

    long countByParentFolderIsNull();
    long countByParentFolderId(String parentId);

    List<FolderEntity> findByParentFolderIsNullOrderByPositionAsc();
    List<FolderEntity> findByParentFolderIdOrderByPositionAsc(String parentId);

    List<FolderEntity> findByPositionGreaterThanEqualOrderByPositionAsc(int position);

    List<FolderEntity> findByPositionBetweenOrderByPositionAsc(int start, int end);



}
