import { clsx } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { useStore } from '@/core/store';
import {
  getDefaultTarget,
  type FreeportChameleonTarget,
} from '../freeportChameleonBridge';
import {
  HJARTAT_HUB_LAYOUTS,
  resolveHjartatLayout,
  type HjartatHubLayoutId,
} from '../hjartatHubLayouts';
import { FreeportChameleonLive } from './FreeportChameleonLive';

type Props = {
  lowCapacity?: boolean;
  onStatus?: (msg: string) => void;
};

const DISCOVERY_CARDS = [
  { id: 'reflektion', label: 'Skriv dagbok', mode: 'reflektion' },
  { id: 'quick_mirror', label: 'Snabb spegling', mode: 'quick_mirror' },
  { id: 'arkiv', label: 'Läs arkiv', mode: 'arkiv' },
  { id: 'inkast', label: 'Fånga', mode: '__inkast__' },
] as const;

export function FreeportHjartatHub({ lowCapacity = false, onStatus }: Props) {
  const user = useStore((s) => s.user);
  const [layoutId, setLayoutId] = useState<HjartatHubLayoutId>('reflektion-studio');
  const [inkastOpen, setInkastOpen] = useState(false);
  const [target, setTarget] = useState<FreeportChameleonTarget>(() =>
    getDefaultTarget('hjartat'),
  );

  const layout = resolveHjartatLayout(layoutId, lowCapacity);

  useEffect(() => {
    if (lowCapacity) {
      setLayoutId('lugn-triad');
    }
  }, [lowCapacity]);

  useEffect(() => {
    if (inkastOpen) return;
    setTarget({ zone: 'hjartat', module: 'dagbok', mode: layout.defaultMode });
  }, [layout.defaultMode, inkastOpen]);

  const cards = lowCapacity ? DISCOVERY_CARDS.slice(0, 2) : DISCOVERY_CARDS;

  const pickDiscovery = useCallback(
    (mode: string) => {
      if (mode === '__inkast__') {
        setInkastOpen(true);
        onStatus?.('Inkast — morph in-place (sandbox)');
        return;
      }
      setInkastOpen(false);
      setTarget({ zone: 'hjartat', module: 'dagbok', mode });
      onStatus?.(`Hjärtat: ${mode}`);
    },
    [onStatus],
  );

  const isEphemeral = target.mode === 'quick_mirror' && !inkastOpen;

  return (
    <div>
      <section className="design-freeport__section">
        <p className="design-freeport__section-title">Hjärtat — hub-layouter</p>
        <p className="design-freeport__hint mt-1">{layout.lead}</p>
        {!lowCapacity ? (
          <div className="design-freeport__layout-picker">
            {HJARTAT_HUB_LAYOUTS.filter((l) => !l.capacityOnly).map((l) => (
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
        ) : (
          <p className="design-freeport__hint mt-2">Lugn triad — simulerad låg kapacitet</p>
        )}
      </section>

      <div
        className={clsx(
          'design-freeport__hub-archetype',
          `design-freeport__hub-archetype--${layout.archetype}`,
        )}
      >
        <div className="design-freeport__hub-archetype-main">
          {isEphemeral ? (
            <div className="design-freeport__ephemeral-ribbon" role="status">
              <span aria-hidden>◇</span>
              Försvinner när du lämnar — Zero Footprint
            </div>
          ) : null}

          {inkastOpen ? (
            <div className="design-freeport__module-panel">
              <p className="design-freeport__section-title">Inkast — discovery morph</p>
              <p className="design-freeport__hint mt-1 mb-3">
                DCAP före LLM · granska innan Valv/Barnen
              </p>
              {user?.uid ? (
                <CaptureSuperModule variant="hem-inkast" compact />
              ) : (
                <p className="design-freeport__hint">Logga in för inkast med granskning.</p>
              )}
              <button
                type="button"
                className="design-freeport__layout-btn mt-3"
                onClick={() => {
                  setInkastOpen(false);
                  onStatus?.('Tillbaka till chameleon');
                }}
              >
                Tillbaka
              </button>
            </div>
          ) : (
            <FreeportChameleonLive
              target={target}
              onTargetChange={setTarget}
              onStatus={onStatus}
              compact
            />
          )}
        </div>

        {layout.archetype !== 'fokus' ? (
          <div className="design-freeport__hub-archetype-side">
            <p className="design-freeport__section-title">Discovery</p>
            <div
              className={clsx(
                layout.archetype === 'grid'
                  ? 'design-freeport__cards'
                  : 'flex flex-col gap-2',
              )}
            >
              {cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={clsx(
                    'design-freeport__card',
                    target.mode === card.mode && !inkastOpen && 'design-freeport__card--on',
                  )}
                  onClick={() => pickDiscovery(card.mode)}
                >
                  <span className="design-freeport__card-title">{card.label}</span>
                  <span className="design-freeport__card-preview">
                    {card.mode === '__inkast__'
                      ? 'Morph till capture — ingen fjärde flik'
                      : `→ ${card.mode}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
