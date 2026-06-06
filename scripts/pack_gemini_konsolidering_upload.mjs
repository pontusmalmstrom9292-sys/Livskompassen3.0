#!/usr/bin/env node
/**
 * Handoff-mapp för Gemini: upload/inkast-konsolidering (hela appen).
 * Kör: npm run gemini:pack:konsolidering
 * Kräver att gemini:pack redan körts (gemini-pack-konsolidering.md).
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repomixSrc = join(root, 'exports/gemini-handoff/repomix/gemini-pack-konsolidering.md');
const uploadDir = join(root, 'exports/gemini-handoff/konsolidering-upload');

const UPLOAD_SOURCES = [
  { from: 'docs/gemini-handoff/K1-upload-konsolidering-PROMPT.md', to: '01-K1-upload-konsolidering-PROMPT.md' },
  { from: 'docs/google-ai-pro/PROMPTS.md', to: '02-master-prompt-ref.md' },
  { from: '.context/locked-ux-features.md', to: '03-locked-ux-features.md' },
  { from: 'docs/evaluations/2026-06-06-inkast-lockdown.md', to: '04-inkast-lockdown.md' },
  { from: 'docs/evaluations/2026-05-29-valv-samla-cursor-plan.md', to: '05-valv-samla-plan.md' },
  { from: 'docs/MODUL-GAP-OVERSIKT.md', to: '06-modul-gap.md' },
];

if (!existsSync(repomixSrc)) {
  console.error('[fail] Saknar repomix. Kör först: npm run gemini:pack');
  process.exit(1);
}

rmSync(uploadDir, { recursive: true, force: true });
mkdirSync(uploadDir, { recursive: true });

cpSync(repomixSrc, join(uploadDir, '00-gemini-pack-konsolidering.md'));
console.log('[ok] 00-gemini-pack-konsolidering.md');

for (const { from, to } of UPLOAD_SOURCES) {
  const src = join(root, from);
  if (!existsSync(src)) {
    console.warn(`[skip] saknas: ${from}`);
    continue;
  }
  cpSync(src, join(uploadDir, to));
  console.log(`[ok] ${to}`);
}

writeFileSync(
  join(uploadDir, 'LÄS-MIG.txt'),
  `Upload-konsolidering → Gemini (Livskompassen v2)
==============================================

1. Öppna gemini.google.com — ny chatt.
2. Klistra in master-prompt från 02-master-prompt-ref.md (första blocket).
3. Bifoga ELLER klistra in 00-gemini-pack-konsolidering.md (hela filen).
4. Klistra in uppdraget från 01-K1-upload-konsolidering-PROMPT.md.
5. Spara Geminis svar som docs/gemini-handoff/K1-upload-konsolidering-svar.md
   och klistra tillbaka i Cursor för implementation.

Mapp: ${uploadDir}
Genererad: ${new Date().toISOString()}
`,
);

console.log(`\nKlart.\n  Upload: ${uploadDir}\n`);
