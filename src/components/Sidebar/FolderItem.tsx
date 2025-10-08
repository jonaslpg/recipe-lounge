import './sidebar.css';
import type { FolderData } from '../../types/FolderData';
import { useEffect, useRef } from 'react';

function FolderItem(
{
    folderData, 
    onUpdateData,
    onUpdateSelect
}: 
    { 
        folderData: FolderData, 
        onUpdateData: (id: string, updates: Partial<FolderData>) => void,
        onUpdateSelect: (id: string, selected: boolean) => void
    }
) {
    const folderContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    })

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
        <div ref={folderContainerRef} className="recipe-folder-container">

            <div 
            className={
                `recipe-folder 
                ${folderData.isSelected ? 'recipe-folder-div-opened' : 'recipe-folder-div-closed'}
                `} 
            draggable={true}
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
                onKeyDown={onInputEnter}
                placeholder="Untitled"
                readOnly={!folderData.isEditing}
                />

            </div>
        </div>
    );
}

export default FolderItem;

