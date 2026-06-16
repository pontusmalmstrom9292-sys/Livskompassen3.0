/**
 * Smoke: Vävaren HITL approve/reject pipeline (static).
 * Usage: npm run smoke:weaver-hitl
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function mustInclude(relPath, ...needles) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  const text = readFileSync(full, 'utf8');
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function main() {
  console.log('[smoke:weaver-hitl] Vävaren HITL wiring…');

  mustInclude('functions/src/callables/agents.ts', 'weaveJournalEntry', 'approveWeaverMetadata', 'rejectWeaverMetadata');
  mustInclude('functions/src/lib/weaverPending.ts', 'weaver_pending', 'approveWeaverPending');
  mustInclude('firestore.rules', 'match /weaver_pending/{docId}');
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/WeaverApprovalPanel.tsx',
    'approveWeaverMetadata',
    'rejectWeaverMetadata',
  );
  mustInclude('functions/src/agents/weaverAgent.ts', 'VÄVAREN_SYSTEM_PROMPT');

  console.log('\n[smoke:weaver-hitl] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:weaver-hitl] FAIL:', err.message ?? err);
  process.exit(1);
}
