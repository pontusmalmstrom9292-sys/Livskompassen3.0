import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shield, Wallet } from 'lucide-react';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { ArbetslivLoggDelegate } from './delegates/ArbetslivLoggDelegate';
import { ArbetslivStamplaDelegate } from './delegates/ArbetslivStamplaDelegate';
import { ArbetslivTidDelegate } from './delegates/ArbetslivTidDelegate';
import {
  ARBETSLIV_INPUT_MODES_PRIMARY,
  DEFAULT_ARBETSLIV_INPUT_MODE,
  parseArbetslivInputMode,
  type ArbetslivInputMode,
} from './arbetslivInputModes';

export type ArbetslivInputSuperModuleProps = {
  /** Override URL-parsing (t.ex. Storybook eller W3 embed). */
  initialMode?: ArbetslivInputMode;
  /** Callback efter ledger-ändring i logg-läge. */
  onLoggChanged?: () => void;
};

function ArbetslivInputModeDelegate({
  mode,
  onLoggChanged,
}: {
  mode: ArbetslivInputMode;
  onLoggChanged?: () => void;
}) {
  switch (mode) {
    case 'stampla':
      return <ArbetslivStamplaDelegate />;
    case 'tid':
      return <ArbetslivTidDelegate />;
    case 'logg':
      return <ArbetslivLoggDelegate onChanged={onLoggChanged} />;
    default:
      return <ArbetslivStamplaDelegate />;
  }
}

/**
 * Canonical router for Arbetsliv Universal Input Hub (Fas 10A→10C).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function ArbetslivInputSuperModule({
  initialMode,
  onLoggChanged,
}: ArbetslivInputSuperModuleProps) {
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
    <section
      className="calm-card glow-bottom-gold overflow-hidden rounded-2xl border border-border/30 bg-surface-2/70 p-4 sm:p-5"
      aria-label="Arbetsliv inmatningshub"
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
            Stämpel, flex och logg utan sidbyte. Frånvaro och lönespec finns under Valv i menyn.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={vaultDrawerPath('arbetsliv_franvaro')}
            className="btn-pill--ghost inline-flex items-center gap-2 text-xs"
          >
            <Shield className="h-3.5 w-3.5 text-accent/80" aria-hidden />
            Frånvaro i Valv
          </Link>
          <Link
            to={vaultDrawerPath('arbetsliv_lon')}
            className="btn-pill--ghost inline-flex items-center gap-2 text-xs"
          >
            <Wallet className="h-3.5 w-3.5 text-accent/80" aria-hidden />
            Lön i Valv
          </Link>
        </div>
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
                  ? 'border border-accent/20 bg-accent/10 text-accent'
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
        <ArbetslivInputModeDelegate mode={activeMode} onLoggChanged={onLoggChanged} />
      </div>
    </section>
  );
}
