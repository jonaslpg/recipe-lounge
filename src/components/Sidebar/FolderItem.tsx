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
    const regexAlphaNumericOnly = /^[A-Za-zÄÖÜäöüß0-9 ]+$/;
    let amountOfActiveSubfolders: number = 0; // gets recalculated, every time the FolderItem is being rendered

    // Calculating how many subfolders are active for this FolderItem
    folderData.subfolders.forEach((f) => {
        // If a folder has subfolders and they are opened, add their subfolders.length
        if(f.isOpen){
            amountOfActiveSubfolders += f.subfolders.length;
        }
    })

    if(!folderData.isOpen){
        amountOfActiveSubfolders = 0; // If folder is closed no subfolder is active (visible)
    } else {
        amountOfActiveSubfolders += folderData.subfolders.length;
    }

    /* NOTE for myself:
    it's important that we only let the input be in focused-state when isEditing is true
    and when isEditing has changed
    -> without useEffect it runs for every render
    */
    useEffect(() => {
        if (folderData.isEditing) {
            inputRef.current?.focus();
        }
    }, [folderData.isEditing]);

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
            if(inputRef.current){ // if input isn't
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
        className={"recipe-folder-container"}
        /*`recipe-folder-container 
        ${folderData.isSubfolder ? `sub-folder-margin-${folderData.folderLevel}` : ''}
        `}*/
        data-id={folderData.id}
        >
            {folderData.isSubfolder && (
            <span 
                className={`sub-folder-line ${folderData.isSubfolder ? `sub-folder-margin-${folderData.folderLevel}` : ''}`}
                style={{ height: `${folderData.isLastSubfolder 
                    ? 
                    38 + (44 * (amountOfActiveSubfolders))
                    : 
                    44 + (44 * (amountOfActiveSubfolders))}px`,
                }}
            ></span>
            )}
                <div 
                className={
                    `recipe-folder ${folderData.isSubfolder ? `sub-folder-padding-${folderData.folderLevel}` : ''}
                    ${folderData.isSelected ? 'recipe-folder-div-opened' : 'recipe-folder-div-closed'}
                    ${targetFolderId === folderData.id ? 'chosen-folder' : ''}
                    ${folderData.isEditing ? 'folder-div-editing' : ''}
                    }
                    `}
                ref={folderRef}
                draggable={true}
                onDragStart={onFolderDragStart}
                onDragEnd={onFolderDragEnd}
                onClick={onFolderClick}
                >
                    {folderData.folderLevel !== 3 ?
                        <div 
                        className="dropdown_container"
                        onClick={onDropdownClick}
                        >
                            <img className={`chevron ${folderData.isOpen ? 'chevron-opened' : ''}`} alt="chevron" />
                        </div>
                    : ''}
                    {/*folderData.folderLevel !== 3
                        ?*/ (folderData.isOpen 
                            ? <img className="folder-icon-opened" alt="folder" /> 
                            : <img className="folder-icon-closed" alt="folder" />) 
                        /*: ''*/
                    }
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

        {folderData.isOpen && folderData.subfolders.map((subfolder) => (
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