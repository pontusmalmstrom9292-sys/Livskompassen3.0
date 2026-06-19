import { HomeLayoutA } from './HomeLayoutA';

type Props = {
  onCheckInSaved?: () => void;
};

/** @deprecated Använd HomeLayoutA — behålls för brass-tema import. */
export function HomeBrassLayoutA({ onCheckInSaved }: Props) {
  return <HomeLayoutA variant="brass" onCheckInSaved={onCheckInSaved} />;
}
