import { lazy, Suspense } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { HubPageShell } from '../layout/HubPageShell';
import { NAV_PATHS } from '../navigation/navTruth';
import { dagbokLegacyModeToInputMode } from '@/features/lifeJournal/diary/supermodule/dagbokInputModes';
import { SpeglarSuperModule } from '@/features/lifeJournal/diary/mirror';

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
  return <p className="text-sm text-text-dim">Laddar dagbok…</p>;
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

  if (layerTab === 'speglar') {
    return (
      <HubPageShell
        eyebrow="Hjärtat"
        title="Speglar"
        lead="Validering utan fix — känsla och fakta hålls isär."
      >
        <div className="mx-auto max-w-5xl space-y-4 pb-12">
          <SpeglarSuperModule variant="dagbok" />
        </div>
      </HubPageShell>
    );
  }

  return (
    <HubPageShell
      eyebrow="Hjärtat"
      title="Dagbok"
      lead="Reflektion och daglig logg — utanför Valvet."
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <HjartatReflektionPanel />
      </div>
    </HubPageShell>
  );
}

/** Alias för AppRoutes — samma komponent, inget Valv. */
export { DagbokPage as HjartatPage };
