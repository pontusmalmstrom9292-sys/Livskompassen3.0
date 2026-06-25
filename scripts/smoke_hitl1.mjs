/**
 * Smoke: HITL1 — unified preview (inkast först)
 * Usage: npm run smoke:hitl1
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readCanonical(relativePath) {
  const full = resolve(root, relativePath);
  assert(existsSync(full), `Saknar fil: ${relativePath}`);
  return readFileSync(full, 'utf8');
}

const preview = readCanonical('src/modules/inkast/components/UnifiedHitlPreview.tsx');
assert(preview.includes('Godkänn'), 'UnifiedHitlPreview saknar Godkänn');
assert(preview.includes('Ändra'), 'UnifiedHitlPreview saknar Ändra');
assert(preview.includes('Avvisa'), 'UnifiedHitlPreview saknar Avvisa');

const confirm = readCanonical('src/modules/inkast/components/InkastConfirmPanel.tsx');
assert(confirm.includes('UnifiedHitlPreview'), 'InkastConfirmPanel ska använda UnifiedHitlPreview');

const queue = readCanonical('src/modules/inkast/components/InboxReviewQueue.tsx');
assert(queue.includes('UnifiedHitlPreview'), 'InboxReviewQueue ska använda UnifiedHitlPreview');
assert(queue.includes('editingId'), 'InboxReviewQueue saknar Ändra-läge');

console.log('[smoke:hitl1] PASS');
