import type { KbtTransformResult } from '../api/kbtTransformatorService';

/** Deterministisk fallback när callable saknar transformator-läge (ej LLM). */
export function kbtTransformClientFallback(thought: string): KbtTransformResult {
  return {
    distortion: 'Automatisk negativ tolkning (kategorisering ej tillgänglig offline).',
    clinicalFact: `Du noterade: "${thought.slice(0, 120)}". Det är en tanke — inte bevis.`,
    compassionateRewrite:
      'Jag kan ha en tung tanke utan att den är sant. Jag tar ett andetag och väljer ett litet nästa steg.',
  };
}
