import {
  COMPASS_FLOW_TIME_ICON,
  COMPASS_TIME_ICON_SRC,
} from '../../wellbeing/compasses/config/compassTimeIcons';
import type { CompassFlow } from '../../wellbeing/compasses/utils/compassTime';

type Props = {
  activeFlow: CompassFlow;
};

/** Aktuell tidskompass (K1–K3) — en ikon, stor. */
export function DagensRiktningCompassIcon({ activeFlow }: Props) {
  const { iconId, shortLabel } = COMPASS_FLOW_TIME_ICON[activeFlow];

  return (
    <div
      className="dagens-riktning-card__compass-chip dagens-riktning-card__compass-chip--solo"
      role="img"
      aria-label={`Kompass: ${shortLabel}`}
      title={shortLabel}
    >
      <img
        src={COMPASS_TIME_ICON_SRC[iconId]}
        alt=""
        className="dagens-riktning-card__compass-chip-img"
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
