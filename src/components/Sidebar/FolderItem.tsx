import './sidebar.css';
import type { FolderData } from '../../types/FolderData';
import { useEffect, useRef } from 'react';

function FolderItem(
{
    folderData, 
    onUpdateData,
    onUpdateSelect,
    onUpdateDraggedFolder,
    targetFolderId,
    onUpdateDragEnd
}: 
    { 
        folderData: FolderData, 
        onUpdateData: (id: string, updates: Partial<FolderData>) => void,
        onUpdateSelect: (id: string, selected: boolean) => void,
        onUpdateDraggedFolder: (folderData: FolderData) => void,
        targetFolderId: string | null,
        onUpdateDragEnd: () => void
    }
) {
    const folderRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    })

    const onFolderDragStart = (e: React.DragEvent) => {
        if(folderData.isEditing) return;
        e.stopPropagation();
        folderRef.current?.classList.add("folder-dragged");
        onUpdateDraggedFolder(folderData);
    }

    const onFolderDragEnd = (e: React.DragEvent) => {
        e.stopPropagation();
        folderRef.current?.classList.remove("folder-dragged");
        onUpdateDragEnd();
    }

    const onDropdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if(folderData.isEditing) return;
        onUpdateData(folderData.id, { isOpen: !folderData.isOpen });
    };

    const onFolderClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if(folderData.isEditing) return;
        onUpdateSelect(folderData.id, !folderData.isSelected);
    }

    const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.stopPropagation();
            if(inputRef.current){
                if(!inputRef.current.value) inputRef.current.value = "Untitled";
                onUpdateData(folderData.id, 
                    { 
                        title: inputRef.current.value,
                        isEditing: false
                    });
            }
        }
    };

    useEffect(() => {
        if (!folderData.isEditing) return;

        const saveInput = () => {
                onUpdateData(folderData.id, {
                title: inputRef.current?.value || 'Untitled',
                isEditing: false,
            });
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                saveInput();
            }
        };

        const handleWindowBlur = () => saveInput();

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("blur", handleWindowBlur);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, [folderData.isEditing, folderData.id, onUpdateData]);

    return (
        <>
        <div 
        className={
        `recipe-folder-container 
        ${folderData.isSubfolder ? `sub-folder-margin-${folderData.folderLevel}` : ''}
        `}
        data-id={folderData.id}
        >
            {folderData.isSubfolder && (
            <span 
                className="sub-folder-line"
                style={{ height: `${folderData.isLastSubfolder ? 40 : 48}px` }}
            ></span>
            )}
                <div 
                className={
                    `recipe-folder 
                    ${folderData.isSelected ? 'recipe-folder-div-opened' : 'recipe-folder-div-closed'}
                    ${targetFolderId === folderData.id ? 'chosen-folder' : ''}
                    `}
                ref={folderRef}
                draggable={true}
                onDragStart={onFolderDragStart}
                onDragEnd={onFolderDragEnd}
                onClick={onFolderClick}
                >
                    <div 
                    className="dropdown_container"
                    onClick={onDropdownClick}
                    >
                        <img className={`chevron ${folderData.isOpen ? 'chevron-opened' : ''}`} alt="chevron" />
                    </div>

                    <img className="folderIcon" alt="folder" />
                    <input
                    ref={inputRef}
                    className={
                        `recipe-folder-title
                        ${folderData.isEditing ? '' : 'noedit'}
                        `}
                    value={folderData.isEditing ? undefined : folderData.title}
                    onKeyDown={onInputEnter}
                    placeholder="Untitled"
                    readOnly={!folderData.isEditing}
                    />

                </div>
        </div>

        {folderData.subfolders.map((subfolder) => (
            <FolderItem
                key={subfolder.id}
                folderData={subfolder}
                onUpdateData={onUpdateData}
                onUpdateSelect={onUpdateSelect}
                onUpdateDraggedFolder={onUpdateDraggedFolder}
                onUpdateDragEnd={onUpdateDragEnd}
                targetFolderId={targetFolderId}
            />
        ))}
        </>
    );
}

export default FolderItem;

