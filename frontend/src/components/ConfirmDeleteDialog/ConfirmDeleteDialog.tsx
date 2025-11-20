import './confirmDeleteDialog.css'
import type { FolderData } from '../../types/FolderData';

function ConfirmDeleteDialog( 
{
    deleteDialogOpened: deleteDialogOpened,
    setDeleteDialogOpened: setDeleteDialogOpened,
    handleDeleteFolder: handleDeleteFolder,
    activeFolderId: activeFolderId,
    folders: folders,
}:
    {
        deleteDialogOpened: boolean;
        setDeleteDialogOpened: React.Dispatch<React.SetStateAction<boolean>>;
        handleDeleteFolder: () => void;
        activeFolderId: string | null;
        folders: FolderData[];
    }
) {
    let curActiveFolderName: string | undefined = folders.find(f => f.id === activeFolderId)?.title;

    function handleConfirmDeleteClick(){
        handleDeleteFolder();
        setDeleteDialogOpened(false);
    }

    function handleCancelClick(){
        setDeleteDialogOpened(false);
    }

    return (
        <>
        {deleteDialogOpened && (
        <>
        <div className="background-filler"></div>
        <div className="confirm-delete-dialog-div">
            <div className="delete-text-close-icon-div">
                <p>Delete folder</p>
                <img className="delete-dialog-close-icon" onClick={handleCancelClick} src="src/assets/x-close.svg"></img>
            </div>
            <div className="delete-dialog-text">
                <p>Are you sure you want to delete "{curActiveFolderName}"?</p>
            </div>
            <div className="delete-dialog-btns">
                <button className="delete-dialog-btn" onClick={handleConfirmDeleteClick}>Delete</button>
                <button className="cancel-dialog-btn" onClick={handleCancelClick}>Cancel</button>
            </div>
        </div>
        </>
        )}</>
    )
}

export default ConfirmDeleteDialog