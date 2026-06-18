#!/usr/bin/env node
/**
 * Synkar exakt 10 filer till docs/external-ai/bifoga/05-research-handoff/
 * (Gemini Deep Research max 10 bifogningar.)
 * Kör: npm run research:sync:handoff
 */
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs/external-ai/bifoga/05-research-handoff');

const KANON_PASTE = `VIKTIGT — LIVSKOMPASSEN-KANON (läs först):
- Jämför mot bifogade register (MODUL, INNEHALL, gap-matrix, domän-covert).
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG.
- content_class: FACT | REFLECTION | PLAY | EVIDENCE — aldrig blanda.
- WORM = beteende + datum + citat — aldrig diagnos på motpart.
- Ex/gaslighting → Hamn/Speglar, inte MåBra.
- Ingen streak/XP. Källor: 1177, BRIS, NHS, AFCC, Konsumentverket — undvik clickbait.
- Varje fynd: full YAML med existing_overlap, recommendation, source_url, backend_impact.
- Research FÅR föreslå backend_impact:YES — implementation kräver PMIR + smoke.

SCOPE-BEGRÄNSNING:
- Max 25 NEW-fynd totalt (rankade). Resten: OVERLAP eller DEFER.

Prompt: docs/external-ai/bifoga/03-prompter/GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md
`;

/** @type {{ dest: string; src: string }[]} */
const COPY_FILES = [
  { dest: '01-LIFE-OS-BUILD-STATE.md', src: 'docs/external-ai/LIFE-OS-BUILD-STATE.md' },
  { dest: '02-MODUL-FUNKTIONS-REGISTER.md', src: 'docs/MODUL-FUNKTIONS-REGISTER.md' },
  { dest: '03-gap-matrix-2026-06-18.md', src: 'docs/external-ai/imports/gap-matrix-2026-06-18.md' },
  { dest: '04-INNEHALL-REGISTER.md', src: 'docs/INNEHALL-REGISTER.md' },
  { dest: '05-doman-covert-narcissism.md', src: '.context/domän-covert-narcissism.md' },
  { dest: '06-system-architecture-summary.md', src: 'docs/system_sync/system_architecture_summary.md' },
  { dest: '07-fas19-leverans.md', src: 'docs/evaluations/2026-06-18-fas19-leverans.md' },
  { dest: '09-flow-pipeline-karta.md', src: 'docs/evaluations/2026-06-17-flow-pipeline-karta.md' },
];

const VAG_SOURCES = [
  'docs/evaluations/2026-06-18-fas19-vag-19.1.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.2.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.3.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.4.md',
  'docs/evaluations/2026-06-18-fas19-vag-19.5.md',
];

const README = `# Research handoff — exakt 10 filer (Gemini-gräns)

**Uppdatera:** \`npm run research:sync:handoff\`

## Bifoga till Deep Research

Markera **alla 10** filer \`00\`–\`09\` i denna mapp (inte README).

| Fil | Roll |
|-----|------|
| \`00-KANON-PASTE.txt\` | Kort kanon — läs först |
| \`01-LIFE-OS-BUILD-STATE.md\` | LOCK / DEFER |
| \`02-MODUL-FUNKTIONS-REGISTER.md\` | Modul → route → callable |
| \`03-gap-matrix-2026-06-18.md\` | KEEP / DEFER / REJECT |
| \`04-INNEHALL-REGISTER.md\` | content_class, banker |
| \`05-doman-covert-narcissism.md\` | HCF-lins ~80% upload |
| \`06-system-architecture-summary.md\` | Systemöversikt |
| \`07-fas19-leverans.md\` | Sprint DONE 19.1–19.6 |
| \`08-fas19-vagar-19.1-19.5.md\` | Våg-sammanfattning (merged) |
| \`09-flow-pipeline-karta.md\` | Flow P1–P7, krediter |

## Körning

1. Bifoga filerna \`00\`–\`09\`
2. Klistra \`GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md\` (03-prompter/)
3. Spara → \`docs/external-ai/imports/research-2026-06-18-*.md\`
4. Cursor: \`CURSOR-FLOW-CREDITS-SYNTHESIS.md\`
`;

function cleanOutDir() {
  mkdirSync(outDir, { recursive: true });
  for (const name of readdirSync(outDir)) {
    unlinkSync(join(outDir, name));
  }
}

function buildMergedVag() {
  const parts = ['# Fas 19 vågor 19.1–19.5 (sammanfattning)\n'];
  for (const relPath of VAG_SOURCES) {
    const src = join(root, relPath);
    const base = relPath.split('/').pop();
    parts.push(`\n---\n\n## ${base}\n\n${readFileSync(src, 'utf8').trim()}\n`);
  }
  return parts.join('');
}

function main() {
  cleanOutDir();
  const synced = [];
  const missing = [];

  writeFileSync(join(outDir, '00-KANON-PASTE.txt'), KANON_PASTE, 'utf8');
  synced.push({ dest: 'docs/external-ai/bifoga/05-research-handoff/00-KANON-PASTE.txt' });

  for (const { dest, src } of COPY_FILES) {
    const srcPath = join(root, src);
    const destPath = join(outDir, dest);
    try {
      statSync(srcPath);
      copyFileSync(srcPath, destPath);
      synced.push({ dest: `docs/external-ai/bifoga/05-research-handoff/${dest}`, src });
    } catch {
      missing.push(src);
    }
  }

  try {
    for (const relPath of VAG_SOURCES) {
      statSync(join(root, relPath));
    }
    writeFileSync(join(outDir, '08-fas19-vagar-19.1-19.5.md'), buildMergedVag(), 'utf8');
    synced.push({
      dest: 'docs/external-ai/bifoga/05-research-handoff/08-fas19-vagar-19.1-19.5.md',
      src: VAG_SOURCES.join(' + '),
    });
  } catch {
    missing.push(...VAG_SOURCES);
  }

  writeFileSync(join(outDir, 'README.md'), README, 'utf8');

  const stamp = new Date().toISOString();
  writeFileSync(
    join(outDir, 'SYNC-STAMP.txt'),
    `Senast synkad: ${stamp}\nKommando: npm run research:sync:handoff\nUpload: 00–09 (10 st)\n`,
  );

  const uploadCount = synced.length;
  console.log('[research:sync:handoff] Upload-filer:', uploadCount, '(max 10 för Gemini)');
  for (const row of synced) {
    console.log('  ', row.dest);
  }
  console.log('  (README.md + SYNC-STAMP.txt — bifoga INTE till Gemini)');

  if (missing.length) {
    console.warn('[research:sync:handoff] Saknade källor:');
    for (const p of missing) console.warn('  ', p);
    process.exitCode = 1;
  } else if (uploadCount !== 10) {
    console.warn('[research:sync:handoff] Varning: förväntade 10 upload-filer, fick', uploadCount);
    process.exitCode = 1;
  }
}

main();
