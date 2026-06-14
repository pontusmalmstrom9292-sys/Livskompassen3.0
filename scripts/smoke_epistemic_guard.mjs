#!/usr/bin/env node
/**
 * Smoke: Hamn epistemicGuard resolver (unit-style, no deploy).
 * Usage: npm run smoke:epistemic-guard
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

function main() {
  console.log('[smoke:epistemic-guard] Statiska guards…');

  mustInclude(
    'functions/src/lib/epistemicGuard.ts',
    'resolveHamnTheoryWithoutEvidence',
    'hasGroundedCleanFact',
    'hasDcapObservationInMessage',
    'META_THEORY_INPUT',
  );
  mustInclude(
    'functions/src/sharedRules.ts',
    'GRANS_EPISTEMIC_GUARD_RULES',
    'theoryWithoutEvidence',
  );
  mustInclude(
    'functions/src/agents/kompis-supervisor.ts',
    'resolveHamnTheoryWithoutEvidence',
    'theoryWithoutEvidence',
  );
  mustInclude(
    'functions/src/agents/gransArkitektenAgent.ts',
    'theoryWithoutEvidence',
  );

  const guard = read('functions/src/lib/epistemicGuard.ts');
  assert(!guard.includes('reality_vault'), 'Hamn guard får inte läsa reality_vault');

  console.log('[smoke:epistemic-guard] PASS');
}

main();
