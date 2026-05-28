import { EVENING_HERO, getFlowConfig } from '../config/compassFlows';
import type { CompassFlow } from './compassTime';
import { getDefaultCompassByTime } from './compassTime';

export function getCompassAdvice(flow: CompassFlow): string {
  if (flow === 'morning') {
    return 'Ett mikrosteg räcker. Du behöver inte lösa hela dagen nu.';
  }
  if (flow === 'day') {
    return 'Sortera kroppen först — sedan logistik mot ex.';
  }
  return 'Land dagen. Gränser kan vänta till imorgon om det känns tungt.';
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
