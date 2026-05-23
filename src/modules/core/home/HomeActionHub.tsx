import { useMemo } from 'react';
import { CompassModuleStrip } from '../../kompasser/components/CompassModuleStrip';
import { getDefaultCompassByTime } from '../../kompasser/utils/compassTime';
import { EVENING_HERO, getFlowConfig } from '../../kompasser/config/compassFlows';
import { HomeQuickModules } from './HomeQuickModules';

type Props = {
  onCheckInSaved?: () => void;
};

/** Hem — avlånga kompassmoduler + snabbmoduler (inte en enda glass-hub). */
export function HomeActionHub({ onCheckInSaved }: Props) {
  const flow = getDefaultCompassByTime();
  const flowMeta = flow === 'evening' ? EVENING_HERO : getFlowConfig(flow)!;

  const greeting = useMemo(
    () => ({
      eyebrow: `Hem · ${flowMeta.label}`,
      title: flowMeta.heroTitle,
      lead: flowMeta.heroLead,
    }),
    [flowMeta.heroLead, flowMeta.heroTitle, flowMeta.label],
  );

  return (
    <header className="home-action-hub space-y-4">
      <div className="home-action-hub__head px-0.5">
        <p className="home-page__eyebrow">{greeting.eyebrow}</p>
        <h2 className="home-page__title text-xl">{greeting.title}</h2>
        <p className="home-page__lead text-xs">{greeting.lead}</p>
      </div>

      <CompassModuleStrip onCheckInSaved={onCheckInSaved} />
      <HomeQuickModules onSaved={onCheckInSaved} />
    </header>
  );
}
