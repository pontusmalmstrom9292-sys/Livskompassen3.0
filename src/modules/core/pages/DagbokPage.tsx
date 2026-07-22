/** @locked MOD-HJ-DAGBOK — låst modul; unlock via docs/evaluations/*-unlock-MOD-HJ-DAGBOK.md */
import { lazy, Suspense } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { ModuleShell } from '../layout/ModuleShell';
import { NAV_PATHS } from '../navigation/navTruth';
import { dagbokLegacyModeToInputMode } from '@/features/lifeJournal/diary/supermodule/dagbokInputModes';
import { SpeglarSuperModule } from '@/features/lifeJournal/diary/mirror';
import { HjartatBentoShell } from '@/features/lifeJournal/diary/components/HjartatBentoShell';
import { HjartatZoneIntro } from '@/features/lifeJournal/diary/components/HjartatZoneIntro';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';
import { Pencil } from 'lucide-react';

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
      <DagbokInputSuperModule flowWithIsland />
    </Suspense>
  );
}

/** Hjärtat — Dagbok och Speglar endast. Ingen Valv-logik. */
export function DagbokPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const layerTab = resolveLayerTab(searchParams.get('tab'));
  const isWriting = searchParams.get('write') === 'true';

  const toggleWrite = () => {
    const next = new URLSearchParams(searchParams);
    if (isWriting) {
      next.delete('write');
    } else {
      next.set('write', 'true');
    }
    setSearchParams(next, { replace: true });
  };

  const headerAside = layerTab === 'reflektion' ? (
    <button
      onClick={toggleWrite}
      className="inline-flex min-h-11 min-w-11 items-center justify-center p-1 text-accent transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      aria-label={isWriting ? "Stäng redigering" : "Skriv ny anteckning"}
    >
      <Pencil className="w-5 h-5" />
    </button>
  ) : undefined;

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
          eyebrow=""
          title="SPEGLAR"
          lockViewport
          fitViewport
          depth={false}
          cognitiveStrip={false}
        >
          <HjartatBentoShell>
            <HjartatZoneIntro layerTab="speglar" />
            <SpeglarSuperModule variant="dagbok" />
          </HjartatBentoShell>
        </ModuleShell>
      ) : (
        <ModuleShell
          eyebrow=""
          title="DAGBOK"
          headerAside={headerAside}
          lockViewport
          fitViewport
          depth={false}
          cognitiveStrip={false}
        >
          <HjartatBentoShell>
            <HjartatZoneIntro layerTab="reflektion" />
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
