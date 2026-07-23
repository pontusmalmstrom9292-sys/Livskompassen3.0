/** @locked MOD-VARD-EKO — låst modul; unlock via docs/evaluations/*-unlock-MOD-VARD-EKO.md */
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { useCallback, useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EconomyCapacityLockedNotice } from '@/features/economy/components/EconomyCapacityLockedNotice';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import {
  getAllowedModesForLevel,
  pickFallbackMode,
} from './capacityResolver';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';

const EkonomiSaldoDelegate = lazy(() =>
  import('./delegates/EkonomiSaldoDelegate').then((m) => ({ default: m.EkonomiSaldoDelegate })),
);
const EkonomiMikrostegDelegate = lazy(() =>
  import('./delegates/EkonomiMikrostegDelegate').then((m) => ({ default: m.EkonomiMikrostegDelegate })),
);
const EkonomiProfilDelegate = lazy(() =>
  import('./delegates/EkonomiProfilDelegate').then((m) => ({ default: m.EkonomiProfilDelegate })),
);
const EkonomiMatprepDelegate = lazy(() =>
  import('./delegates/EkonomiMatprepDelegate').then((m) => ({ default: m.EkonomiMatprepDelegate })),
);
const EkonomiKuvertDelegate = lazy(() =>
  import('./delegates/EkonomiKuvertDelegate').then((m) => ({ default: m.EkonomiKuvertDelegate })),
);
const EkonomiSparDelegate = lazy(() =>
  import('./delegates/EkonomiSparDelegate').then((m) => ({ default: m.EkonomiSparDelegate })),
);
const EkonomiImpulsDelegate = lazy(() =>
  import('./delegates/EkonomiImpulsDelegate').then((m) => ({ default: m.EkonomiImpulsDelegate })),
);
const EkonomiInkastDelegate = lazy(() =>
  import('./delegates/EkonomiInkastDelegate').then((m) => ({ default: m.EkonomiInkastDelegate })),
);
const EkonomiLoggDelegate = lazy(() =>
  import('./delegates/EkonomiLoggDelegate').then((m) => ({ default: m.EkonomiLoggDelegate })),
);

import {
  DEFAULT_EKONOMI_INPUT_MODE,
  filterModesByAllowed,
  getEkonomiInputModeMeta,
  parseEkonomiInputMode,
  type EkonomiInputMode,
} from './ekonomiInputModes';

export type EkonomiInputSuperModuleProps = {
  userId: string;
};

function EkonomiModePlaceholder({ mode }: { mode: EkonomiInputMode }) {
  const meta = getEkonomiInputModeMeta(mode);
  return (
    <div className="rounded-xl border border-border/50 bg-surface-3/30 p-6 text-center">
      <p className="font-display-serif text-sm uppercase tracking-[0.2em] text-accent">{meta.label}</p>
      <p className="mt-2 text-xs text-text-muted">{meta.description}</p>
      <p className="mt-4 text-[10px] uppercase tracking-wider text-text-muted">
        Delegate kommer i Fas 8B–8D
      </p>
    </div>
  );
}

function EkonomiInputModeDelegate({
  mode,
  userId,
}: {
  mode: EkonomiInputMode;
  userId: string;
}) {
  let content;
  switch (mode) {
    case 'saldo':
      content = <EkonomiSaldoDelegate userId={userId} />;
      break;
    case 'mikrosteg':
      content = <EkonomiMikrostegDelegate userId={userId} />;
      break;
    case 'profil':
      content = <EkonomiProfilDelegate userId={userId} />;
      break;
    case 'matprep':
      content = <EkonomiMatprepDelegate userId={userId} />;
      break;
    case 'kuvert':
      content = <EkonomiKuvertDelegate userId={userId} />;
      break;
    case 'spar':
      content = <EkonomiSparDelegate userId={userId} />;
      break;
    case 'impuls':
      content = <EkonomiImpulsDelegate userId={userId} />;
      break;
    case 'inkast':
      content = <EkonomiInkastDelegate userId={userId} />;
      break;
    case 'logg':
      content = <EkonomiLoggDelegate />;
      break;
    default:
      content = <EkonomiModePlaceholder mode={mode} />;
  }
  return <Suspense fallback={<HubPanelSkeleton lines={4} />}>{content}</Suspense>;
}

