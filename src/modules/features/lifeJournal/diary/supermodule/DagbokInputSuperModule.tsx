import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { ChameleonInputShell } from '@/core/ui/ChameleonInputShell';
import { useCapacityScore } from '@/core/store/useCapacityGate';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { isLowHomeCapacity } from '@/core/home/homeCapacityGate';
import { DagbokRememberCard } from '@/features/lifeJournal/diary/diary/components/DagbokRememberCard';
import { DagbokQuickMirrorDelegate } from './delegates/DagbokQuickMirrorDelegate';
import {
  DagbokArkivDelegate,
  DagbokReflektionDelegate,
} from './delegates/DagbokReflektionDelegate';
import { DagbokBurnDelegate } from './delegates/DagbokBurnDelegate';
import { DagbokTystDelegate } from './delegates/DagbokTystDelegate';
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
};

type DelegateProps = {
  mode: DagbokInputMode;
  onSaved?: () => void;
  onSwitchMode?: (mode: DagbokInputMode) => void;
};

function DagbokInputModeDelegate({ mode, onSaved, onSwitchMode }: DelegateProps) {
  switch (mode) {
    case 'reflektion':
      return <DagbokReflektionDelegate onSaved={onSaved} />;
    case 'quick_mirror':
      return <DagbokQuickMirrorDelegate onSaved={onSaved} />;
    case 'arkiv':
      return <DagbokArkivDelegate />;
    case 'burn':
      return <DagbokBurnDelegate />;
    case 'tyst':
      return (
        <DagbokTystDelegate
          onSaved={onSaved}
          onSwitchToBurn={() => onSwitchMode?.('burn')}
        />
      );
    default:
      return null;
  }
}

/**
 * Canonical router for Superdagbok Universal Input Hub (Fas 11A→11C).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function DagbokInputSuperModule({
  initialMode,
  onSaved,
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
    <BentoCard
      glow="gold"
      depth
      noHover
      bare
      className={`hjartat-tab-panel overflow-hidden !p-4 sm:!p-5${isTystMode ? ' dagbok-hub--tyst' : ''}`}
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
          <Link
            to="/hjartat?tab=speglar"
            className="ds-btn ds-btn--secondary text-xs shadow-sm transition-transform hover:scale-105"
            title="Låt AI validera och spegla dina senaste tankar"
          >
            Känslospegeln
          </Link>
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
        viewportClassName="max-h-[min(75vh,720px)] overflow-y-auto pr-1"
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
  );
}
