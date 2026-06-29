import { DossierPage } from '../../dossier';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';

/** Exportera — Dossier embedded i Valv. */
export function ValvExporteraZone() {
  return (
    <HubErrorBoundary title="Dossier kunde inte laddas" glow="blue" logTag="ValvExporteraZone">
      <div className="valv-zone-stack">
        <DossierPage embedded />
      </div>
    </HubErrorBoundary>
  );
}
