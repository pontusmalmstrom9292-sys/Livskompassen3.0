import { useState } from 'react';
import { ProjektPickerSheet } from '../../projects/components/ProjektPickerSheet';
import { usePlaneringHubLayout } from '../usePlaneringHubLayout';
import { PlaneringHubBody } from './PlaneringHubBody';

/** Verktygsväljare — layout styrs av PlaneringHubLayoutPicker på sidan. */
export function PlaneringHub() {
  const { layout } = usePlaneringHubLayout();
  const [projektSheetOpen, setProjektSheetOpen] = useState(false);

  return (
    <div className="space-y-4">
      <p className="planering-hub__hint">
        Starta projekt högst upp. Öppna en kategori nedan — en i taget.
      </p>
      <PlaneringHubBody
        layout={layout}
        onStartProjekt={() => setProjektSheetOpen(true)}
      />
      <ProjektPickerSheet
        open={projektSheetOpen}
        onClose={() => setProjektSheetOpen(false)}
      />
    </div>
  );
}
