/**
 * Static smoke: plausible deniability — dagbok/valv-skiljelinje, private_child, Fyren.
 * Usage: npm run smoke:plausible-deniability
 */
import { readFileSync, existsSync } from 'fs';
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
  console.log('[smoke:plausible-deniability] Fyren + separata silos…');
  mustInclude('src/modules/core/navigation/navFlags.ts', 'HIDE_BEVIS_TAB');
  mustInclude('src/modules/core/navigation/navTruth.ts', 'VALVET', 'HJARTAT');
  mustInclude('src/modules/core/auth/valvFyrenGate.ts', 'openValvViaFyren', 'authenticateVaultGate');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'NAV_PATHS.VALVET', 'NAV_PATHS.HJARTAT');

  console.log('[smoke:plausible-deniability] Handoff utan auto-sync…');
  mustInclude('src/modules/features/lifeJournal/diary/diary/components/HandoffBox.tsx', 'vaultHandoffText');
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/hooks/useJournalFlow.ts',
    'weaveJournalEntry',
  );
  mustNotInclude(
    'src/modules/features/lifeJournal/diary/diary/hooks/useJournalFlow.ts',
    'saveVaultLog',
    'reality_vault',
  );

  console.log('[smoke:plausible-deniability] private_child Firestore + filter…');
  mustInclude('firestore.rules', 'private_child', 'isParentVisibleChildLog');
  mustInclude('src/modules/core/firebase/firestore.ts', "visibility !== 'private_child'", 'private_child');

  console.log('[smoke:plausible-deniability] Valv-session gate på bevis-routing…');
  mustInclude('functions/src/callables/valv.ts', 'assertVaultSession');
  mustInclude('functions/src/callables/agents.ts', 'assertVaultSession', 'approveWeaverMetadata');
  mustInclude('functions/src/callables/inbox.ts', "routing === 'bevis'", 'assertVaultSession');

  console.log('[smoke:plausible-deniability] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:plausible-deniability] FAIL:', err.message ?? err);
  process.exit(1);
}
