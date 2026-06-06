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
  {
    from: 'exports/gemini-handoff/repomix/gemini-pack-konsolidering.md',
    to: 'gemini-pack-konsolidering.md',
  },
  { from: 'docs/specs/ai-prompts-moduler-master.md', to: 'ai-prompts-moduler-master.md' },
  { from: 'docs/INNEHALL-REGISTER.md', to: 'INNEHALL-REGISTER.md' },
  { from: '.context/arkiv-minne.md', to: 'arkiv-minne.md' },
  {
    from: 'docs/evaluations/2026-05-29-dagbok-vertex-plan.md',
    to: 'dagbok-vertex-plan.md',
  },
  { from: 'docs/design/KOMPASS-MODUL-SPEC.md', to: 'KOMPASS-MODUL-SPEC.md' },
  { from: 'docs/design/references/MENU-DRAWER-KANON.md', to: 'MENU-DRAWER-KANON.md' },
  { from: 'docs/design/VALV-HUBB-SPEC.md', to: 'VALV-HUBB-SPEC.md' },
  { from: 'docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md', to: 'kompass-widget-plan.md' },
  { from: 'docs/google-ai-pro/PROMPTS.md', to: 'GEMINI-PROMPTS.md' },
  { from: '.context/locked-ux-features.md', to: 'locked-ux-features.md' },
  { from: 'docs/gemini-handoff/README.md', to: 'gemini-handoff-README.md' },
  { from: 'docs/gemini-handoff/K1-compassWidgetCatalog.md', to: 'K1-compassWidgetCatalog.md' },
  { from: 'docs/gemini-handoff/V1-gemini-original-2026-05-31.md', to: 'V1-gemini-original-2026-05-31.md' },
  { from: 'docs/gemini-handoff/V2-valv-gap-notebooklm.md', to: 'V2-valv-gap-notebooklm.md' },
];

const DRIVE_PACK = [
  {
    from: 'exports/gemini-handoff/repomix/gemini-pack-konsolidering.md',
    to: 'Livskompassen/repomix/gemini-pack-konsolidering.md',
  },
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
  { from: 'docs/design/KOMPASS-MODUL-SPEC.md', to: 'Livskompassen/design-export/KOMPASS-MODUL-SPEC.md' },
  { from: 'docs/design/VALV-HUBB-SPEC.md', to: 'Livskompassen/design-export/VALV-HUBB-SPEC.md' },
  { from: 'docs/google-ai-pro/PROMPTS.md', to: 'Livskompassen/specs/GEMINI-PROMPTS.md' },
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
