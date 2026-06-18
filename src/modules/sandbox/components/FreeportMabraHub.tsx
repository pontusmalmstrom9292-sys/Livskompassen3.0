import { clsx } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { MABRA_INPUT_MODES } from '@/features/dailyLife/wellbeing/mabra/supermodule/mabraInputModes';
import type { MabraInputMode } from '@/features/dailyLife/wellbeing/mabra/supermodule/mabraInputModes';
import { type FreeportChameleonTarget } from '../freeportChameleonBridge';
import {
  MABRA_HUB_LAYOUTS,
  resolveMabraLayout,
  type MabraHubLayoutId,
} from '../mabraHubLayouts';
import { FreeportChameleonLive } from './FreeportChameleonLive';

type CapacityBand = 'low' | 'mid' | 'high';

const CAPACITY_MOCK: Record<
  CapacityBand,
  { coach: string; microSteps?: string[] }
> = {
  low: {
    coach: 'Ett steg i taget. Andas ut. Inget mer krävs av dig just nu.',
    microSteps: [
      'Sätt fötterna i golvet.',
      'Välj ett humör — eller hoppa över.',
      'Inget mer krävs nu.',
    ],
  },
  mid: {
    coach: 'Du är här. Välj ett läge som passar din energi idag.',
  },
  high: {
    coach: 'Full MåBra-hub — frågekort, reflektion och anteckning tillgängliga.',
  },
};

type Props = {
  lowCapacity?: boolean;
  onStatus?: (msg: string) => void;
};

const PRIMARY_MODES: MabraInputMode[] = [
  'checkin',
  'vit_card',
  'reflection_tool',
  'emotional_memory',
  'exercise_note',
];

export function FreeportMabraHub({ lowCapacity = false, onStatus }: Props) {
  const [layoutId, setLayoutId] = useState<MabraHubLayoutId>('checkin-fokus');
  const [capacityBand, setCapacityBand] = useState<CapacityBand>(lowCapacity ? 'low' : 'mid');
  const [target, setTarget] = useState<FreeportChameleonTarget>(() => ({
    zone: 'vardagen',
    module: 'mabra',
    mode: 'checkin',
  }));

  const layout = resolveMabraLayout(layoutId, lowCapacity || capacityBand === 'low');
  const mock = CAPACITY_MOCK[capacityBand];

  useEffect(() => {
    if (lowCapacity) {
      setCapacityBand('low');
      setLayoutId('paralys-panel');
    }
  }, [lowCapacity]);

  useEffect(() => {
    setTarget({ zone: 'vardagen', module: 'mabra', mode: layout.defaultMode });
  }, [layout.defaultMode]);

  const setMode = useCallback(
    (mode: MabraInputMode) => {
      setTarget({ zone: 'vardagen', module: 'mabra', mode });
      onStatus?.(`MåBra: ${mode}`);
    },
    [onStatus],
  );

  return (
    <div>
      <section className="design-freeport__section">
        <p className="design-freeport__section-title">MåBra — hub-layouter</p>
        <p className="design-freeport__hint mt-1">{layout.lead}</p>
        {!lowCapacity ? (
          <div className="design-freeport__layout-picker">
            {MABRA_HUB_LAYOUTS.filter((l) => !l.capacityOnly).map((l) => (
              <button
                key={l.id}
                type="button"
                className={clsx(
                  'design-freeport__layout-btn',
                  layoutId === l.id && 'design-freeport__layout-btn--on',
                )}
                onClick={() => setLayoutId(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <div className="design-freeport__capacity-band" aria-live="polite">
        <span className="design-freeport__capacity-band-label">Kapacitet (sandbox-mock)</span>
        <span className="design-freeport__capacity-band-value">{capacityBand}</span>
        {!lowCapacity ? (
          <div className="flex gap-1 ml-auto">
            {(['low', 'mid', 'high'] as const).map((band) => (
              <button
                key={band}
                type="button"
                className={clsx(
                  'design-freeport__layout-btn',
                  capacityBand === band && 'design-freeport__layout-btn--on',
                )}
                onClick={() => setCapacityBand(band)}
              >
                {band}
              </button>
            ))}
          </div>
        ) : null}
        <p className="w-full text-sm text-[var(--fp-text-muted)] mt-1">{mock.coach}</p>
        {mock.microSteps ? (
          <ol className="design-freeport__micro-steps">
            {mock.microSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
      </div>

      <div
        className={clsx(
          'design-freeport__hub-archetype',
          `design-freeport__hub-archetype--${layout.archetype}`,
        )}
      >
        <div className="design-freeport__hub-archetype-main">
          <FreeportChameleonLive
            target={target}
            onTargetChange={setTarget}
            onStatus={onStatus}
            compact
          />
        </div>

        {layout.archetype !== 'fokus' ? (
          <div className="design-freeport__hub-archetype-side">
            <p className="design-freeport__section-title">Modes (mabraInputModes)</p>
            <div
              className={clsx(
                layout.archetype === 'grid' ? 'design-freeport__cards' : 'flex flex-col gap-2',
              )}
            >
              {MABRA_INPUT_MODES.filter((m) => PRIMARY_MODES.includes(m.id)).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={clsx(
                    'design-freeport__card',
                    target.mode === mode.id && 'design-freeport__card--on',
                  )}
                  onClick={() => setMode(mode.id)}
                >
                  <span className="design-freeport__card-title">{mode.label}</span>
                  <span className="design-freeport__card-preview">{mode.description}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <p className="design-freeport__hint mt-3">
        Coach-band speglar{' '}
        <code className="text-[10px]">mabraCapacityParafras.ts</code> — ingen ny backend i sandbox.
      </p>
    </div>
  );
}
