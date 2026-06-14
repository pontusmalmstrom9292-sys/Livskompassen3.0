import { useCallback, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  DEFAULT_FAMILJEN_INPUT_MODE,
  FAMILJEN_INPUT_MODES_MORE,
  FAMILJEN_INPUT_MODES_PRIMARY,
  parseFamiljenInputMode,
  type FamiljenInputMode,
} from './familjenInputModes';
import type { FamiljenShell } from '../hooks/useFamiljenShell';
import { FamiljenBarnfokusDelegate } from './delegates/FamiljenBarnfokusDelegate';
import { FamiljenLivsloggStundDelegate } from './delegates/FamiljenLivsloggStundDelegate';
import { FamiljenFysiologiDelegate } from './delegates/FamiljenFysiologiDelegate';
import { FamiljenLivsloggObservationDelegate } from './delegates/FamiljenLivsloggObservationDelegate';
import { FamiljenVardagsstrukturDelegate } from './delegates/FamiljenVardagsstrukturDelegate';
import { FamiljenInkastDelegate } from './delegates/FamiljenInkastDelegate';

export type FamiljenInputSuperModuleProps = {
  /** Obligatorisk — all state och writes från parent (FamiljenPage). */
  shell: FamiljenShell;
  /** Override URL-parsing (t.ex. Storybook). */
  initialMode?: FamiljenInputMode;
  /** Callback efter lyckat spar (valfritt — t.ex. scroll till minneslista). */
  onSaved?: (mode: FamiljenInputMode, logId?: string) => void;
};

/**
 * Canonical router for Familjen Universal Input Hub (Fas 7).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function FamiljenInputSuperModule({
  shell,
  initialMode,
  onSaved,
}: FamiljenInputSuperModuleProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMoreModes, setShowMoreModes] = useState(false);

  const activeMode = useMemo(
    () => initialMode ?? parseFamiljenInputMode(searchParams.get('inputMode')),
    [initialMode, searchParams],
  );

  const setActiveMode = useCallback(
    (mode: FamiljenInputMode) => {
      if (initialMode) return; // Prevent URL changes if driven by props

      const next = new URLSearchParams(searchParams);
      if (mode === DEFAULT_FAMILJEN_INPUT_MODE) {
        next.delete('inputMode');
      } else {
        next.set('inputMode', mode);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, initialMode],
  );

  const handleDelegateSaved = useCallback(
    (logId?: string) => {
      onSaved?.(activeMode, logId);
    },
    [activeMode, onSaved],
  );

  const isMoreModeActive = FAMILJEN_INPUT_MODES_MORE.some((mode) => mode.id === activeMode);

  return (
    <BentoCard glow="blue" className="overflow-hidden !p-4 sm:!p-5">
      <header className="mb-4 space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Universal Input
        </p>
        <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
          Ett läge i taget
        </h2>
        <p className="text-xs text-text-dim">
          Dagens minnen, insikter och loggar — sparade i trygg hamn. Byt läge utan sidbyte.
        </p>
      </header>

      <nav
        className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1"
        aria-label="Inmatningslägen"
      >
        {FAMILJEN_INPUT_MODES_PRIMARY.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              aria-pressed={isActive}
              className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                isActive
                  ? 'border border-accent/40 bg-surface-3 text-accent'
                  : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
              }`}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-dim">{mode.description}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMoreModes((open) => !open)}
          aria-expanded={showMoreModes || isMoreModeActive}
          className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
            isMoreModeActive
              ? 'border border-accent/40 bg-surface-3 text-accent'
              : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
          }`}
        >
          <span className="block font-medium">Mer…</span>
          <span className="block text-[10px] text-text-dim">Inkast & arkiv</span>
        </button>

        {(showMoreModes || isMoreModeActive) &&
          FAMILJEN_INPUT_MODES_MORE.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                aria-pressed={isActive}
                className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? 'border border-accent/40 bg-surface-3 text-accent'
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
        <FamiljenInputModeDelegate
          mode={activeMode}
          shell={shell}
          onSaved={handleDelegateSaved}
        />
      </div>
    </BentoCard>
  );
}

type DelegateProps = {
  mode: FamiljenInputMode;
  shell: FamiljenShell;
  onSaved?: (logId?: string) => void;
};

function FamiljenInputModeDelegate({ mode, shell, onSaved }: DelegateProps) {
  switch (mode) {
    case 'barnfokus':
      return <FamiljenBarnfokusDelegate shell={shell} onSaved={onSaved} />;
    case 'livslogg_stund':
      return <FamiljenLivsloggStundDelegate shell={shell} onSaved={onSaved} />;
    case 'fysiologi':
      return <FamiljenFysiologiDelegate shell={shell} onSaved={onSaved} />;
    case 'livslogg_observation':
      return <FamiljenLivsloggObservationDelegate shell={shell} onSaved={onSaved} />;
    case 'vardagsstruktur':
      return <FamiljenVardagsstrukturDelegate shell={shell} onSaved={onSaved} />;
    case 'inkast':
      return <FamiljenInkastDelegate shell={shell} onSaved={onSaved} />;
    default:
      return null;
  }
}
