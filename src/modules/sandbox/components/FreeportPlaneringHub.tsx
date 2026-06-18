import { useState } from 'react';
import { PlaneringHubBody } from '@/features/admin/planning/components/PlaneringHubBody';
import { PlaneringHubLayoutPicker } from '@/features/admin/planning/components/PlaneringHubLayoutPicker';
import {
  PLANERING_HUB_LAYOUTS,
  type PlaneringHubLayoutId,
} from '@/features/admin/planning/planeringHubLayouts';

export function FreeportPlaneringHub() {
  const [layoutId, setLayoutId] = useState<PlaneringHubLayoutId>('verktygslada');
  const layout = PLANERING_HUB_LAYOUTS.find((l) => l.id === layoutId)!;

  return (
    <div>
      <section className="design-freeport__section">
        <p className="design-freeport__section-title">Planering — 8 hub-layouter</p>
        <p className="design-freeport__hint mt-1">
          Referens för hur andra zoner kan få layout picker. P3 Kanban låst i prod.
        </p>
        <div className="mt-3">
          <PlaneringHubLayoutPicker activeId={layoutId} onSelect={setLayoutId} />
        </div>
      </section>

      <section className="design-freeport__section">
        <p className="design-freeport__section-title">
          Live — {layout.label}
        </p>
        <p className="design-freeport__hint mt-1">
          {layout.modules.length} moduler · {layout.style}
        </p>
        <div className="design-freeport__hub-preview">
          <PlaneringHubBody layout={layout} />
        </div>
      </section>
    </div>
  );
}
