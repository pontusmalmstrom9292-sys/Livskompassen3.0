import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { DashboardPage } from '../../kompasser/components/DashboardPage';
import { getDefaultCompassByTime } from '../../kompasser/utils/compassTime';
import { EVENING_HERO, getFlowConfig } from '../../kompasser/config/compassFlows';
import {
  HOME_ACTION_CATEGORIES,
  getHomeActionCategory,
  type HomeActionId,
} from './homeActionCategories';
import { HomeDagbokPanel } from './panels/HomeDagbokPanel';
import { HomeTaskPanel } from './panels/HomeTaskPanel';
import { HomeVaultLearningPanel } from './panels/HomeVaultLearningPanel';
import { HomeFaktaPanel } from './panels/HomeFaktaPanel';

const toneActive: Record<string, string> = {
  gold: 'home-action-chip--gold',
  emerald: 'home-action-chip--emerald',
  indigo: 'home-action-chip--indigo',
  lavender: 'home-action-chip--lavender',
};

type Props = {
  onCheckInSaved?: () => void;
};

export function HomeActionHub({ onCheckInSaved }: Props) {
  const [active, setActive] = useState<HomeActionId>('kompass');
  const [fact, setFact] = useState<string | null>(null);
  const flow = getDefaultCompassByTime();
  const flowMeta = flow === 'evening' ? EVENING_HERO : getFlowConfig(flow)!;
  const category = getHomeActionCategory(active);

  const headerTitle = useMemo(() => {
    if (active === 'kompass') return flowMeta.heroTitle;
    return category.label;
  }, [active, category.label, flowMeta.heroTitle]);

  const headerLead = useMemo(() => {
    if (active === 'kompass') return flowMeta.heroLead;
    return category.desc;
  }, [active, category.desc, flowMeta.heroLead]);

  const handleActivate = (id: HomeActionId) => {
    setFact(null);
    setActive(id);
  };

  return (
    <header className="home-action-hub">
      <div className="home-action-hub__glass">
        {active !== 'kompass' && (
          <div className="home-action-hub__head">
            <p className="home-page__eyebrow">Hem · {category.label}</p>
            <h2 className="home-page__title">{headerTitle}</h2>
            <p className="home-page__lead">{headerLead}</p>
          </div>
        )}

        <div className="home-action-hub__scroll" role="tablist" aria-label="Välj aktivitet">
          {HOME_ACTION_CATEGORIES.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setFact(null);
                  setActive(item.id);
                }}
                className={clsx(
                  'home-action-chip',
                  toneActive[item.tone],
                  isActive && 'home-action-chip--active',
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="home-action-chip__label">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="home-action-hub__panel" role="tabpanel">
          {active === 'kompass' && (
            <>
              <p className="home-action-hub__kompass-kicker">
                {flowMeta.label} · {flowMeta.heroLead}
              </p>
              {fact && (
                <HomeFaktaPanel
                  fact={fact}
                  seed={flow}
                  onNewFact={setFact}
                  onClose={() => setFact(null)}
                />
              )}
              <DashboardPage
                variant="hub"
                onCheckInSaved={onCheckInSaved}
                onLifeAreaActivate={handleActivate}
                onShowFact={setFact}
              />
            </>
          )}
          {active === 'dagbok' && <HomeDagbokPanel onSaved={onCheckInSaved} />}
          {active === 'uppgift' && <HomeTaskPanel />}
          {active === 'quiz' && (
            <HomeVaultLearningPanel mode="quiz" onSaved={onCheckInSaved} />
          )}
          {active === 'lucka' && (
            <HomeVaultLearningPanel mode="gap" onSaved={onCheckInSaved} />
          )}
        </div>
      </div>
    </header>
  );
}
