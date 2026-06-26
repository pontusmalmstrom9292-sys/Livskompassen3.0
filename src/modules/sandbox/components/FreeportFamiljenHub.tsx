import { clsx } from 'clsx';
import { useCallback, useState } from 'react';
import { FAMILJEN_INPUT_MODES } from '@/features/family/children/supermodule/familjenInputModes';
import type { FamiljenInputMode } from '@/features/family/children/supermodule/familjenInputModes';
import {
  getDefaultTarget,
  type FreeportChameleonTarget,
} from '../freeportChameleonBridge';
import {
  FAMILIEN_HUB_LAYOUTS,
  type FamiljenHubLayoutId,
} from '../familjenHubLayouts';
import { FreeportChameleonLive } from './FreeportChameleonLive';

type Props = {
  onStatus?: (msg: string) => void;
};

const DISCOVERY_CARDS = [
  { id: 'barnfokus', label: 'Barnfokus', mode: 'barnfokus' as FamiljenInputMode },
  { id: 'livslogg_stund', label: 'Ny stund', mode: 'livslogg_stund' as FamiljenInputMode },
  { id: 'fysiologi', label: 'Fysiologi', mode: 'fysiologi' as FamiljenInputMode },
];

export function FreeportFamiljenHub({ onStatus }: Props) {
  const [layoutId, setLayoutId] = useState<FamiljenHubLayoutId>('barnfokus-fokus');
  const [showHidden, setShowHidden] = useState(false);
  const [target, setTarget] = useState<FreeportChameleonTarget>(() =>
    getDefaultTarget('familjen'),
  );

  const layout = FAMILIEN_HUB_LAYOUTS.find((l) => l.id === layoutId) ?? FAMILIEN_HUB_LAYOUTS[0];

  const pickDiscovery = useCallback(
    (mode: FamiljenInputMode) => {
      setTarget({ zone: 'familjen', module: 'familjen', mode });
      onStatus?.(`Familjen: ${mode}`);
    },
    [onStatus],
  );

  return (
    <div>
      <div className="design-freeport__exec-hub-scenic">
        <p className="design-freeport__exec-label">Familjen hub</p>
        <h3 className="design-freeport__exec-hub-scenic-title">Den trygga hamnen</h3>
        <p className="design-freeport__hint mt-2">Barnfokus · livslogg · minnen</p>
      </div>
      <section className="design-freeport__section">
        <p className="design-freeport__section-title">Familjen — hub-layouter</p>
        <p className="design-freeport__hint mt-1">{layout.lead}</p>
        <div className="design-freeport__layout-picker">
          {FAMILIEN_HUB_LAYOUTS.map((l) => (
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
      </section>

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
            <p className="design-freeport__section-title">Kort under modulen</p>
            <div
              className={clsx(
                layout.archetype === 'grid' ? 'design-freeport__cards' : 'flex flex-col gap-2',
              )}
            >
              {DISCOVERY_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={clsx(
                    'design-freeport__card',
                    target.mode === card.mode && 'design-freeport__card--on',
                  )}
                  onClick={() => pickDiscovery(card.mode)}
                >
                  <span className="design-freeport__card-title">{card.label}</span>
                  <span className="design-freeport__card-preview">
                    {FAMILJEN_INPUT_MODES.find((m) => m.id === card.mode)?.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="design-freeport__rail-toggle mt-3"
        onClick={() => setShowHidden((v) => !v)}
        aria-expanded={showHidden}
      >
        Fler funktioner
        <span aria-hidden>{showHidden ? '▾' : '▸'}</span>
      </button>

      {showHidden ? (
        <div className="design-freeport__hidden-actions">
          <p className="design-freeport__hint">
            Valv och barnlogg-promote visas endast efter PIN / långtryck i prod. Sandbox: ingen
            auto-promote till Valv.
          </p>
          <button
            type="button"
            className="design-freeport__layout-btn mt-2"
            onClick={() => {
              setTarget({ zone: 'familjen', module: 'familjen', mode: 'inkast' });
              onStatus?.('Hamn/inkast — manuell granskning');
            }}
          >
            Öppna familje-inkast (BIFF)
          </button>
        </div>
      ) : null}

      <p className="design-freeport__hint mt-3">
        Barnfokus-delegate låst · ingen auto-promote barnlogg → Valv.
      </p>
    </div>
  );
}
