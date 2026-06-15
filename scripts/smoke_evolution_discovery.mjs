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
    'syncEvolutionHubToLedger',
    'recordPillarCapacityIncreases',
    'recordFeatureUnlocks',
    'recordChildAgeMilestones',
    'recordBarnportenLevelIncrease',
    'recordUnlockedPackChanges',
    'mergeEvolutionHub',
    'milestone_unlocked',
    'kompass_discovery',
  );
  mustInclude(
    'src/modules/core/store/useEvolutionStore.ts',
    'syncEvolutionHubToLedger',
    'hubLedgerFingerprint',
  );
  mustInclude(
    'shared/evolution/evolutionHubLedgerSync.ts',
    'hubLedgerFingerprint',
    'collectLedgerEntriesFromHubDiff',
    'ledgerEntryDedupKey',
  );
  mustInclude(
    'functions/src/triggers/onEvolutionHubWrite.ts',
    'onEvolutionHubWrite',
    'syncEvolutionHubToLedgerServer',
    'evolution_hub/{uid}',
  );
  mustInclude(
    'functions/src/index.ts',
    'onEvolutionHubWrite',
  );
  mustInclude(
    'src/modules/oracle/services/OracleService.ts',
    'USER_DAILY_FOCUS_COLLECTION',
    'daily_intentions',
  );
  mustInclude(
    'src/modules/core/hooks/useEvolutionSync.ts',
    'useEvolutionStore',
    'userId: user.uid',
  );
  mustInclude(
    'firestore.rules',
    'match /evolution_ledger/{docId}',
    'milestone_unlocked',
    'allow update, delete: if false',
  );
  mustInclude(
    'src/modules/core/firebase/offlineWritePolicy.ts',
    'evolution_ledger',
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
