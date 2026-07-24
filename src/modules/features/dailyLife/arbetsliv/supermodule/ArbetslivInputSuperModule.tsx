import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useMemo, lazy, Suspense } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import {
  ARBETSLIV_INPUT_MODES_PRIMARY,
  DEFAULT_ARBETSLIV_INPUT_MODE,
  parseArbetslivInputMode,
  type ArbetslivInputMode,
} from './arbetslivInputModes';

const ArbetslivProfilDelegate = lazy(() =>
  import('./delegates/ArbetslivProfilDelegate').then((m) => ({ default: m.ArbetslivProfilDelegate })),
);
const ArbetslivFlexDelegate = lazy(() =>
  import('./delegates/ArbetslivFlexDelegate').then((m) => ({ default: m.ArbetslivFlexDelegate })),
);
const ArbetslivInkomstDelegate = lazy(() =>
  import('./delegates/ArbetslivInkomstDelegate').then((m) => ({ default: m.ArbetslivInkomstDelegate })),
);
const ArbetslivStamplaDelegate = lazy(() =>
  import('./delegates/ArbetslivStamplaDelegate').then((m) => ({ default: m.ArbetslivStamplaDelegate })),
);
const ArbetslivValvBroDelegate = lazy(() =>
  import('./delegates/ArbetslivValvBroDelegate').then((m) => ({ default: m.ArbetslivValvBroDelegate })),
);

export type ArbetslivInputSuperModuleProps = {
  /** Override URL-parsing (t.ex. Storybook eller W3 embed). */
  initialMode?: ArbetslivInputMode;
};

function ArbetslivInputModeDelegate({ mode }: { mode: ArbetslivInputMode }) {
  let content;
  switch (mode) {
    case 'stampla':
      content = <ArbetslivStamplaDelegate />;
      break;
    case 'inkomster':
      content = <ArbetslivInkomstDelegate />;
      break;
    case 'lonest':
      content = <ArbetslivProfilDelegate />;
      break;
    case 'tid':
      content = <ArbetslivFlexDelegate />;
      break;
    default:
      content = <ArbetslivStamplaDelegate />;
  }
  return <Suspense fallback={<HubPanelSkeleton lines={4} />}>{content}</Suspense>;
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
      <div className="arbetsliv-shell mx-auto max-w-5xl pb-12">
        <section
          className="arbetsliv-shell__surface calm-card glow-bottom-blue overflow-hidden rounded-2xl p-4 sm:p-5"
          aria-label="Arbetsliv inmatningshub"
        >
          <header className="supermodule-hub-chrome mb-4 space-y-2 rounded-2xl px-3 py-3 sm:px-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="od-depth__eyebrow font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
                  Arbetsliv
                </p>
                <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
                  Inkomst & tid
                </h2>
                <p className="text-xs text-text-muted">
                  Stämpel, registrerade inkomster och veckoflex — ett läge i taget.
                </p>
              </div>
              <ModuleHelpFromRegistry moduleId="arbetsliv" mode={activeMode} />
            </div>
            <Suspense fallback={<HubPanelSkeleton label="Laddar arbetsliv…" lines={3} />}>
              <ArbetslivValvBroDelegate />
            </Suspense>
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
                  className={`min-h-11 rounded-lg px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/50 ${
                    isActive
                      ? 'border border-accent-secondary/25 bg-accent-secondary/10 text-accent-secondary'
                      : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
                  }`}
                >
                  <span className="block font-medium">{mode.label}</span>
                  <span className="block text-[10px] text-text-muted">{mode.description}</span>
                </button>
              );
            })}
          </nav>

          <div className="arbetsliv-shell__delegate pr-1">
            <ArbetslivInputModeDelegate mode={activeMode} />
          </div>

          <footer className="mt-4 border-t border-border/30 pt-3">
            <Link
              to="/vardagen?tab=ekonomi"
              className="inline-flex min-h-11 items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Privatekonomi
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </footer>
        </section>
      </div>
    </HubErrorBoundary>
  );
}
