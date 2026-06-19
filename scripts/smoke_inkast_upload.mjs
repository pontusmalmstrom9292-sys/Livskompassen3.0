/**
 * Smoke: Inkast upload wiring — Storage onFinalize + Valv compact path (static).
 * Usage: npm run smoke:inkast-upload
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
  console.log('[smoke:inkast-upload] Storage trigger + Valv compact…');

  mustInclude('functions/src/index.ts', 'onInkastEvidenceFinalized');
  mustInclude(
    'functions/src/triggers/inkastStorageOnFinalize.ts',
    'onInkastEvidenceFinalized',
    'routeInboxToWorm',
  );
  mustInclude(
    'src/modules/capture/CaptureSuperModule.tsx',
    "variant === 'valv-compact'",
    'InkastDirectPanel',
    "sourceModule={SOURCE_MODULE['valv-compact']}",
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultInkastCompact.tsx',
    'CaptureSuperModule',
    'valv-compact',
  );
  mustInclude('src/modules/capture/InkastDirectPanel.tsx', 'submitInkastLite', 'base64Files');
  mustInclude('functions/src/lib/submitInkastLite.ts', 'routeInboxToWorm');

  mustInclude(
    'src/modules/capture/CaptureSuperModule.tsx',
    'useCaptureOfflineFlush',
  );
  mustInclude('src/modules/capture/captureDraftSync.ts', 'flushCaptureDraftQueue', 'retryCaptureDraft');
  mustInclude('src/modules/capture/components/CalmBreathingCircle.tsx', 'calm-breath-circle');
  mustInclude(
    'src/modules/capture/ReviewQueuePipelinePanel.tsx',
    "listDraftsByStatus('pending')",
    'retryCaptureDraft',
    'CalmBreathingCircle',
  );
  mustInclude('src/modules/capture/InkastDirectPanel.tsx', 'CalmBreathingCircle');
  mustInclude('src/index.css', 'calm-breath-box');

  console.log('\n[smoke:inkast-upload] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:inkast-upload] FAIL:', err.message ?? err);
  process.exit(1);
}
