import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { routeFromDcap } from '../agents/cards';
import {
  heuristicInboxClassify,
  parseClassificationJson,
} from '../lib/inboxClassifier';

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

  // Band boundary tests — exact threshold values
  it('routes exact score 70 to ALERT band (boundary)', () => {
    const route = routeFromDcap(70, 'NONE');
    assert.equal(route.intent, 'generateGreyRockResponse');
    assert.equal(route.executorId, 'agent_grans_arkitekten');
  });

  it('routes score 69 with NONE to analyzeCommunication band', () => {
    const route = routeFromDcap(69, 'NONE');
    assert.equal(route.intent, 'analyzeCommunication');
    assert.equal(route.executorId, 'agent_grans_arkitekten');
  });

  it('routes exact score 50 to analyzeCommunication band (boundary)', () => {
    const route = routeFromDcap(50, 'NONE');
    assert.equal(route.intent, 'analyzeCommunication');
  });

  it('routes score 49 with NONE to mirrorFeeling band', () => {
    const route = routeFromDcap(49, 'NONE');
    assert.equal(route.intent, 'mirrorFeeling');
    assert.equal(route.executorId, 'agent_livs_arkivarien');
  });

  it('routes exact score 30 with NONE to mirrorFeeling band (boundary)', () => {
    const route = routeFromDcap(30, 'NONE');
    assert.equal(route.intent, 'mirrorFeeling');
  });

  it('routes score 29 with NONE to searchKampspar band', () => {
    const route = routeFromDcap(29, 'NONE');
    assert.equal(route.intent, 'searchKampspar');
    assert.equal(route.executorId, 'agent_livs_arkivarien');
  });

  it('score >= 70 overrides NONE action to ALERT band', () => {
    const route = routeFromDcap(70, 'NONE');
    assert.equal(route.intent, 'generateGreyRockResponse');
  });

  it('COACHING action with low score routes to mirrorFeeling', () => {
    const route = routeFromDcap(5, 'COACHING');
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

  it('parseClassificationJson returns null for invalid JSON', () => {
    const parsed = parseClassificationJson('{not valid json}');
    assert.equal(parsed, null);
  });

  it('parseClassificationJson returns null for unknown routing value', () => {
    const parsed = parseClassificationJson(
      JSON.stringify({
        routing: 'okänd_routing',
        tags: [],
        category: 'test',
        confidence: 0.8,
        summary: 'ok',
        traumaSensitive: false,
        rationale: '',
      }),
    );
    assert.equal(parsed, null);
  });

  it('parseClassificationJson clamps confidence above 1 to 1', () => {
    const parsed = parseClassificationJson(
      JSON.stringify({
        routing: 'kunskap',
        tags: [],
        category: 'test',
        confidence: 1.5,
        summary: 'ok',
        traumaSensitive: false,
        rationale: '',
      }),
    );
    assert.ok(parsed);
    assert.equal(parsed?.confidence, 1);
  });

  it('parseClassificationJson clamps confidence below 0 to 0', () => {
    const parsed = parseClassificationJson(
      JSON.stringify({
        routing: 'bevis',
        tags: [],
        category: 'test',
        confidence: -0.2,
        summary: 'ok',
        traumaSensitive: false,
        rationale: '',
      }),
    );
    assert.ok(parsed);
    assert.equal(parsed?.confidence, 0);
  });

  it('parseClassificationJson preserves traumaSensitive: true', () => {
    const parsed = parseClassificationJson(
      JSON.stringify({
        routing: 'review',
        tags: ['trauma'],
        category: 'kris',
        confidence: 0.95,
        summary: 'trauma',
        traumaSensitive: true,
        rationale: 'lvu',
      }),
    );
    assert.ok(parsed);
    assert.equal(parsed?.traumaSensitive, true);
  });

  it('heuristicInboxClassify detects barnen routing from Familjen sourceModule', () => {
    const result = heuristicInboxClassify('[sourcemodule:familjen] Kasper verkade trött', 'obs.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'barnen');
  });

  it('heuristicInboxClassify routes LVU keyword to review with traumaSensitive', () => {
    const result = heuristicInboxClassify('LVU-ansökan inlämnad', 'lvu.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'review');
    assert.equal(result?.traumaSensitive, true);
  });

  it('heuristicInboxClassify routes sourcemodule:hamn to bevis', () => {
    const result = heuristicInboxClassify('[sourcemodule:hamn] meddelande', 'msg.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'bevis');
  });

  it('heuristicInboxClassify routes sourcemodule:valv_samla to bevis', () => {
    const result = heuristicInboxClassify('[sourcemodule:valv_samla] bevis samlat', 'doc.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'bevis');
  });

  it('heuristicInboxClassify routes sourcemodule:planering_inkorg to planning', () => {
    const result = heuristicInboxClassify('[sourcemodule:planering_inkorg] ny uppgift', 'task.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'planning');
  });

  it('heuristicInboxClassify routes sourcemodule:mabra_inkast to dagbok', () => {
    const result = heuristicInboxClassify('[sourcemodule:mabra_inkast] kände mig trött', 'mabra.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'dagbok');
  });

  it('heuristicInboxClassify routes widget_recording without child obs to bevis', () => {
    const result = heuristicInboxClassify('[sourcemodule:widget_recording] inspelning', 'audio.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'bevis');
  });

  it('heuristicInboxClassify routes widget_recording with Arvid observation to barnen', () => {
    // Uses "observation" (ASCII keyword) to reliably trigger the barnen path.
    const result = heuristicInboxClassify(
      '[sourcemodule:widget_recording] Arvid hade en observation',
      'arvid.txt',
    );
    assert.ok(result);
    assert.equal(result?.routing, 'barnen');
    assert.equal(result?.childAlias, 'Arvid');
  });

  it('heuristicInboxClassify routes darvo (covert HCF) to bevis', () => {
    const result = heuristicInboxClassify('DARVO-beteende tydligt i kommunikationen', 'hcf.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'bevis');
  });

  it('heuristicInboxClassify routes bbic artikel to kunskap', () => {
    const result = heuristicInboxClassify('BBIC-metoden handbok', 'bbic.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'kunskap');
  });

  it('heuristicInboxClassify routes Kasper sov-observation to barnen with alias', () => {
    const result = heuristicInboxClassify('Kasper sov dåligt i natt', 'kasper.txt');
    assert.ok(result);
    assert.equal(result?.routing, 'barnen');
    assert.equal(result?.childAlias, 'Kasper');
  });

  it('heuristicInboxClassify returns null for unrecognized content', () => {
    const result = heuristicInboxClassify('Vanlig text utan matchning', 'random.txt');
    assert.equal(result, null);
  });
});
