import './sidebar.css';
import type { FolderData } from '../../types/FolderData';

function FolderItemSettingsMenu( 
{
    onDeleteFolder: handleDeleteFolder,
    onUpdateFolderData: handleUpdateFolderData,
    activeFolderId
}:
    {
        onDeleteFolder: () => void,
        onUpdateFolderData: (id: string, updates: Partial<FolderData>, e?: React.MouseEvent<HTMLDivElement>) => void,
        activeFolderId: string | null
    }
) {
    function onRenameFolderTitle() {
        if(activeFolderId) handleUpdateFolderData(activeFolderId, { isEditing: true })
    }

    return (
        <div className='settings-menu_container'>
            <div 
                className="settings-menu-item"
                onClick={onRenameFolderTitle}
            >
                <img src='src/assets/pen-writing.svg' alt='rename-icon'/>
                <p>Rename...</p>
            </div>
            <div 
                className="settings-menu-item menu-item-delete"
                onClick={handleDeleteFolder}
            >
                <img src='src/assets/trash-icon.svg' alt='trash-icon'/>
                <p>Delete</p>
            </div>
        </div>
    )
}

export default FolderItemSettingsMenu;