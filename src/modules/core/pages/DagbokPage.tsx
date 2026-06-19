import { lazy, Suspense } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { ModuleShell } from '../layout/ModuleShell';
import { NAV_PATHS } from '../navigation/navTruth';
import { dagbokLegacyModeToInputMode } from '@/features/lifeJournal/diary/supermodule/dagbokInputModes';
import { SpeglarSuperModule } from '@/features/lifeJournal/diary/mirror';
import { HjartatBentoShell } from '@/features/lifeJournal/diary/components/HjartatBentoShell';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';

const DagbokInputSuperModule = lazy(() =>
  import('@/features/lifeJournal/diary/supermodule/DagbokInputSuperModule').then((m) => ({
    default: m.DagbokInputSuperModule,
  })),
);

type HjartatLayerTab = 'reflektion' | 'speglar';

function resolveLayerTab(raw: string | null): HjartatLayerTab {
  return raw === 'speglar' ? 'speglar' : 'reflektion';
}

function DagbokInputFallback() {
  return <HubPanelSkeleton label="Laddar dagbok…" lines={4} />;
}

/** Reflektion-flik — legacy `?mode=` → `?inputMode=` + embedded superhub. */
function HjartatReflektionPanel() {
  const [searchParams] = useSearchParams();
  const legacyMode = searchParams.get('mode');
  const hasInputMode = searchParams.has('inputMode');

  if (legacyMode && !hasInputMode) {
    const next = new URLSearchParams(searchParams);
    next.delete('mode');
    const mapped = dagbokLegacyModeToInputMode(legacyMode);
    if (mapped !== 'reflektion') {
      next.set('inputMode', mapped);
    }
    const search = next.toString();
    return (
      <Navigate
        to={{ pathname: NAV_PATHS.HJARTAT, search: search ? `?${search}` : '' }}
        replace
      />
    );
  }

  return (
    <Suspense fallback={<DagbokInputFallback />}>
      <DagbokInputSuperModule />
    </Suspense>
  );
}

/** Hjärtat — Dagbok och Speglar endast. Ingen Valv-logik. */
export function DagbokPage() {
  const [searchParams] = useSearchParams();
  const layerTab = resolveLayerTab(searchParams.get('tab'));

  return (
    <HubErrorBoundary
      title="Hjärtat kunde inte laddas"
      glow="gold"
      backTo={NAV_PATHS.HOME}
      backLabel="Till Hem"
      logTag="HjartatPage"
    >
      {layerTab === 'speglar' ? (
        <ModuleShell
          eyebrow="Hjärtat"
          title="Speglar"
          lead="Validering utan fix — känsla och fakta hålls isär."
          lockViewport
          fitViewport
          depth
          cognitiveStrip={false}
        >
          <HjartatBentoShell>
            <SpeglarSuperModule variant="dagbok" />
          </HjartatBentoShell>
        </ModuleShell>
      ) : (
        <ModuleShell
          eyebrow="Hjärtat"
          title="Dagbok"
          lead="Reflektion och daglig logg — utanför Valvet."
          lockViewport
          fitViewport
          depth
          cognitiveStrip={false}
        >
          <HjartatBentoShell>
            <HjartatReflektionPanel />
            <PinnedPlaneringModuleSlot targetId="hjartat.dagbok" className="mt-4" />
          </HjartatBentoShell>
        </ModuleShell>
      )}
    </HubErrorBoundary>
  );
}

/** Alias för AppRoutes — samma komponent, inget Valv. */
export { DagbokPage as HjartatPage };
