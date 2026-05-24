import { HomeHeroKanon } from './HomeHeroKanon';
import { HomeQuickModules } from './HomeQuickModules';

type Props = {
  onCheckInSaved?: () => void;
};

export function HomeHeroCompass({ onCheckInSaved }: Props) {
  return (
    <div className="space-y-5">
      <HomeHeroKanon onCheckInSaved={onCheckInSaved} />
      <HomeQuickModules onSaved={onCheckInSaved} />
    </div>
  );
}
