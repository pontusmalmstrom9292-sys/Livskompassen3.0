import { Suspense } from 'react';
import { DossierPage } from '../../dossier';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

/** Exportera — Dossier embedded i Valv. */
export function ValvExporteraZone() {
  return (
    <HubErrorBoundary title="Dossier kunde inte laddas" glow="blue" logTag="ValvExporteraZone">
      <div className="valv-zone-stack">
        <Suspense fallback={<HubPanelSkeleton label="Laddar dossier…" lines={5} />}>
          <DossierPage embedded />
        </Suspense>
      </div>
    </HubErrorBoundary>
  );
}
