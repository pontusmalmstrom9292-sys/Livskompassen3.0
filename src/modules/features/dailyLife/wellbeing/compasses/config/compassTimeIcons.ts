import type { CompassFlow } from '../utils/compassTime';

/** K1–K3 — docs/design/references/KOMPASS-TRE-TIDPUNKTER.md */
export type CompassTimeIconId = 'kvall' | 'skymning' | 'soluppgang';

export const COMPASS_TIME_ICON_SRC: Record<CompassTimeIconId, string> = {
  kvall: '/icons/compass-time/kvall.png',
  skymning: '/icons/compass-time/skymning.png',
  soluppgang: '/icons/compass-time/soluppgang.png',
};

export const COMPASS_FLOW_TIME_ICON: Record<
  CompassFlow,
  { iconId: CompassTimeIconId; shortLabel: string }
> = {
  morning: { iconId: 'soluppgang', shortLabel: 'Morgon' },
  day: { iconId: 'skymning', shortLabel: 'Dag' },
  evening: { iconId: 'kvall', shortLabel: 'Kväll' },
};

export const COMPASS_FLOW_ORDER: CompassFlow[] = ['morning', 'day', 'evening'];
