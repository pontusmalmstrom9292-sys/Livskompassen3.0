import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { routeFromDcap } from '../agents/cards';
import { heuristicInboxClassify, parseClassificationJson } from '../lib/inboxClassifier';

describe('routeFromDcap', () => {
  it('routes ALERT band to Gräns-Arkitekten grey rock', () => {
    const route = routeFromDcap(85, 'ALERT');
    assert.equal(route.intent, 'generateGreyRockResponse');
    assert.equal(route.executorId, 'agent_grans_arkitekten');
  });

  it('routes low risk to Livs-Arkivarien kampspar search', () => {
    const route = routeFromDcap(10, 'NONE');
    assert.equal(route.intent, 'searchKampspar');
    assert.equal(route.executorId, 'agent_livs_arkivarien');
  });

  it('routes COACHING band to Speglings coach mirror', () => {
    const route = routeFromDcap(15, 'COACHING');
    assert.equal(route.intent, 'mirrorFeeling');
  });
});

describe('inboxClassifier (pure helpers)', () => {
  it('parseClassificationJson normalizes planering alias', () => {
    const parsed = parseClassificationJson(
      JSON.stringify({
        routing: 'planering',
        tags: [],
        category: 'test',
        confidence: 0.9,
        summary: 'ok',
        traumaSensitive: false,
        rationale: '',
      }),
    );
    assert.ok(parsed);
    assert.equal(parsed?.routing, 'planning');
  });

  it('heuristicInboxClassify detects barnen routing from Familjen sourceModule', () => {
    const result = heuristicInboxClassify('[sourcemodule:familjen] Kasper verkade trött', 'obs.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'barnen');
  });
});
