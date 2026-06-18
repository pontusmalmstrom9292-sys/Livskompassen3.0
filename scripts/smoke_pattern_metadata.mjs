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
    'assistFlowPatternMetadataForSource',
    'patternIdsHash',
    "'FLOW'",
  );
  mustInclude(
    'functions/src/lib/patternMetadataAssist.ts',
    'suggestPatternIdsViaLlm',
    'dcapGatePatternAssist',
    'PATTERN_ASSIST_SYSTEM',
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
    'assistPatternMetadata',
    'writePatternScanMetadataCallable',
    'assertRateLimit',
    'ASSIST_PATTERN_METADATA_WINDOW_MS',
  );
  mustInclude(
    'functions/src/index.ts',
    'onVaultCreatePatternScan',
    'rescanPatternMetadata',
    'assistPatternMetadata',
    'writePatternScanMetadataCallable',
  );
  mustInclude(
    'src/modules/core/types/firestore.ts',
    "pattern_scan_metadata: 'pattern_scan_metadata'",
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultMonsterPanel.tsx',
    'Skanna om',
    'Flow-assist',
    'usePatternScanMetadata',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/api/patternScanService.ts',
    'assistPatternMetadata',
  );

  console.log('[smoke:pattern-metadata] PASS');
}

main();
