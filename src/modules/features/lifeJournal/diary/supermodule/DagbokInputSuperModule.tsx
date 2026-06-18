import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { DagbokRememberCard } from '@/features/lifeJournal/diary/diary/components/DagbokRememberCard';
import { DagbokQuickMirrorDelegate } from './delegates/DagbokQuickMirrorDelegate';
import {
  DagbokArkivDelegate,
  DagbokReflektionDelegate,
} from './delegates/DagbokReflektionDelegate';
import {
  DEFAULT_DAGBOK_INPUT_MODE,
  getDagbokInputModeMeta,
  parseDagbokInputMode,
  type DagbokInputMode,
} from './dagbokInputModes';
import { DagbokInputModePicker } from './DagbokInputModePicker';

export type DagbokInputSuperModuleProps = {
  /** Override URL-parsing (t.ex. Storybook). */
  initialMode?: DagbokInputMode;
  /** Callback efter lyckat spar i aktivt läge. */
  onSaved?: (mode: DagbokInputMode) => void;
};

type DelegateProps = {
  mode: DagbokInputMode;
  onSaved?: () => void;
};

function DagbokInputModeDelegate({ mode, onSaved }: DelegateProps) {
  switch (mode) {
    case 'reflektion':
      return <DagbokReflektionDelegate onSaved={onSaved} />;
    case 'quick_mirror':
      return <DagbokQuickMirrorDelegate onSaved={onSaved} />;
    case 'arkiv':
      return <DagbokArkivDelegate />;
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

  const activeMode = useMemo(
    () => initialMode ?? parseDagbokInputMode(searchParams.get('inputMode')),
    [initialMode, searchParams],
  );

  const activeMeta = useMemo(() => getDagbokInputModeMeta(activeMode), [activeMode]);

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
    onSaved?.(activeMode);
  }, [activeMode, onSaved]);

  return (
    <BentoCard
      glow="gold"
      depth
      noHover
      bare
      className="hjartat-tab-panel overflow-hidden !p-4 sm:!p-5"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="valv-forensic-header min-w-0 flex-1">
          <p className="valv-forensic-eyebrow">Hjärtat</p>
          <h2 className="valv-forensic-title">{activeMeta.label}</h2>
          <p className="valv-forensic-lead">{activeMeta.description}</p>
        </div>
        <DagbokRememberCard />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DagbokInputModePicker activeMode={activeMode} onChange={setActiveMode} />
        <Link
          to="/hjartat?tab=speglar"
          className="btn-pill--secondary text-xs shadow-sm transition-transform hover:scale-105"
          title="Låt AI validera och spegla dina senaste tankar"
        >
          Känslospegeln
        </Link>
      </div>

      <div className="calm-scroll-island max-h-[min(75vh,720px)] overflow-y-auto pr-1">
        <DagbokInputModeDelegate mode={activeMode} onSaved={handleDelegateSaved} />
      </div>
    </BentoCard>
  );
}
