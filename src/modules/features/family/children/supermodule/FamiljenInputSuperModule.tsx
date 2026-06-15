import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  DEFAULT_FAMILJEN_INPUT_MODE,
  getFamiljenInputModeMeta,
  parseFamiljenInputMode,
  type FamiljenInputMode,
} from './familjenInputModes';
import { FamiljenInputModePicker } from './FamiljenInputModePicker';
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

  const activeMode = useMemo(
    () => initialMode ?? parseFamiljenInputMode(searchParams.get('inputMode')),
    [initialMode, searchParams],
  );

  const activeMeta = getFamiljenInputModeMeta(activeMode);

  const setActiveMode = useCallback(
    (mode: FamiljenInputMode) => {
      if (initialMode) return;

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

  return (
    <BentoCard
      glow="blue"
      className="familjen-input-hub od-depth max-sm:overflow-visible overflow-hidden !p-0"
    >
      <div className="familjen-input-hub__chrome shrink-0 border-b border-[rgba(212,175,55,0.12)] px-4 py-3 sm:px-5 sm:py-4">
        <header className="mb-3 space-y-1">
          <p className="od-depth__eyebrow">Universal Input</p>
          <h2 className="font-display-serif text-sm uppercase tracking-[0.18em] text-text sm:text-base">
            {activeMeta.label}
          </h2>
          <p className="text-xs text-text-dim">{activeMeta.description}</p>
        </header>

        <FamiljenInputModePicker activeMode={activeMode} onChange={setActiveMode} />
      </div>

      <div className="familjen-input-hub__viewport px-4 py-4 sm:px-5 sm:py-5">
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
