#!/usr/bin/env node
/**
 * Smoke: pattern_scan_metadata WORM sidecar + callables wiring.
 * Usage: npm run smoke:pattern-metadata
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
  console.log('[smoke:pattern-metadata] Statiska guards…');

  mustInclude('firestore.rules', 'pattern_scan_metadata', 'allow create, update, delete: if false');
  mustInclude(
    'functions/src/lib/patternScanMetadata.ts',
    'PATTERN_SCAN_METADATA_COLLECTION',
    'writePatternScanMetadata',
    'rescanAllVaultPatternMetadata',
    'patternIdsHash',
  );
  mustInclude(
    'functions/src/triggers/patternScanOnVaultCreate.ts',
    'onVaultCreatePatternScan',
    'writePatternScanMetadata',
    'vävaren_metadata',
  );
  mustInclude(
    'functions/src/callables/valv.ts',
    'rescanPatternMetadata',
    'writePatternScanMetadataCallable',
  );
  mustInclude(
    'functions/src/index.ts',
    'onVaultCreatePatternScan',
    'rescanPatternMetadata',
    'writePatternScanMetadataCallable',
  );
  mustInclude(
    'src/modules/core/types/firestore.ts',
    "pattern_scan_metadata: 'pattern_scan_metadata'",
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultMonsterPanel.tsx',
    'Skanna om',
    'usePatternScanMetadata',
  );

  console.log('[smoke:pattern-metadata] PASS');
}

main();
