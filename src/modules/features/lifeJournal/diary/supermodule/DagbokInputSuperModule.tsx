/** @locked MOD-HJ-INPUT — låst modul; unlock via docs/evaluations/*-unlock-MOD-HJ-INPUT.md */
import { lazy, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { ButtonLink } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { ChameleonInputShell } from '@/core/ui/ChameleonInputShell';
import { useCapacityScore } from '@/core/store/useCapacityGate';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { isLowHomeCapacity } from '@/core/home/homeCapacityGate';
import { DagbokRememberCard } from '@/features/lifeJournal/diary/diary/components/DagbokRememberCard';
const DagbokQuickMirrorDelegate = lazy(() =>
  import('./delegates/DagbokQuickMirrorDelegate').then((m) => ({ default: m.DagbokQuickMirrorDelegate })),
);
const DagbokReflektionDelegate = lazy(() =>
  import('./delegates/DagbokReflektionDelegate').then((m) => ({ default: m.DagbokReflektionDelegate })),
);
const DagbokArkivDelegate = lazy(() =>
  import('./delegates/DagbokReflektionDelegate').then((m) => ({ default: m.DagbokArkivDelegate })),
);
const DagbokBurnDelegate = lazy(() =>
  import('./delegates/DagbokBurnDelegate').then((m) => ({ default: m.DagbokBurnDelegate })),
);
const DagbokTystDelegate = lazy(() =>
  import('./delegates/DagbokTystDelegate').then((m) => ({ default: m.DagbokTystDelegate })),
);
import {
  DEFAULT_DAGBOK_INPUT_MODE,
  getDagbokInputModeMeta,
  parseDagbokCapacityParam,
  parseDagbokInputMode,
  type DagbokInputMode,
} from './dagbokInputModes';
import { DagbokInputModePicker } from './DagbokInputModePicker';

const LOW_CAPACITY_MODES: DagbokInputMode[] = ['reflektion', 'quick_mirror', 'burn', 'tyst'];

export type DagbokInputSuperModuleProps = {
  /** Override URL-parsing (t.ex. Storybook). */
  initialMode?: DagbokInputMode;
  /** Callback efter lyckat spar i aktivt läge. */
  onSaved?: (mode: DagbokInputMode) => void;
  /** Desktop hub-lock: yttre calm-scroll-island scrollar — ingen nested max-h. */
  flowWithIsland?: boolean;
};

type DelegateProps = {
  mode: DagbokInputMode;
  onSaved?: () => void;
  onSwitchMode?: (mode: DagbokInputMode) => void;
};

function DagbokInputModeDelegate({ mode, onSaved, onSwitchMode }: DelegateProps) {
  let content;
  switch (mode) {
    case 'reflektion':
      content = <DagbokReflektionDelegate onSaved={onSaved} />;
      break;
    case 'quick_mirror':
      content = <DagbokQuickMirrorDelegate onSaved={onSaved} />;
      break;
    case 'arkiv':
      content = <DagbokArkivDelegate />;
      break;
    case 'burn':
      content = <DagbokBurnDelegate />;
      break;
    case 'tyst':
      content = (
        <DagbokTystDelegate
          onSaved={onSaved}
          onSwitchToBurn={() => onSwitchMode?.('burn')}
        />
      );
      break;
    default:
      content = null;
  }
  return <Suspense fallback={<HubPanelSkeleton lines={4} />}>{content}</Suspense>;
}

/**
 * Canonical router for Superdagbok Universal Input Hub (Fas 11A→11C).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function DagbokInputSuperModule({
  initialMode,
  onSaved,
  flowWithIsland = true,
}: DagbokInputSuperModuleProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const capacityScore = useCapacityScore();
  const lowCapacity = isLowHomeCapacity(evolutionDoc, capacityScore);

  const activeMode = useMemo(() => {
    if (initialMode) return initialMode;
    const capacityForced = parseDagbokCapacityParam(
      searchParams.get('capacity'),
      searchParams.get('tyst'),
    );
    if (capacityForced) return capacityForced;
    const inputModeParam = searchParams.get('inputMode');
    if (lowCapacity && !inputModeParam) return 'tyst';
    return parseDagbokInputMode(inputModeParam);
  }, [initialMode, searchParams, lowCapacity]);

  const visibleMode = useMemo(() => {
    if (!lowCapacity) return activeMode;
    if (LOW_CAPACITY_MODES.includes(activeMode)) return activeMode;
    return DEFAULT_DAGBOK_INPUT_MODE;
  }, [activeMode, lowCapacity]);

  const activeMeta = useMemo(() => getDagbokInputModeMeta(visibleMode), [visibleMode]);

  const setActiveMode = useCallback(
    (mode: DagbokInputMode) => {
      if (initialMode) return;

      const next = new URLSearchParams(searchParams);
      if (mode === DEFAULT_DAGBOK_INPUT_MODE) {
        next.delete('inputMode');
      } else {
        next.set('inputMode', mode);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, initialMode],
  );

  const handleDelegateSaved = useCallback(() => {
    onSaved?.(visibleMode);
  }, [visibleMode, onSaved]);

  const isTystMode = visibleMode === 'tyst';

  return (
    <HubErrorBoundary
      title="Dagbok kunde inte laddas"
      glow="gold"
      backTo="/hjartat"
      backLabel="Till Hjärtat"
      logTag="DagbokInputSuperModule"
    >
    <BentoCard
      glow="gold"
      depth
      noHover
      bare
      className={clsx(
        'hjartat-tab-panel dagbok-input-hub overflow-hidden !p-4 sm:!p-5',
        flowWithIsland && 'dagbok-input-hub--flow',
        isTystMode && 'dagbok-hub--tyst',
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="valv-forensic-header min-w-0 flex-1">
          <p className="valv-forensic-eyebrow">Hjärtat</p>
          <h2 className="valv-forensic-title">{activeMeta.label}</h2>
          {!isTystMode ? (
            <p className="valv-forensic-lead">{activeMeta.description}</p>
          ) : null}
        </div>
        {!isTystMode ? <DagbokRememberCard mode={activeMode} /> : null}
      </div>

      {!isTystMode ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <DagbokInputModePicker
            activeMode={visibleMode}
            onChange={setActiveMode}
            hiddenModes={lowCapacity ? ['arkiv'] : undefined}
          />
          <ButtonLink
            to="/hjartat?tab=speglar"
            variant="secondary"
            size="sm"
            className="shadow-sm transition-transform hover:scale-105"
            title="Låt AI validera och spegla dina senaste tankar"
          >
            Känslospegeln
          </ButtonLink>
        </div>
      ) : (
        <div className="mb-3">
          <DagbokInputModePicker
            activeMode={visibleMode}
            onChange={setActiveMode}
            hiddenModes={['reflektion', 'quick_mirror', 'arkiv', 'burn']}
          />
        </div>
      )}

      <ChameleonInputShell
        mode={visibleMode}
        viewportClassName={
          flowWithIsland
            ? 'pr-1'
            : 'max-h-[min(calc(100dvh-var(--app-dock-clearance,8.5rem)-12rem),720px)] overflow-y-auto pr-1'
        }
      >
        {(mode) => (
          <DagbokInputModeDelegate
            mode={mode}
            onSaved={handleDelegateSaved}
            onSwitchMode={setActiveMode}
          />
        )}
      </ChameleonInputShell>
    </BentoCard>
    </HubErrorBoundary>
  );
}
