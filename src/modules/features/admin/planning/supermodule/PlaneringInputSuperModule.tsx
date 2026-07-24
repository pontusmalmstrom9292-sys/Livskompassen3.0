import { textStyles } from '@/design-system';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useMemo, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import {
  DEFAULT_PLANERING_INPUT_MODE,
  PLANERING_INPUT_MODES_PRIMARY,
  parsePlaneringInputMode,
  type PlaneringInputMode,
} from './planeringInputModes';

const PlaneringTaskQuickDelegate = lazy(() =>
  import('./delegates/PlaneringTaskQuickDelegate').then((m) => ({ default: m.PlaneringTaskQuickDelegate })),
);
const PlaneringInkastDelegate = lazy(() =>
  import('./delegates/PlaneringInkastDelegate').then((m) => ({ default: m.PlaneringInkastDelegate })),
);
const PlaneringQuickListDelegate = lazy(() =>
  import('./delegates/PlaneringQuickListDelegate').then((m) => ({ default: m.PlaneringQuickListDelegate })),
);

export type PlaneringInputSuperModuleProps = {
  /** Override URL-parsing (t.ex. Storybook). */
  initialMode?: PlaneringInputMode;
  /** Callback efter lyckat spar i aktivt läge. */
  onSaved?: (mode: PlaneringInputMode) => void;
};

/**
 * Canonical router for Planering Universal Input Hub (Fas 9).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function PlaneringInputSuperModule({
  initialMode,
  onSaved,
}: PlaneringInputSuperModuleProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeMode = useMemo(
    () => initialMode ?? parsePlaneringInputMode(searchParams.get('inputMode')),
    [initialMode, searchParams],
  );

  const setActiveMode = useCallback(
    (mode: PlaneringInputMode) => {
      if (initialMode) return;

      const next = new URLSearchParams(searchParams);
      if (mode === DEFAULT_PLANERING_INPUT_MODE) {
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
    <BentoCard glow="gold" className="overflow-hidden !p-4 sm:!p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className={textStyles.eyebrow}>
            Planering — Input
          </p>
          <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
            Ett läge i taget
          </h2>
          <p className="text-xs text-text-muted">
            Snabb uppgift, smart inkast eller inköpslista — byt läge utan sidbyte.
          </p>
        </div>
        <ModuleHelpFromRegistry moduleId="planering" mode={activeMode} />
      </header>

      <nav
        className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1"
        aria-label="Planeringsinmatningslägen"
      >
        {PLANERING_INPUT_MODES_PRIMARY.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              aria-pressed={isActive}
              className={`min-h-[44px] rounded-lg px-3 py-2 text-left text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 ${
                isActive
                  ? 'border border-accent/40 bg-surface-3 text-accent'
                  : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
              }`}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-muted">{mode.description}</span>
            </button>
          );
        })}
      </nav>

      <div className="planering-input-shell__delegate pr-1">
        <PlaneringInputModeDelegate mode={activeMode} onSaved={handleDelegateSaved} />
      </div>
    </BentoCard>
  );
}

type DelegateProps = {
  mode: PlaneringInputMode;
  onSaved?: () => void;
};

function PlaneringInputModeDelegate({ mode, onSaved }: DelegateProps) {
  let content;
  switch (mode) {
    case 'task_quick':
      content = <PlaneringTaskQuickDelegate onSaved={onSaved} />;
      break;
    case 'inkast':
      content = <PlaneringInkastDelegate onSaved={onSaved} />;
      break;
    case 'quick_list':
      content = <PlaneringQuickListDelegate />;
      break;
    default:
      content = null;
  }
  return <Suspense fallback={<HubPanelSkeleton lines={4} />}>{content}</Suspense>;
}
