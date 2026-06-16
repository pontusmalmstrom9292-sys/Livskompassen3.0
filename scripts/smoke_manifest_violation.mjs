/**
 * Smoke: Master Integration Manifest guards — isolated violation probes.
 * No Firebase, no production data touched.
 *
 * Usage: npm run smoke:manifest
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  createArchitectureWriteAssert,
  expectManifestViolation,
  loadManifestGuards,
  simulateCrossSiloAccess,
  simulateVaultServiceWormUpdate,
} from './lib/manifestViolationHarness.mjs';

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

function runStaticWiringChecks() {
  console.log('[smoke:manifest] Static wiring — firestore + VaultService guards...');
  mustInclude(
    'src/modules/core/firebase/firestore.ts',
    'assertArchitectureWrite',
    'assertWorm',
    'assertSiloIsolation',
    'Architecture Violation',
    'guardedUpdateDoc',
    'guardedDeleteDoc',
  );
  mustInclude(
    'src/modules/core/firebase/VaultService.ts',
    'assertArchitectureWrite',
    'reality_vault',
  );
  mustInclude(
    'src/modules/core/firebase/emotionalMemoryFirestore.ts',
    'assertArchitectureWrite',
    'EMOTIONAL_MEMORY_WORM_KEYS',
    'emotional_memory',
  );
  mustInclude(
    'src/modules/core/manifest/manifestGuards.ts',
    'assertWorm',
    'assertSiloIsolation',
    'ManifestViolationError',
  );
  mustInclude(
    'src/modules/core/manifest/masterManifest.ts',
    'allowedCrossReads: []',
    'reality_vault',
    'children_logs',
  );
  mustInclude('functions/src/adk/registry.ts', 'assertBackendCollectionAccess', 'assertBackendSiloIsolation');
  mustInclude('functions/src/adk/orchestrator.ts', 'enforceManifestPolicy', 'assertBackendSiloIsolation');
}

function runManifestSiloIsolationSmoke(guards) {
  console.log('[smoke:manifest] U1 — silo-isolated domains must have empty allowedCrossReads...');
  const errors = guards.validateSiloIsolationManifest();
  assert(
    errors.length === 0,
    `validateSiloIsolationManifest failed: ${errors.join('; ')}`,
  );
  console.log('[smoke:manifest] validateSiloIsolationManifest: OK (K/V/F)');
}

function runRulesAlignmentSmoke(guards) {
  console.log('[smoke:manifest] Manifest ↔ firestore.rules WORM alignment (sample)...');
  const wormCollections = guards.getAllWormCollections();
  assert(Array.isArray(wormCollections) && wormCollections.length > 0, 'getAllWormCollections() tom');

  const rules = read('firestore.rules');
  const mustBeWormInRules = [
    'reality_vault',
    'children_logs',
    'journal',
    'emotional_memory',
    'evolution_ledger',
    'kampspar',
  ];

  for (const col of mustBeWormInRules) {
    assert(wormCollections.includes(col), `manifest saknar WORM: ${col}`);
    const blockRe = new RegExp(`match /${col}/\\{docId\\}[\\s\\S]*?allow update, delete: if false`);
    assert(blockRe.test(rules), `firestore.rules saknar WORM block för ${col}`);
  }
  console.log('[smoke:manifest] WORM sample alignment: OK');
}

async function runIsolatedViolationProbes(guards) {
  console.log('[smoke:manifest] Isolated runtime — guard violations (no Firestore)...');
  const assertArchitectureWrite = createArchitectureWriteAssert(guards);
  const { assertWorm, assertSiloIsolation, ManifestViolationError, isWormCollection } = guards;

  assert(isWormCollection('reality_vault'), 'reality_vault must be WORM in manifest');
  assert(!isWormCollection('economy_profiles'), 'economy_profiles must not be WORM');

  // Direct assertWorm probe
  expectManifestViolation(
    'assertWorm(reality_vault, update)',
    () => assertWorm('reality_vault', 'update'),
    { code: 'WORM_VIOLATION', messageIncludes: 'forbids update' },
  );

  // VaultService guard path — same collection chokepoint as guardedUpdateDoc
  expectManifestViolation(
    'VaultService/reality_vault WORM update (assertArchitectureWrite)',
    () => simulateVaultServiceWormUpdate(assertArchitectureWrite),
    {
      code: 'WORM_VIOLATION',
      messageIncludes: 'Architecture Violation [WORM_VIOLATION]',
    },
  );

  // Cross-silo isolation — kunskap → valv (U1 cross-RAG forbidden)
  expectManifestViolation(
    'assertSiloIsolation(kunskap → valv)',
    () => assertSiloIsolation('kunskap', 'valv'),
    { code: 'SILO_ISOLATION', messageIncludes: 'Cross-RAG forbidden' },
  );

  expectManifestViolation(
    'Cross-silo data path (kunskap → valv via assertArchitectureWrite)',
    () => simulateCrossSiloAccess(assertArchitectureWrite),
    {
      code: 'SILO_ISOLATION',
      messageIncludes: 'Architecture Violation [SILO_ISOLATION]',
    },
  );

  // Allowed path must not throw
  assertArchitectureWrite('reality_vault', 'create');
  assertArchitectureWrite('economy_profiles', 'update');
  assertArchitectureWrite('kampspar', 'create', { fromSilo: 'core', toSilo: 'kunskap' });
  console.log('[smoke:manifest] Allowed write paths: OK (no throw)');

  // Sanity: error type matches production manifest
  assert(ManifestViolationError, 'ManifestViolationError export missing');
}

async function main() {
  runStaticWiringChecks();

  const { guards, cleanup } = await loadManifestGuards();
  try {
    runManifestSiloIsolationSmoke(guards);
    runRulesAlignmentSmoke(guards);
    await runIsolatedViolationProbes(guards);
  } finally {
    cleanup();
  }

  console.log('\n[smoke:manifest] PASS — manifest guards stop violations in isolated probes.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke:manifest] FAIL —', err.message || err);
  process.exit(1);
});
