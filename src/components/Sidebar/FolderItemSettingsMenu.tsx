import './sidebar.css';
import type { FolderData } from '../../types/FolderData';

function FolderItemSettingsMenu( 
{
    onUpdateData,
    activeFolderId
}:
    {
        onUpdateData: (id: string, updates: Partial<FolderData>, e?: React.MouseEvent<HTMLDivElement>) => void,
        activeFolderId: string | null
    }
) {
    const onRenameFolderTitle = () => {
        if(activeFolderId) onUpdateData(activeFolderId, { isEditing: true })
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
            <div className="settings-menu-item menu-item-delete">
                <img src='src/assets/trash-icon.svg' alt='trash-icon'/>
                <p>Delete</p>
            </div>
        </div>
    )
}

export default FolderItemSettingsMenu;