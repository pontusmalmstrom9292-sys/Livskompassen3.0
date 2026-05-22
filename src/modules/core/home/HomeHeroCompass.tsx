import { HomeActionHub } from './HomeActionHub';

type Props = {
  onCheckInSaved?: () => void;
};

export function HomeHeroCompass({ onCheckInSaved }: Props) {
  return <HomeActionHub onCheckInSaved={onCheckInSaved} />;
}
