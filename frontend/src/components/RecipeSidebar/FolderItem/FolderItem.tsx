import '../sidebar.css';
import type { FolderData } from '../../../types/FolderData';
import { useEffect } from 'react';

// Imports of the custom-hooks- and utils-folder
import { useFolderInteractions } from "./hooks/useFolderInteractions";
import { calculateAmountAllSubfolders } from "./utils/folderCalculations";


function FolderItem(
{
    folderData, 
    onUpdateFolderData: handleUpdateFolderData,
    onFolderSelect: handleFolderSelect,
    onUpdateDraggedFolder: handleUpdateDraggedFolder,
    targetFolderId,
    activeFolderId,
    folders,
    onFinalizeFolderDragEnd: handleFinalizeFolderDragEnd,
    onFinalizeFolderSettingsClick: handleFinalizeFolderSettingsClick
}: 
    { 
        folderData: FolderData, 
        onUpdateFolderData: (id: string, updates: Partial<FolderData>, e?: React.MouseEvent<HTMLDivElement>) => void,
        onFolderSelect: (id: string, selected: boolean, e: React.MouseEvent<HTMLDivElement>) => void,
        onUpdateDraggedFolder: (folderData: FolderData) => void,
        targetFolderId: string | null,
        activeFolderId: string | null,
        folders: FolderData[],
        onFinalizeFolderDragEnd: () => void,
        onFinalizeFolderSettingsClick: (cursor: React.MouseEvent<HTMLDivElement>) => void
    }
) {
    const { 
        folderRef,
        inputRef,
        isDragging,
        isSettingsIconActive,
        handleFolderDragStart,
        handleFolderDragEnd,
        handleDropdownClick,
        handleFolderSettingsClick,
        handleFolderClick,
        handleFolderDoubleClick,
        handleFolderTitleEnter
    } = useFolderInteractions({
        folderData,
        activeFolderId,
        handleUpdateFolderData,
        handleFolderSelect,
        handleUpdateDraggedFolder,
        handleFinalizeFolderDragEnd,
        handleFinalizeFolderSettingsClick
    });

    const { amountOfActiveSubfolders, amountOfAllSubfolders } = calculateAmountAllSubfolders(folderData, folders);

    let subfolders: FolderData[] | null = folders.filter(f => folderData.id === f.parentFolder?.id);

    useEffect(() => {
        if (folderData.isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [folderData.isEditing]);

    useEffect(() => {
        subfolders = folders.filter(f => folderData.id === f.parentFolder?.id);
    }, [folders])


    return (
        <>
        {folderData.parentFolder?.id && (
            <span 
                className={`sub-folder-line ${
                    folderData.parentFolder.id ? `sub-folder-line-spacing-${folderData.folderLevel}` : ''
                }`}
                style={{ 
                    height: `${
                        folderData.isLastFolder
                            ? 38 + (44 * amountOfActiveSubfolders)
                            : 44 + (44 * amountOfActiveSubfolders) // 44
                    }px`,
                }}
            ></span>
        )}

        <div
            className={`recipe-folder-container
            ${folderData.isEditing ? 'folder-div-editing' : ''}
                `}
            data-id={folderData.id}
            onClick={handleFolderClick}
            onDoubleClick={handleFolderDoubleClick}
            onDragStart={handleFolderDragStart}
            onDragEnd={handleFolderDragEnd}
            ref={folderRef}
        >

            <div 
                className={`recipe-folder-div
                    ${folderData.parentFolder?.id ? `sub-folder-spacing-${folderData.folderLevel}` : ''}
                    ${folderData.isSelected ? 'recipe-folder-div-selected' : ''}
                `}
                draggable={folderData.isEditing ? false : true}
            >
                {folderData.id === targetFolderId && (
                    <div 
                        style={
                            folderData.isOpen 
                                ? { "--targeted-folders-height": `${38 + amountOfAllSubfolders * 44}px` } as React.CSSProperties
                                : {}
                        }
                        className={`target-all-folders
                            ${folderData.parentFolder?.id ? `sub-folder-spacing-${folderData.folderLevel}` : ''
                        }`}
                    ></div>
                )}

                {folderData.folderLevel !== 3 && (
                    <div className="dropdown_container" onClick={handleDropdownClick}>
                        <img 
                            className={`chevron ${folderData.isOpen ? 'chevron-opened' : ''}`} 
                            alt="chevron" 
                        />
                    </div>
                )}
                {folderData.isOpen ? (
                    <img className="folder-icon-opened" alt="folder" /> 
                ) : ( 
                    <img className="folder-icon-closed" alt="folder" />
                )}

                <input
                    ref={inputRef}
                    className={`recipe-folder-title ${folderData.isEditing ? '' : 'noedit'}`}
                    value={folderData.title}
                    onChange={(e) => {
                        if(folderData.isEditing){
                            handleUpdateFolderData(folderData.id, { title: e.target.value });
                        }
                    }}
                    onKeyDown={handleFolderTitleEnter}
                    readOnly={!folderData.isEditing}
                    style={folderData.isEditing ? { color: "#1F1F1F" } : {}}
                    spellCheck={false}
                    onDragStart={(e) => e.preventDefault()}
                />

                {!folderData.isEditing && !isDragging && <div
                    className={`settings_container ${isSettingsIconActive ? "settings_container-visibile" : ''}`} 
                    onClick={handleFolderSettingsClick}
                >
                    <img className='item-settings' alt="item-settings" />
                </div>}
            </div>
        </div>

        {folderData.isOpen && subfolders !== null &&
            subfolders.map((subfolder) => (
                <FolderItem
                    key={subfolder.id}
                    folderData={subfolder}
                    onUpdateFolderData={handleUpdateFolderData}
                    onFolderSelect={handleFolderSelect}
                    onUpdateDraggedFolder={handleUpdateDraggedFolder}
                    onFinalizeFolderDragEnd={handleFinalizeFolderDragEnd}
                    onFinalizeFolderSettingsClick={handleFinalizeFolderSettingsClick}
                    targetFolderId={targetFolderId}
                    activeFolderId={activeFolderId}
                    folders={folders}
                />
            ))}
        </>
    );
}

export default FolderItem;