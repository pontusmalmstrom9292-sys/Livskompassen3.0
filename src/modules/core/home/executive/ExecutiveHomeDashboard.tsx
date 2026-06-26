import { ExecutiveHomeStagger, ExecutiveHomeStaggerItem } from './ExecutiveHomeStagger';
import { ExecutiveReflektionHero } from './ExecutiveReflektionHero';
import { ExecutiveFocusCard } from './cards/ExecutiveFocusCard';
import { ExecutiveLivsloggCard } from './cards/ExecutiveLivsloggCard';
import { ExecutiveAnkareCard } from './cards/ExecutiveAnkareCard';
import { ExecutiveDayStepsCard } from './cards/ExecutiveDayStepsCard';
import { ExecutivePlaneringCard } from './ExecutivePlaneringCard';
import { ExecutiveJournalHistoryRail } from './ExecutiveJournalHistoryRail';

type Props = {
  onCheckInSaved?: () => void;
};

/** Midnight Executive hem — mockup mix-E som prod-UI. */
export function ExecutiveHomeDashboard({ onCheckInSaved }: Props) {
  return (
    <ExecutiveHomeStagger className="executive-home-dashboard calm-scroll-island mx-auto w-full max-w-2xl space-y-4 pb-4">
      <ExecutiveHomeStaggerItem>
        <ExecutiveReflektionHero />
      </ExecutiveHomeStaggerItem>

      <ExecutiveHomeStaggerItem>
        <div className="executive-home-grid">
          <ExecutiveFocusCard />
          <ExecutiveLivsloggCard />
          <ExecutiveAnkareCard onSaved={onCheckInSaved} />
          <ExecutiveDayStepsCard />
        </div>
      </ExecutiveHomeStaggerItem>

      <ExecutiveHomeStaggerItem>
        <ExecutivePlaneringCard />
      </ExecutiveHomeStaggerItem>
      <ExecutiveHomeStaggerItem>
        <ExecutiveJournalHistoryRail />
      </ExecutiveHomeStaggerItem>
    </ExecutiveHomeStagger>
  );
}
