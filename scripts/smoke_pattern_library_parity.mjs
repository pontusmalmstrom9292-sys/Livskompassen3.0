#!/usr/bin/env node
/**
 * Smoke: tacticPatternLibrary parity — shared source + functions re-export.
 * Usage: npm run smoke:pattern-library
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

function extractVersion(text) {
  const m = text.match(/TACTIC_LIBRARY_VERSION\s*=\s*['"]([^'"]+)['"]/);
  return m?.[1] ?? null;
}

function countPatternIds(text) {
  return (text.match(/id:\s*'cn-/g) ?? []).length;
}

function main() {
  console.log('[smoke:pattern-library] Parity guards…');

  const sharedPath = 'shared/patterns/tacticPatternLibrary.ts';
  const fnReexport = 'functions/src/lib/tacticPatternLibrary.ts';
  const clientReexport = 'src/modules/shared/patterns/tacticPatternLibrary.ts';
  const vaultScan = 'src/modules/features/lifeJournal/evidence/vault/utils/vaultPatternScan.ts';
  const dcap = 'functions/src/agents/DCAP.ts';

  const shared = read(sharedPath);
  const fnText = read(fnReexport);
  const clientText = read(clientReexport);

  assert(fnText.includes("from '../../../shared/patterns/tacticPatternLibrary'"), 'functions re-export saknas');
  assert(
    clientText.includes("from '../../../../shared/patterns/tacticPatternLibrary'"),
    'client re-export saknas',
  );

  const version = extractVersion(shared);
  assert(version, 'TACTIC_LIBRARY_VERSION saknas i shared');
  assert(fnText.includes('shared/patterns/tacticPatternLibrary'), 'functions re-export pekar inte på shared');
  assert(clientText.includes('shared/patterns/tacticPatternLibrary'), 'client re-export pekar inte på shared');

  const patternCount = countPatternIds(shared);
  assert(patternCount >= 15, `förväntar ≥15 mönster, fick ${patternCount}`);

  for (const file of [vaultScan, dcap]) {
    const text = read(file);
    assert(text.includes('tacticPatternLibrary'), `${file} använder inte library`);
    assert(!text.includes('cn-darvo-001') || text.includes('tacticPatternLibrary'), `${file} har hårdkodade duplicat`);
  }

  const golden = 'Du är alltid så känslig. Du hittar på allting.';
  const defs = [...shared.matchAll(/pattern:\s*'([^']+)'/g)].map((m) => m[1]);
  const hits = defs.filter((p) => {
    try {
      return new RegExp(p, 'i').test(golden);
    } catch {
      return false;
    }
  });
  assert(hits.length >= 2, 'golden fixture ska träffa minst 2 mönster');

  console.log(`[smoke:pattern-library] version=${version} patterns=${patternCount} goldenHits=${hits.length}`);
  console.log('[smoke:pattern-library] PASS');
}

main();
