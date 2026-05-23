import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, BookOpen, Sparkles, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import type { CompassFlow } from '../../kompasser/utils/compassTime';
import type { HomeActionId } from './homeActionCategories';
import {
  LIFE_AREA_META,
  activationsByArea,
  pickCompassFact,
  resolveLifeAreaActivations,
  type LifeAreaActivation,
  type LifeAreaId,
} from './compassLifeAreaActions';

const areaIcon: Record<LifeAreaId, typeof Sparkles> = {
  utveckling: Sparkles,
  vila: BookOpen,
  praktik: Zap,
  relation: Anchor,
};

const areaTone: Record<LifeAreaId, string> = {
  utveckling: 'life-area--indigo',
  vila: 'life-area--lavender',
  praktik: 'life-area--emerald',
  relation: 'life-area--gold',
};

type Props = {
  flow: CompassFlow;
  option: string | null;
  saved: boolean;
  onHomeAction: (id: HomeActionId) => void;
  onShowFact: (text: string) => void;
};

export function LifeAreaActivationBar({
  flow,
  option,
  saved,
  onHomeAction,
  onShowFact,
}: Props) {
  const navigate = useNavigate();
  const activations = useMemo(
    () => resolveLifeAreaActivations(flow, option, saved),
    [flow, option, saved],
  );
  const byArea = useMemo(() => activationsByArea(activations), [activations]);

  const run = (a: LifeAreaActivation) => {
    if (!saved) return;
    if (a.factKey) {
      onShowFact(pickCompassFact(a.factKey + (option ?? '')));
      return;
    }
    if (a.homeAction) {
      onHomeAction(a.homeAction);
      return;
    }
    if (a.path) {
      navigate({ pathname: a.path, search: a.search ?? '' });
    }
  };

  return (
    <section className="life-area-bar" aria-label="Aktivering per livsområde">
      <p className="life-area-bar__eyebrow">
        {saved ? 'Välj livsområde — anpassat efter ditt svar' : 'Spara check-in — då låses områden upp'}
      </p>
      <div className="life-area-bar__grid">
        {(Object.keys(LIFE_AREA_META) as LifeAreaId[]).map((areaId) => {
          const meta = LIFE_AREA_META[areaId];
          const items = byArea.get(areaId) ?? [];
          const primary = items.find((a) => a.label !== '—') ?? items[0];
          const Icon = areaIcon[areaId];

          return (
            <div
              key={areaId}
              className={clsx('life-area-tile', areaTone[areaId], saved && 'life-area-tile--live')}
            >
              <div className="life-area-tile__head">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="life-area-tile__name">{meta.label}</span>
              </div>
              {primary && primary.label !== '—' ? (
                <button
                  type="button"
                  disabled={!saved}
                  className="life-area-tile__action"
                  onClick={() => run(primary)}
                >
                  <span className="life-area-tile__action-label">{primary.label}</span>
                  <span className="life-area-tile__action-hint">{primary.hint}</span>
                </button>
              ) : (
                <p className="life-area-tile__preview">{meta.desc}</p>
              )}
              {saved && items.length > 1 && (
                <div className="life-area-tile__more">
                  {items
                    .filter((a) => a.id !== primary?.id)
                    .map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        className="life-area-tile__chip"
                        onClick={() => run(a)}
                      >
                        {a.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