/**
 * Canonical router for Ekonomi Universal Input Hub (Fas 8A→8E).
 * Thin delegate — kapacitetsnivå via useEconomyLevel, inga inline Firestore-lyssnare.
 */
export function EkonomiInputSuperModule({ userId }: EkonomiInputSuperModuleProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMoreModes, setShowMoreModes] = useState(false);

  const { level, circuitBreakerActive, isLoading } = useEconomyLevel(userId);

  const allowedModes = useMemo(() => getAllowedModesForLevel(level), [level]);

  const { primary: visiblePrimary, more: visibleMore } = useMemo(
    () => filterModesByAllowed(allowedModes),
    [allowedModes],
  );

  const rawMode = searchParams.get('inputMode');
  const parsedMode = parseEkonomiInputMode(rawMode);
  const activeMode = allowedModes.includes(parsedMode)
    ? parsedMode
    : pickFallbackMode(allowedModes);

  const setActiveMode = useCallback(
    (mode: EkonomiInputMode) => {
      const next = new URLSearchParams(searchParams);
      if (mode === DEFAULT_EKONOMI_INPUT_MODE) {
        next.delete('inputMode');
      } else {
        next.set('inputMode', mode);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (isLoading) return;
    if (!allowedModes.includes(parsedMode)) {
      setActiveMode(activeMode);
    }
  }, [isLoading, allowedModes, parsedMode, activeMode, setActiveMode]);

  const isMoreModeActive = visibleMore.some((mode) => mode.id === activeMode);

  return (
    <HubErrorBoundary title="Ekonomi kunde inte laddas" glow="gold" logTag="EkonomiInputSuperModule">
    <section
      className="calm-card glow-bottom-gold overflow-hidden rounded-2xl p-4 sm:p-5"
      aria-label="Ekonomi inmatningshub"
    >
      <header className="supermodule-hub-chrome mb-4 flex items-start justify-between gap-3 rounded-2xl px-3 py-3 sm:px-4">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="od-depth__eyebrow font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
            Universal Input
          </p>
          <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
            Ett läge i taget
          </h2>
          <p className="text-xs text-text-muted">
            Vardagsekonomi utan sidbyte — kapacitetsstyrd progressive disclosure.
          </p>
          {circuitBreakerActive ? (
            <p className="text-xs text-text-muted">Kognitiv paus — endast saldo just nu.</p>
          ) : null}
        </div>
        <ModuleHelpFromRegistry moduleId="ekonomi" mode={activeMode} />
      </header>

      {!circuitBreakerActive && level === 1 ? (
        <div className="mb-4">
          <EconomyCapacityLockedNotice compact />
        </div>
      ) : null}

      <nav
        className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1"
        aria-label="Inmatningslägen"
      >
        {visiblePrimary.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              aria-pressed={isActive}
              className={`min-h-11 rounded-lg px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                isActive
                  ? 'border border-accent/20 bg-accent/10 text-accent'
                  : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
              }`}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-muted">{mode.description}</span>
            </button>
          );
        })}

        {visibleMore.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowMoreModes((open) => !open)}
            aria-expanded={showMoreModes || isMoreModeActive}
            className={`min-h-11 rounded-lg px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
              isMoreModeActive
                ? 'border border-accent/20 bg-accent/10 text-accent'
                : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
            }`}
          >
            <span className="block font-medium">Mer…</span>
            <span className="block text-[10px] text-text-muted">Kuvert, spar, logg, inkast</span>
          </button>
        ) : null}

        {(showMoreModes || isMoreModeActive) &&
          visibleMore.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                aria-pressed={isActive}
                className={`min-h-11 rounded-lg px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                  isActive
                    ? 'border border-accent/20 bg-accent/10 text-accent'
                    : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
                }`}
              >
                <span className="block font-medium">{mode.label}</span>
                <span className="block text-[10px] text-text-muted">{mode.description}</span>
              </button>
            );
          })}
      </nav>

      <div className="calm-scroll-island superhub-scroll-island pr-1">
        {isLoading ? (
          <HubPanelSkeleton label="Laddar ekonomiläge…" lines={4} />
        ) : (
          <EkonomiInputModeDelegate mode={activeMode} userId={userId} />
        )}
      </div>

      <footer className="mt-4 border-t border-border/30 pt-3">
        <Link
          to="/arbetsliv/input"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent-secondary"
        >
          Arbetsliv — stämpel & inkomster
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </footer>
    </section>
    </HubErrorBoundary>
  );
}
