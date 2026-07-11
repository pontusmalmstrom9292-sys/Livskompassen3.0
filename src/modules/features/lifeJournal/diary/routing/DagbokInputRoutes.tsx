import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { ModuleShell } from '@/core/layout/ModuleShell';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { useMinWidthSm } from '@/core/hooks/useMinWidthSm';
import { HjartatBentoShell } from '@/features/lifeJournal/diary/components/HjartatBentoShell';
import { HjartatZoneIntro } from '@/features/lifeJournal/diary/components/HjartatZoneIntro';

const DagbokInputSuperModuleLazy = lazy(() =>
  import('../supermodule/DagbokInputSuperModule').then((m) => ({
    default: m.DagbokInputSuperModule,
  })),
);

function DagbokInputFallback() {
  return <HubPanelSkeleton label="Laddar dagbok…" lines={4} />;
}

/**
 * Shadow routing for Superdagbok Universal Input Hub (Fas 11C).
 * W5 mounts under `/hjartat/*` — e.g. `<Route path="/hjartat/*" element={<DagbokInputRoutes />} />`.
 *
 * Canonical entry: `/hjartat/input?inputMode=reflektion|quick_mirror|arkiv`
 */
export function DagbokInputRoutes() {
  const desktopHubLock = useMinWidthSm();

  return (
    <HubErrorBoundary
      title="Hjärtat kunde inte laddas"
      glow="gold"
      backTo={NAV_PATHS.HOME}
      backLabel="Till Hem"
      logTag="DagbokInputRoutes"
    >
      <ModuleShell
        eyebrow=""
        title="DAGBOK"
        lockViewport={desktopHubLock}
        fitViewport={desktopHubLock}
        depth={false}
        cognitiveStrip={false}
      >
        <HjartatBentoShell>
          <HjartatZoneIntro layerTab="reflektion" />
          <Routes>
            <Route
              path="input"
              element={
                <Suspense fallback={<DagbokInputFallback />}>
                  <DagbokInputSuperModuleLazy flowWithIsland={desktopHubLock} />
                </Suspense>
              }
            />
          </Routes>
        </HjartatBentoShell>
      </ModuleShell>
    </HubErrorBoundary>
  );
}
