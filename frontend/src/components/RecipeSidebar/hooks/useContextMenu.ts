type ContextMenuParams = {
  settingsMenuOpened: boolean;
  activeFolderId: string | null;
  setSettingsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  setContextMenu: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
};

export function useContextMenu({
  settingsMenuOpened,
  activeFolderId,
  setSettingsMenuOpened,
  setActiveFolderId,
  setContextMenu
}: ContextMenuParams) {

    function handleFinalizeFolderSettingsClick(e: React.MouseEvent<HTMLDivElement>) {
      e.stopPropagation();
      e.preventDefault();

      const folderElement = (e.target as HTMLElement).closest('.recipe-folder-container');
      const id = folderElement?.getAttribute('data-id');
      if (!id) return;

      // close context menu on a new folder
      if (settingsMenuOpened && activeFolderId === id) {
        setSettingsMenuOpened(false);
        //setActiveFolderId(null);
        setContextMenu(null);
        return;
      }

      // open context menu for the first time
      setSettingsMenuOpened(true);
      setActiveFolderId(id);
      setContextMenu({ x: e.pageX, y: e.pageY });
      
    };

    return {
    handleFinalizeFolderSettingsClick
  };
}