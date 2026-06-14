import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { DagbokRememberCard } from '@/features/lifeJournal/diary/diary/components/DagbokRememberCard';
import { DagbokQuickMirrorDelegate } from './delegates/DagbokQuickMirrorDelegate';
import {
  DagbokArkivDelegate,
  DagbokReflektionDelegate,
} from './delegates/DagbokReflektionDelegate';
import {
  DAGBOK_INPUT_MODES_PRIMARY,
  DEFAULT_DAGBOK_INPUT_MODE,
  parseDagbokInputMode,
  type DagbokInputMode,
} from './dagbokInputModes';

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
      title="Superdagbok"
      icon={<BookOpen className="h-4 w-4" />}
      glow="blue"
      className="overflow-hidden !p-4 sm:!p-5"
    >
      <header className="mb-4 space-y-2">
        <div className="space-y-1">
          <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
            Universal Input
          </p>
          <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
            Ett läge i taget
          </h2>
          <p className="text-xs text-text-dim">
            Reflektera, snabb spegling eller minneslista — byt läge utan sidbyte.
          </p>
        </div>

        <Link
          to="/hjartat?tab=speglar"
          className="btn-pill--secondary inline-flex text-xs shadow-sm transition-transform hover:scale-105"
          title="Låt AI validera och spegla dina senaste tankar"
        >
          Känslospegeln
        </Link>
      </header>

      <nav
        className="mb-4 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1"
        aria-label="Dagboksinmatningslägen"
      >
        {DAGBOK_INPUT_MODES_PRIMARY.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              aria-pressed={isActive}
              className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                isActive
                  ? 'border border-indigo-500/40 bg-surface-3 text-accent-light'
                  : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
              }`}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-dim">{mode.description}</span>
            </button>
          );
        })}
      </nav>

      <DagbokRememberCard />

      <div className="calm-scroll-island mt-4 max-h-[min(70vh,640px)] overflow-y-auto pr-1">
        <DagbokInputModeDelegate mode={activeMode} onSaved={handleDelegateSaved} />
      </div>
    </BentoCard>
  );
}
