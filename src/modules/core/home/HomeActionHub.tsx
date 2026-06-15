import { useMemo } from 'react';
import { CompassModuleStrip } from '@/features/dailyLife/wellbeing/compasses/components/CompassModuleStrip';
import { KompassradPanel } from '@/features/dailyLife/wellbeing/compasses/components/KompassradPanel';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import { EVENING_HERO, getFlowConfig } from '@/features/dailyLife/wellbeing/compasses/config/compassFlows';
import { BentoCard } from '@/shared/ui/BentoCard';
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
      <BentoCard glow="gold" depth className="home-action-hub__head rounded-[14px] border-[2px] border-accent/25 px-4 py-4 sm:px-5">
        <p className="home-page__eyebrow">{greeting.eyebrow}</p>
        <h2 className="home-page__title text-xl">{greeting.title}</h2>
        <p className="home-page__lead text-xs">{greeting.lead}</p>
      </BentoCard>

      <KompassradPanel />
      <CompassModuleStrip onCheckInSaved={onCheckInSaved} />
      <HomeQuickModules onSaved={onCheckInSaved} />
    </header>
  );
}
