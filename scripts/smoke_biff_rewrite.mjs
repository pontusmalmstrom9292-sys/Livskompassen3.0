#!/usr/bin/env node
/**
 * Statiska guards — biffRewriteDraft callable + frontend wiring.
 * Usage: npm run smoke:biff-rewrite
 */
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function read(relPath) {
  const full = resolve(root, relPath);
  if (!existsSync(full)) throw new Error(`saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    if (!text.includes(needle)) {
      throw new Error(`${relPath} saknar: ${needle}`);
    }
  }
}

function main() {
  console.log('[smoke:biff-rewrite] BIFF rewrite draft…');
  mustInclude('functions/src/index.ts', 'biffRewriteDraft');
  mustInclude('functions/src/callables/biffRewriteDraft.ts', 'BIFF_REWRITE_DRAFT_SYSTEM_PROMPT');
  mustInclude('functions/src/sharedRules.ts', 'BIFF_REWRITE_DRAFT_SYSTEM_PROMPT');
  mustInclude('src/modules/shared/ui/BiffRewriteButton.tsx', 'fetchBiffRewriteDraft');
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/ReflectionEditor.tsx',
    'BiffRewriteButton',
  );
  mustInclude('src/modules/inkast/components/InkastManualEditForm.tsx', 'BiffRewriteButton', 'context="inkast"');
  console.log('[smoke:biff-rewrite] PASS');
}

main();
