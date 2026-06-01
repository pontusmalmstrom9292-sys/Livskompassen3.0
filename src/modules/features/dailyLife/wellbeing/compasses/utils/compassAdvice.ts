import { EVENING_HERO, getFlowConfig } from '../config/compassFlows';
import type { CompassFlow } from './compassTime';
import { getDefaultCompassByTime } from './compassTime';

/**
 * Korta råd på Hem / Hamn / Kompassråd (svenska, lågaffektivt).
 * Kväll: «landa» = verb (stänga dagen), inte substantivet «land».
 */
export const COMPASS_ADVICE: Record<CompassFlow, string> = {
  morning: 'Ett mikrosteg räcker. Du behöver inte planera hela dagen nu.',
  day: 'Börja med kroppen — sedan logistik, ett steg i taget.',
  evening: 'Landa dagen lugnt. Gränser får vänta till i morgon om det känns tungt.',
};

export function getCompassAdvice(flow: CompassFlow): string {
  return COMPASS_ADVICE[flow];
}

export function getCompassFlowMeta(flow: CompassFlow = getDefaultCompassByTime()) {
  if (flow === 'evening') {
    return {
      flow,
      label: EVENING_HERO.label,
      heroLead: EVENING_HERO.heroLead,
      heroTitle: EVENING_HERO.heroTitle,
    };
  }
  const cfg = getFlowConfig(flow)!;
  return {
    flow,
    label: cfg.label,
    heroLead: cfg.heroLead,
    heroTitle: cfg.heroTitle,
  };
}
