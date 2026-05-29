import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import { ProjektPickerSheet } from '../../admin/projects/components/ProjektPickerSheet';

/**
 * P2: projekt-genväg på Planering/Projekt (bottom sheet). Övriga routes: ingen extra rad.
 */
export function FyrenSmartWidgetBar() {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (location.pathname.startsWith('/widget')) return null;

  const showProjektShortcut =
    location.pathname.startsWith('/planering') || location.pathname.startsWith('/projekt');

  if (!showProjektShortcut) return null;

  return (
    <>
      <div className="fyren-projekt-cta" aria-label="Projekt genvägar">
        <button
          type="button"
          className="fyren-projekt-cta__btn"
          onClick={() => setSheetOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
          Nytt projekt
        </button>
      </div>
      <ProjektPickerSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
