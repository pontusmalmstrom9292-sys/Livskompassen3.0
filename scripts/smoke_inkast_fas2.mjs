/**
 * Static smoke: Inkast fas 2 — Planering kö + G10 status (dirigerad/granska/avvisad).
 * Usage: npm run smoke:inkast-fas2
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

function main() {
  console.log('[smoke:inkast-fas2] Planering + status…');

  mustInclude(
    'src/modules/capture/CaptureSuperModule.tsx',
    "variant === 'planering'",
    'ReviewQueuePipelinePanel',
    'refreshToken={queueRefresh}',
  );

  mustInclude(
    'src/modules/capture/reviewQueuePipeline.ts',
    'InboxQueueDisplayStatus',
    'inboxQueueDisplayStatus',
    'inboxQueueStatusBadgeClass',
    'Status: dirigerad',
    'Status: granska',
    'draftFailedStatusLabel',
  );

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringInkorgPanel.tsx',
    'ReviewQueuePipelinePanel',
    "variant=\"capture\"",
    'planering_inkorg',
  );

  mustInclude(
    'src/modules/inkast/components/InboxReviewQueue.tsx',
    'inboxQueueDisplayStatus',
    'inboxQueueStatusBadgeClass',
    'handleDismiss',
    'handleConfirm',
  );

  mustInclude('src/index.css', 'review-queue-status--routed', 'review-queue-status--review');

  console.log('[smoke:inkast-fas2] PASS — Planering kö + G10 status.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:inkast-fas2] FAIL:', err.message ?? err);
  process.exit(1);
}
