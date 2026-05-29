#!/usr/bin/env node
/**
 * Packar källor för NotebookLM + Google Drive (Google AI Pro-plan).
 * Kör: npm run google-ai-pro:pack
 */
import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const NOTEBOOKLM_SOURCES = [
  { from: 'repomix-dagbok.txt', to: 'repomix-dagbok.txt' },
  { from: 'docs/specs/ai-prompts-moduler-master.md', to: 'ai-prompts-moduler-master.md' },
  { from: 'docs/INNEHALL-REGISTER.md', to: 'INNEHALL-REGISTER.md' },
  { from: '.context/arkiv-minne.md', to: 'arkiv-minne.md' },
  {
    from: 'docs/evaluations/2026-05-29-dagbok-vertex-plan.md',
    to: 'dagbok-vertex-plan.md',
  },
];

const DRIVE_PACK = [
  { from: 'repomix-dagbok.txt', to: 'Livskompassen/repomix/repomix-dagbok.txt' },
  {
    from: 'docs/specs/ai-prompts-moduler-master.md',
    to: 'Livskompassen/specs/ai-prompts-moduler-master.md',
  },
  { from: 'docs/INNEHALL-REGISTER.md', to: 'Livskompassen/specs/INNEHALL-REGISTER.md' },
  {
    from: 'docs/evaluations/2026-05-29-dagbok-vertex-plan.md',
    to: 'Livskompassen/evaluations/dagbok-vertex-plan.md',
  },
  { from: 'docs/design/DESIGN-LATHUND.md', to: 'Livskompassen/design-export/DESIGN-LATHUND.md' },
];

function copyMapped(pairs, baseDir) {
  for (const { from, to } of pairs) {
    const src = join(root, from);
    const dest = join(baseDir, to);
    if (!existsSync(src)) {
      console.warn(`[skip] saknas: ${from}`);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest);
    console.log(`[ok] ${from} → ${to}`);
  }
}

const notebooklmDir = join(root, 'exports/google-ai-pro/notebooklm');
const driveDir = join(root, 'exports/google-ai-pro/drive-pack');

rmSync(notebooklmDir, { recursive: true, force: true });
rmSync(driveDir, { recursive: true, force: true });
mkdirSync(notebooklmDir, { recursive: true });
mkdirSync(driveDir, { recursive: true });

console.log('=== NotebookLM pack ===');
copyMapped(NOTEBOOKLM_SOURCES, notebooklmDir);

console.log('\n=== Drive pack (dra mappen till drive.google.com) ===');
copyMapped(DRIVE_PACK, driveDir);

for (const sub of ['content-banks', 'evaluations', 'specs', 'repomix', 'design-export']) {
  mkdirSync(join(driveDir, 'Livskompassen', sub), { recursive: true });
}

console.log('\nKlart.');
console.log(`NotebookLM: ${notebooklmDir}`);
console.log(`Drive:      ${join(driveDir, 'Livskompassen')}`);
