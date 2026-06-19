/**
 * Smoke: evolution_ledger discovery milestones + hub dual-write (Fas 19.5).
 * Usage: npm run smoke:evolution-discovery
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
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
  mustInclude(
    'src/modules/core/firebase/evolutionLedgerFirestore.ts',
    'recordDiscoveryMilestoneIfNew',
    'recordDiscoveryMilestone',
    'mergeEvolutionHub',
  );
  mustInclude(
    'src/modules/core/store/useEvolutionStore.ts',
    'evolution_ledger: server-only',
  );
  mustNotInclude(
    'src/modules/core/store/useEvolutionStore.ts',
    'syncEvolutionHubToLedger',
  );
  mustInclude(
    'functions/src/triggers/onEvolutionHubWrite.ts',
    'onEvolutionHubWrite',
    'syncEvolutionHubToLedgerServer',
  );
  mustInclude(
    'functions/src/callables/evolutionLedger.ts',
    'recordDiscoveryMilestone',
  );
  mustInclude(
    'firestore.rules',
    'match /evolution_ledger/{docId}',
    'allow create: if false',
    'allow update, delete: if false',
  );
  mustNotInclude(
    'src/modules/core/firebase/offlineWritePolicy.ts',
    'C.evolution_ledger',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryCardFlow.tsx',
    'recordDiscoveryMilestoneIfNew',
  );
  mustNotInclude(
    'scripts/orkester_barnporten_evaluator.mjs',
    "event: 'AGE_EVALUATION'",
    'target: \'barnporten\'',
  );

  console.log('[smoke:evolution-discovery] PASS — ledger helper + hub dual-write + WORM rules.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:evolution-discovery] FAIL —', err.message || err);
  process.exit(1);
}
