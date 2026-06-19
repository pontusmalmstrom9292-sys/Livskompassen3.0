#!/usr/bin/env node
/**
 * Smoke: DCAP routing före LLM — deterministisk executor/silo (U2).
 * Usage: npm run smoke:dcap-routing
 */
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function mustNotInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(!text.includes(needle), `${relPath} får inte innehålla: ${needle}`);
  }
}

function main() {
  console.log('[smoke:dcap-routing] DCAP → executor kedja…');

  mustInclude(
    'functions/src/agents/cards/index.ts',
    'export function routeFromDcap',
    'export function resolveExecutorId',
  );
  mustInclude(
    'functions/src/agents/kompis-supervisor.ts',
    'routeFromDcap',
    'analyzeDcap',
  );
  mustInclude(
    'functions/src/lib/inboxClassifier.ts',
    'classifyInboxDocument',
    'INKAST_CONFIDENCE_THRESHOLD',
  );
  mustInclude('functions/src/lib/inkastConstants.ts', 'INKAST_CONFIDENCE_THRESHOLD');

  const agentsCallable = read('functions/src/callables/agents.ts');
  assert(
    agentsCallable.includes('const ragContext: string[] = []'),
    'analyzeMessage måste ignorera klient ragContext (tom array)',
  );
  assert(
    !agentsCallable.includes('request.data.ragContext ??'),
    'analyzeMessage får inte passera klient ragContext till supervisor',
  );

  const knowledgeAgent = read('functions/src/agents/knowledgeVaultAgent.ts');
  assert(
    knowledgeAgent.includes('loadKunskapEntityBundle'),
    'knowledgeVaultAgent måste använda loadKunskapEntityBundle (ej full Valv-kontext)',
  );
  mustNotInclude(
    'functions/src/agents/knowledgeVaultAgent.ts',
    'loadEntityProfileBundle',
  );

  console.log('[smoke:dcap-routing] PASS');
}

main();
