#!/usr/bin/env node
/**
 * Synkar levande kanon till docs/external-ai/bifoga/05-research-handoff/
 * Kör: npm run research:sync:handoff
 */
import { copyFileSync, mkdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs/external-ai/bifoga/05-research-handoff');

const FILES = [
  'docs/MODUL-FUNKTIONS-REGISTER.md',
  'docs/INNEHALL-REGISTER.md',
  '.context/domän-covert-narcissism.md',
  'docs/system_sync/system_architecture_summary.md',
  'docs/external-ai/LIFE-OS-BUILD-STATE.md',
  'docs/evaluations/2026-06-18-fas19-leverans.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.1.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.2.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.3.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.4.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.5.md',
  'docs/external-ai/imports/gap-matrix-2026-06-18.md',
];

const README = `# Research handoff — bifoga till Gemini Deep Research

**Datum:** 2026-06-18 · **Syfte:** Kontext för SYSTEM-AUDIT-MASTER + SA-1..10

**Uppdatera:** \`npm run research:sync:handoff\`

## Filer i denna mapp

| Fil | Roll |
|-----|------|
| \`MODUL-FUNKTIONS-REGISTER.md\` | Modul → route → callable |
| \`INNEHALL-REGISTER.md\` | content_class, banker, kuratorer |
| \`gap-matrix-2026-06-18.md\` | KEEP / DEFER / REJECT + backend_impact |
| \`domän-covert-narcissism.md\` | HCF-lins, upload-prior ~80% |
| \`LIFE-OS-BUILD-STATE.md\` | LOCK / DEFER levande sanning |
| \`system_architecture_summary.md\` | Systemöversikt |
| \`2026-06-18-fas19-*.md\` | Fas 19 sprint leverans + vågar |
| \`KANON-PASTE.txt\` | Kort kanon — läs först |

## Körning

1. Bifoga **hela mappen** till Gemini Deep Research
2. Klistra \`GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md\` (eller SA1–SA10)
3. Spara svar → \`docs/external-ai/imports/research-2026-06-18-*.md\`
4. Cursor: \`CURSOR-FLOW-CREDITS-SYNTHESIS.md\`
`;

function main() {
  mkdirSync(outDir, { recursive: true });
  const synced = [];
  const missing = [];

  for (const relPath of FILES) {
    const src = join(root, relPath);
    const base = relPath.split('/').pop();
    const dest = join(outDir, base);
    try {
      statSync(src);
      copyFileSync(src, dest);
      synced.push({ src: relPath, dest: `docs/external-ai/bifoga/05-research-handoff/${base}` });
    } catch {
      missing.push(relPath);
    }
  }

  writeFileSync(join(outDir, 'README.md'), README, 'utf8');
  synced.push({ src: '(generated)', dest: 'docs/external-ai/bifoga/05-research-handoff/README.md' });

  const staleGap = join(outDir, 'gap-matrix-2026-06-16.md');
  try {
    unlinkSync(staleGap);
    console.log('[research:sync:handoff] Tog bort föråldrad gap-matrix-2026-06-16.md');
  } catch {
    // already absent
  }

  const stamp = new Date().toISOString();
  writeFileSync(
    join(outDir, 'SYNC-STAMP.txt'),
    `Senast synkad: ${stamp}\nKommando: npm run research:sync:handoff\n`,
  );

  console.log('[research:sync:handoff] Synkade', synced.length, 'filer');
  for (const row of synced) {
    console.log('  ', row.dest);
  }
  if (missing.length) {
    console.warn('[research:sync:handoff] Saknade källor:');
    for (const p of missing) console.warn('  ', p);
    process.exitCode = 1;
  }
}

main();
