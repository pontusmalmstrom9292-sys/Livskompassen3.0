import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { ArbetslivFlexDelegate } from './delegates/ArbetslivFlexDelegate';
import { ArbetslivInkomstDelegate } from './delegates/ArbetslivInkomstDelegate';
import { ArbetslivStamplaDelegate } from './delegates/ArbetslivStamplaDelegate';
import { ArbetslivValvBroDelegate } from './delegates/ArbetslivValvBroDelegate';
import {
  ARBETSLIV_INPUT_MODES_PRIMARY,
  DEFAULT_ARBETSLIV_INPUT_MODE,
  parseArbetslivInputMode,
  type ArbetslivInputMode,
} from './arbetslivInputModes';

export type ArbetslivInputSuperModuleProps = {
  /** Override URL-parsing (t.ex. Storybook eller W3 embed). */
  initialMode?: ArbetslivInputMode;
};

function ArbetslivInputModeDelegate({ mode }: { mode: ArbetslivInputMode }) {
  switch (mode) {
    case 'stampla':
      return <ArbetslivStamplaDelegate />;
    case 'inkomster':
      return <ArbetslivInkomstDelegate />;
    case 'tid':
      return <ArbetslivFlexDelegate />;
    default:
      return <ArbetslivStamplaDelegate />;
  }
}

/**
 * Canonical router for Arbetsliv Universal Input Hub (Fas 10 / 14A).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function ArbetslivInputSuperModule({ initialMode }: ArbetslivInputSuperModuleProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeMode = useMemo(
    () => initialMode ?? parseArbetslivInputMode(searchParams.get('inputMode')),
    [initialMode, searchParams],
  );

  const setActiveMode = useCallback(
    (mode: ArbetslivInputMode) => {
      if (initialMode) return;

      const next = new URLSearchParams(searchParams);
      if (mode === DEFAULT_ARBETSLIV_INPUT_MODE) {
        next.delete('inputMode');
      } else {
        next.set('inputMode', mode);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, initialMode],
  );

  return (
    <HubErrorBoundary title="Arbetsliv kunde inte laddas" glow="blue" logTag="ArbetslivInputSuperModule">
    <section
      className="calm-card glow-bottom-blue overflow-hidden rounded-2xl border border-border/30 bg-surface-2/70 p-4 sm:p-5"
      aria-label="Arbetsliv inmatningshub"
    >
      <header className="mb-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent-secondary">
              Arbetsliv
            </p>
            <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
              Inkomst & tid
            </h2>
            <p className="text-xs text-text-dim">
              Stämpel, registrerade inkomster och veckoflex — ett läge i taget.
            </p>
          </div>
          <ModuleHelpFromRegistry moduleId="arbetsliv" mode={activeMode} />
        </div>
        <ArbetslivValvBroDelegate />
      </header>

      <nav
        className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1"
        aria-label="Inmatningslägen"
      >
        {ARBETSLIV_INPUT_MODES_PRIMARY.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              aria-pressed={isActive}
              className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                isActive
                  ? 'border border-accent-secondary/25 bg-accent-secondary/10 text-accent-secondary'
                  : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
              }`}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-dim">{mode.description}</span>
            </button>
          );
        })}
      </nav>

      <div className="calm-scroll-island max-h-[min(70vh,640px)] overflow-y-auto pr-1">
        <ArbetslivInputModeDelegate mode={activeMode} />
      </div>

      <footer className="mt-4 border-t border-border/30 pt-3">
        <Link
          to="/vardagen?tab=ekonomi"
          className="inline-flex items-center gap-1.5 text-xs text-text-dim transition-colors hover:text-accent"
        >
          Privatekonomi
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </footer>
    </section>
    </HubErrorBoundary>
  );
}
