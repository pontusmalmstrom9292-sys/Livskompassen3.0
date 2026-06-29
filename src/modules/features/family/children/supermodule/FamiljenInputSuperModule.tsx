import { useCallback, useMemo, lazy, Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { clsx } from 'clsx';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  DEFAULT_FAMILJEN_INPUT_MODE,
  getFamiljenInputModeMeta,
  parseFamiljenInputMode,
  type FamiljenInputMode,
} from './familjenInputModes';
import { FamiljenInputModePicker } from './FamiljenInputModePicker';
import type { FamiljenShell } from '../hooks/useFamiljenShell';

const FamiljenBarnfokusDelegate = lazy(() =>
  import('./delegates/FamiljenBarnfokusDelegate').then((m) => ({ default: m.FamiljenBarnfokusDelegate })),
);
const FamiljenLivsloggStundDelegate = lazy(() =>
  import('./delegates/FamiljenLivsloggStundDelegate').then((m) => ({
    default: m.FamiljenLivsloggStundDelegate,
  })),
);
const FamiljenFysiologiDelegate = lazy(() =>
  import('./delegates/FamiljenFysiologiDelegate').then((m) => ({ default: m.FamiljenFysiologiDelegate })),
);
const FamiljenLivsloggObservationDelegate = lazy(() =>
  import('./delegates/FamiljenLivsloggObservationDelegate').then((m) => ({
    default: m.FamiljenLivsloggObservationDelegate,
  })),
);
const FamiljenVardagsstrukturDelegate = lazy(() =>
  import('./delegates/FamiljenVardagsstrukturDelegate').then((m) => ({
    default: m.FamiljenVardagsstrukturDelegate,
  })),
);
const FamiljenInkastDelegate = lazy(() =>
  import('./delegates/FamiljenInkastDelegate').then((m) => ({ default: m.FamiljenInkastDelegate })),
);

function FamiljenDelegateFallback() {
  return <p className="py-4 text-center text-xs text-text-dim">Laddar…</p>;
}

export type FamiljenInputSuperModuleProps = {
  /** Obligatorisk — all state och writes från parent (FamiljenPage). */
  shell: FamiljenShell;
  /** Override URL-parsing (t.ex. Storybook). */
  initialMode?: FamiljenInputMode;
  /** Callback efter lyckat spar (valfritt — t.ex. scroll till minneslista). */
  onSaved?: (mode: FamiljenInputMode, logId?: string) => void;
  /** Desktop hub-lock: ingen intern scroll i kortet — yttre calm-scroll-island scrollar. */
  flowWithIsland?: boolean;
};

/**
 * Canonical router for Familjen Universal Input Hub (Fas 7).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function FamiljenInputSuperModule({
  shell,
  initialMode,
  onSaved,
  flowWithIsland = false,
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
      className={clsx(
        'familjen-input-hub od-depth overflow-hidden !p-0',
        flowWithIsland && 'familjen-input-hub--flow',
      )}
    >
      <div className="supermodule-hub-chrome familjen-input-hub__chrome shrink-0 px-4 py-3 sm:px-5 sm:py-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <header className="familjen-input-hub__header min-w-0 flex-1 space-y-1">
            <p className="od-depth__eyebrow">Universal Input</p>
            <h2 className="font-display-serif text-sm uppercase tracking-[0.18em] text-text sm:text-base">
              {activeMeta.label}
            </h2>
            <p className="text-xs text-text-dim">{activeMeta.description}</p>
          </header>
          <ModuleHelpFromRegistry moduleId="familjen" mode={activeMode} />
        </div>

        <FamiljenInputModePicker activeMode={activeMode} onChange={setActiveMode} />
      </div>

      <div
        className={clsx(
          'familjen-input-hub__viewport px-4 py-4 sm:px-5 sm:py-5',
          !flowWithIsland && 'calm-scroll-island max-h-[min(75vh,720px)] overflow-y-auto',
        )}
      >
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
  let content: ReactNode = null;
  switch (mode) {
    case 'barnfokus':
      content = <FamiljenBarnfokusDelegate shell={shell} onSaved={onSaved} />;
      break;
    case 'livslogg_stund':
      content = <FamiljenLivsloggStundDelegate shell={shell} onSaved={onSaved} />;
      break;
    case 'fysiologi':
      content = <FamiljenFysiologiDelegate shell={shell} onSaved={onSaved} />;
      break;
    case 'livslogg_observation':
      content = <FamiljenLivsloggObservationDelegate shell={shell} onSaved={onSaved} />;
      break;
    case 'vardagsstruktur':
      content = <FamiljenVardagsstrukturDelegate shell={shell} onSaved={onSaved} />;
      break;
    case 'inkast':
      content = <FamiljenInkastDelegate shell={shell} onSaved={onSaved} />;
      break;
    default:
      return null;
  }
  return <Suspense fallback={<FamiljenDelegateFallback />}>{content}</Suspense>;
}
