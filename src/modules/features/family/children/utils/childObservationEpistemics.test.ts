import { describe, expect, it } from 'vitest';
import {
  epistemicKindLabel,
  formatChildObservation,
  parseEpistemicKindFromObservation,
  stripEpistemicPrefixes,
} from './childObservationEpistemics';

describe('childObservationEpistemics', () => {
  it('prefixes observation when missing epistemic tag', () => {
    expect(formatChildObservation('Hej', 'citat')).toBe('[citat] Hej');
  });

  it('parses stored epistemic kind', () => {
    expect(parseEpistemicKindFromObservation('[tolkning] Såg trötthet')).toBe('tolkning');
    expect(parseEpistemicKindFromObservation('utan prefix')).toBeNull();
  });

  it('strips prefixes for display', () => {
    expect(stripEpistemicPrefixes('[citat] [gladje] Myskväll')).toBe('Myskväll');
  });

  it('labels epistemic kinds for UI', () => {
    expect(epistemicKindLabel('citat')).toBe('Citat');
    expect(epistemicKindLabel('tolkning')).toBe('Tolkning');
  });
});
