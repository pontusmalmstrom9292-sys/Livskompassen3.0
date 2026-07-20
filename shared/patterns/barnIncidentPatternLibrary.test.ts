import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  scanBarnIncidentText,
  formatIncidentMetaTruth,
  BARN_INCIDENT_LIBRARY_VERSION,
} from './barnIncidentPatternLibrary';

describe('barnIncidentPatternLibrary', () => {
  it('Kasper-exempel: triangulering + contact_fear_relay', () => {
    const text = 'Kasper sa att mamma sagt att pappa inte vill träffa honom.';
    const matches = scanBarnIncidentText(text);
    const tags = matches.map((m) => m.tag);
    assert.ok(tags.includes('triangulering'), `saknar triangulering: ${tags.join(',')}`);
    assert.ok(
      tags.includes('contact_fear_relay') || tags.includes('parental_alienation_pattern'),
      `saknar kontakt/mönster: ${tags.join(',')}`,
    );
    assert.ok(matches[0]!.weight >= 30);
  });

  it('tom text → inga träffar', () => {
    assert.equal(scanBarnIncidentText('   ').length, 0);
  });

  it('meta-truth innehåller version', () => {
    const matches = scanBarnIncidentText('Han sa att mamma sagt att du inte bryr dig.');
    const truth = formatIncidentMetaTruth(matches);
    assert.match(truth, /^\[incident_meta\]/);
    assert.ok(truth.includes(BARN_INCIDENT_LIBRARY_VERSION));
  });

  it('UI-etikett för parental_alienation_pattern är beteende — inte diagnos', () => {
    const matches = scanBarnIncidentText('Hon sa att du är en dålig pappa och vill inte träffa dig.');
    const pap = matches.find((m) => m.tag === 'parental_alienation_pattern');
    if (pap) {
      assert.ok(!/diagnos/i.test(pap.label));
      assert.match(pap.label, /beteende/i);
    }
  });
});
