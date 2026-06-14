/**
 * Smoke: evolution_ledger discovery milestones.
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

function main() {
  mustInclude(
    'src/modules/core/firebase/evolutionLedgerFirestore.ts',
    'recordDiscoveryMilestoneIfNew',
    'milestone_unlocked',
    'kompass_discovery',
  );
  mustInclude(
    'firestore.rules',
    'match /evolution_ledger/{docId}',
    'milestone_unlocked',
  );
  mustInclude(
    'src/modules/core/firebase/offlineWritePolicy.ts',
    'evolution_ledger',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryCardFlow.tsx',
    'recordDiscoveryMilestoneIfNew',
  );

  console.log('[smoke:evolution-discovery] PASS — ledger helper + WORM rules.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:evolution-discovery] FAIL —', err.message || err);
  process.exit(1);
}
