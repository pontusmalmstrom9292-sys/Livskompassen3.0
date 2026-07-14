import { BentoCard } from '@/shared/ui/BentoCard';
import { CompassQuickWidgetRail } from '@/features/dailyLife/wellbeing/compasses/components/CompassQuickWidgetRail';
import { DashboardPage as CompassDashboard } from '@/features/dailyLife/wellbeing/compasses/components/DashboardPage';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';

/** Lazy-loaded kompasser-flik för Liv och göra. */
export function LivKompasserTabPanel() {
  const compassFlow = getDefaultCompassByTime();

  return (
    <BentoCard glow="gold" depth noHover bare className="!p-4 sm:!p-5">
      <div className="space-y-4">
        <CompassQuickWidgetRail flow={compassFlow} className="compass-quick-widget-rail--in-module" />
        <CompassDashboard forcedFlow={compassFlow} />
      </div>
    </BentoCard>
  );
}
