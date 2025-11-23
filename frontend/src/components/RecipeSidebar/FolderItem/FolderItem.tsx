import '../sidebar.css';
import type { FolderData } from '../../../types/FolderData';
import { useEffect, /*useRef, useState*/ } from 'react';

// Imports of the custom-hooks- and utils-folder
import { useFolderInteractions } from "./hooks/useFolderInteractions";
import { calculateAmountAllSubfolders } from "./utils/folderCalculations";
// import Tooltip from '../../tooltips/Tooltip';


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
    onFinalizeFolderSettingsClick: handleFinalizeFolderSettingsClick,
    setTouchPos: setTouchPos,
    touchPos: touchPos,
    draggedFolder: draggedFolder
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
        onFinalizeFolderSettingsClick: (cursor: React.MouseEvent<HTMLDivElement>) => void,
        setTouchPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>,
        touchPos: { x: number; y: number } | null,
        draggedFolder: FolderData | null
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
        handleFolderTitleEnter,
        handleTouchStart,
        handleTouchEnd
    } = useFolderInteractions({
        folderData,
        activeFolderId,
        handleUpdateFolderData,
        handleFolderSelect,
        handleUpdateDraggedFolder,
        handleFinalizeFolderDragEnd,
        handleFinalizeFolderSettingsClick,
        setTouchPos
    });

    const { amountOfActiveSubfolders } = calculateAmountAllSubfolders(folderData, folders);

    let subfolders: FolderData[] | null = folders.filter(f => folderData.id === f.parentFolder?.id);

    /*const [showTooltip, setShowTooltip] = useState(false);
    const hoverTimer = useRef<number | null>(null);

    const handleMouseEnter = () => {
        hoverTimer.current = window.setTimeout(() => {
            setShowTooltip(true);
        }, 800);
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
        }
        setShowTooltip(false);
    };*/


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
        {isDragging && draggedFolder && touchPos && (
        <div
            className="folder-drag-preview"
            style={{
            position: 'fixed',
            top: touchPos.y,
            left: touchPos.x,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            }}
        >
            {draggedFolder.title}
        </div>
        )}

        <div className="recipe-folder-container-wrapper">
            {folderData.parentFolder?.id && (
                <span 
                    className={`sub-folder-line ${
                        folderData.parentFolder.id ? `sub-folder-line-spacing-${folderData.folderLevel}` : ''
                    }`}
                    style={{ 
                        height: `${
                            folderData.isLastFolder
                                ? 38 + (44 * amountOfActiveSubfolders)
                                : 44 + (44 * amountOfActiveSubfolders)
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

                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
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
                                    ? { "--targeted-folders-height": `${38 + amountOfActiveSubfolders * 44}px` } as React.CSSProperties
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
                        /*onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}*/
                    >
                        <img className='item-settings' alt="item-settings" />

                        {/* {showTooltip && <Tooltip tooltipString="Rename, delete, and more..." />} */} 
                        {/* NOT USED currently because Scrollbar is always over elements: ChatGPT, Gemini and Claude don't have it either*/}
                    </div>}
                </div>
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
                    setTouchPos={setTouchPos}
                    touchPos={touchPos}
                    draggedFolder={draggedFolder}
                />
            ))}
        </>
    );
}

export default FolderItem;