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
    const regexLength = /^.{0,12}$/;
    const regexAlphaNumericOnly = /^[A-Za-zÄÖÜäöüß0-9]+$/;

    let counterSubfolderAmounts = 0;
    folderData.subfolders.forEach((f) => {
	    counterSubfolderAmounts += f.subfolders.length
    })

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
            saveInput();
        }
    };

    const saveInput = () => {
        if (inputRef.current /*&& !inputRef.current.contains(e.target as Node)*/) {
            if(inputRef.current){ // if it is not empty
                if(!inputRef.current.value) {
                    inputRef.current.value = "Untitled";
                }

                if (!regexLength.test(inputRef.current.value)) {
                    alert("Your Recipe title must be under 12 letters.");
                    onUpdateData(folderData.id,
                    { 
                        title: 'Untitled',
                        isEditing: false
                    });
                    // TODO: add a toast notification for this
                    return;
                } else if (!regexAlphaNumericOnly.test(inputRef.current.value)) {
                    alert("Your Recipe title can only have letters and numbers.");
                    onUpdateData(folderData.id,
                    { 
                        title: 'Untitled',
                        isEditing: false
                    });
                    // TODO: add a toast notification for this
                    return;
                } else {
                    onUpdateData(folderData.id,
                    { 
                        title: inputRef.current?.value || 'Untitled',
                        isEditing: false
                    });
                }
            }
        }
    };

    // when the user clicks anywhere inside or outside the document the folder is
    // created but with an untitled title
    useEffect(() => {
        if (!folderData.isEditing) return;

        document.addEventListener("mousedown", saveInput);
        window.addEventListener("blur", saveInput);

        return () => {
            document.removeEventListener("mousedown", saveInput);
            window.removeEventListener("blur", saveInput);
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
                style={{ height: `${folderData.isLastSubfolder 
                    ? 
                    40 + (48 * (folderData.subfolders.length + counterSubfolderAmounts))
                    : 
                    48 + (48 * (folderData.subfolders.length + counterSubfolderAmounts))}px` }}
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
                    value={folderData.title}
                    onChange={(e) => {
                        if(folderData.isEditing){
                            onUpdateData(folderData.id, { title: e.target.value });
                        }
                    }}
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