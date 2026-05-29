import { clsx } from 'clsx';
import {
  COMPASS_FLOW_ORDER,
  COMPASS_FLOW_TIME_ICON,
  COMPASS_TIME_ICON_SRC,
} from '../../wellbeing/compasses/config/compassTimeIcons';
import type { CompassFlow } from '../../wellbeing/compasses/utils/compassTime';

type Props = {
  activeFlow: CompassFlow;
};

/** Tre tidskompasser (K3 morgon · K2 dag · K1 kväll) — aktiv markeras. */
export function DagensRiktningCompassTrio({ activeFlow }: Props) {
  const labels = COMPASS_FLOW_ORDER.map((f) => COMPASS_FLOW_TIME_ICON[f].shortLabel).join(', ');

  return (
    <div
      className="dagens-riktning-card__compass-trio"
      role="img"
      aria-label={`Kompasser: ${labels}. Aktiv: ${COMPASS_FLOW_TIME_ICON[activeFlow].shortLabel}`}
    >
      {COMPASS_FLOW_ORDER.map((flow) => {
        const { iconId, shortLabel } = COMPASS_FLOW_TIME_ICON[flow];
        const isActive = flow === activeFlow;

        return (
          <span
            key={flow}
            className={clsx(
              'dagens-riktning-card__compass-chip',
              isActive && 'dagens-riktning-card__compass-chip--active',
            )}
            title={shortLabel}
          >
            <img
              src={COMPASS_TIME_ICON_SRC[iconId]}
              alt=""
              className="dagens-riktning-card__compass-chip-img"
              width={40}
              height={40}
              loading="lazy"
              decoding="async"
            />
          </span>
        );
      })}
    </div>
  );
}
