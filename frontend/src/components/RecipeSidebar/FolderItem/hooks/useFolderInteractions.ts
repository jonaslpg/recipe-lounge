import { useState, useEffect, useRef } from "react";
import type { FolderData } from "../../../../types/FolderData";

type UseFolderInteractionsParams = {
    activeFolderId: string | null;
    folderData: FolderData;
    handleUpdateFolderData: (id: string, updates: Partial<FolderData>, e?: React.MouseEvent<HTMLDivElement>) => void;
    handleFolderSelect: (id: string, selected: boolean, e: React.MouseEvent<HTMLDivElement>) => void;
    handleUpdateDraggedFolder: (folderData: FolderData) => void;
    handleFinalizeFolderDragEnd: () => void;
    handleFinalizeFolderSettingsClick: (cursor: React.MouseEvent<HTMLDivElement>) => void;
};

export function useFolderInteractions({
    activeFolderId,
    folderData,
    handleUpdateFolderData,
    handleFolderSelect,
    handleUpdateDraggedFolder,
    handleFinalizeFolderDragEnd,
    handleFinalizeFolderSettingsClick
}: UseFolderInteractionsParams) {
    const folderRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isSettingsIconActive, setIsSettingsIconActive] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [previousTitle, setPreviousTitle] = useState("Untitled");

    // For the title validation
    const FOLDER_TITLE_MAX_LENGTH = /^.{0,15}$/;
    const FOLDER_TITLE_PATTERN = /^[A-Za-zÄÖÜäöüß0-9 ]+$/;

    useEffect(() => {
        setPreviousTitle(folderData.title);
    }, [folderData.isEditing]);

    // Close current settings-menu from folder if new settings-menu opens
    useEffect(() => {
        if (activeFolderId) {
            if(folderData.id !== activeFolderId) setIsSettingsIconActive(false);
        }
        window.addEventListener("click", () => setIsSettingsIconActive(false));
        window.addEventListener("blur", () => setIsSettingsIconActive(false));

        return () => {
            window.removeEventListener("click", () => setIsSettingsIconActive(false));
            window.removeEventListener("blur", () => setIsSettingsIconActive(false));
        }
    }, [activeFolderId]);

    /* When the user clicks anywhere inside or outside the document the folder is
       created but with an untitled title */
    useEffect(() => {
        if (!folderData.isEditing) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                saveInput();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("blur", saveInput);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("blur", saveInput);
        };
    }, [folderData.isEditing]);

    function saveInput() {
        if (inputRef.current) {
            
            inputRef.current.setSelectionRange(0, 0); // reverse .select()-commands

            if (!FOLDER_TITLE_MAX_LENGTH.test(inputRef.current.value)) {
                alert("Your Recipe title must be under 16 letters.");
                handleUpdateFolderData(folderData.id,
                {
                    title: previousTitle,
                    isEditing: false
                });
                // TODO: add a toast notification for this
                return;
            } else if (!FOLDER_TITLE_PATTERN.test(inputRef.current.value)) {
                alert("Your Recipe title can only have letters and numbers.");
                handleUpdateFolderData(folderData.id,
                {
                    title: previousTitle,
                    isEditing: false
                });
                // TODO: add a toast notification for this
                return;
            } else {
                handleUpdateFolderData(folderData.id,
                {
                    title: inputRef.current.value || 'Untitled',
                    isEditing: false
                });
            }
        }
    };


    // Event Handlers
    function handleFolderDragStart(e: React.DragEvent) {
        if (folderData.isEditing) return;
        e.stopPropagation();
        setIsDragging(true);
        folderRef.current?.classList.add("folder-dragged");
        handleUpdateDraggedFolder(folderData);
    };

    function handleFolderDragEnd(e: React.DragEvent) {
        e.stopPropagation();
        setIsDragging(false);
        folderRef.current?.classList.remove("folder-dragged");
        handleFinalizeFolderDragEnd();
    };

    function handleDropdownClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (folderData.isEditing) return;
        handleUpdateFolderData(folderData.id, { isOpen: !folderData.isOpen }, e);
        setIsSettingsIconActive(false);
    };

    function handleFolderSettingsClick(e: React.MouseEvent<HTMLDivElement>) {
        // e.stopPropagation in "onFolderSettingsClickGlobal"
        if (folderData.isEditing) return;
        handleFinalizeFolderSettingsClick(e);
        setIsSettingsIconActive(!isSettingsIconActive);
    };

    function handleFolderClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        setIsSettingsIconActive(false);
        if (folderData.isEditing) return;
        handleFolderSelect(folderData.id, !folderData.isSelected, e); // ?
    };

    // TODO: if user is on mobile version, prevent double-click -> inspiration: ChatGPT
    function handleFolderDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (folderData.isEditing) return;
        if ((e.target as HTMLElement).closest(".dropdown_container")) return;
        if ((e.target as HTMLElement).closest(".settings_container")) return;
        handleUpdateFolderData(folderData.id, { isEditing: true, isSelected: true });
    };

    function handleFolderTitleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.stopPropagation();
            saveInput();
        }
    };

    return {
        folderRef,
        inputRef,
        isDragging,
        isSettingsIconActive,
        setIsSettingsIconActive,
        saveInput,
        handleFolderDragStart,
        handleFolderDragEnd,
        handleDropdownClick,
        handleFolderSettingsClick,
        handleFolderClick,
        handleFolderDoubleClick,
        handleFolderTitleEnter
    };
}
