import { EVENING_HERO, getFlowConfig } from '../config/compassFlows';
import type { CompassFlow } from './compassTime';
import { getDefaultCompassByTime } from './compassTime';
import {
  compassFlowToQuotePhase,
  pickQuote,
} from '@/core/copy/compassBannerQuotes';

/**
 * Korta råd på Hem / Hamn / Kompassråd (svenska, lågaffektivt).
 * Roterar deterministiskt per dag + fas — samma citat hela dagen.
 */
export function getCompassAdvice(flow: CompassFlow, date = new Date()): string {
  return pickQuote(compassFlowToQuotePhase(flow), date);
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
