#!/usr/bin/env node
/**
 * Synkar kärna-pack till exports/google-ai-pro/notebooklm/ för NotebookLM-upload.
 * Kör: npm run notebooklm:sync
 * Kräver: npm run chatbot:pack:handoff (repomix-packs)
 */
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/google-ai-pro/notebooklm');
const handoffDir = join(root, 'exports/chatbot-handoff');

const REPOMIX_PACKS = [
  'chatbot-pack-security.md',
  'ui-design-pack.md',
  'chatbot-pack-life-os-vision.md',
  'chatbot-pack-supermodules.md',
  'chatbot-pack-nav-wave3.md',
  'chatbot-pack-design-tokens.md',
  'chatbot-pack-hygiene.md',
];

const REGISTER_FILES = [
  'docs/DOC-INDEX.md',
  'docs/external-ai/LIFE-OS-BUILD-STATE.md',
  'docs/external-ai/SECURITY-LOCK-MANIFEST.md',
  'docs/external-ai/SYNAPSE-LOCK-SPEC.md',
  'docs/external-ai/UPLOAD-UNIFIED-SPEC.md',
  'docs/external-ai/DEPLOY-CHATBOT-WAVE.md',
  'docs/external-ai/APPCHECK-ENFORCE-GUIDE.md',
  'docs/external-ai/DESIGN-KEEP-REGISTER.md',
  'docs/external-ai/CHECKPOINT-LOG.md',
  'docs/external-ai/HYGIENE-LOG.md',
  'docs/external-ai/LIFE-OS-CORE-LOCKED.md',
  'docs/external-ai/imports/gap-matrix-2026-06-18.md',
];

const EVAL_FILES = [
  'docs/evaluations/2026-06-15-fas19-masterplan-v2.md',
  'docs/evaluations/2026-06-16-supermodule-ui-masterplan.md',
  'docs/evaluations/SENASTE-SAMMANFATTNING.md',
  'docs/evaluations/2026-06-18-fas19-leverans.md',
  'docs/evaluations/2026-06-17-fas19-log.md',
  'docs/archive/evaluations-fas19-sprint-2026-06/2026-06-18-fas19-vag-19.1.md',
  'docs/archive/evaluations-fas19-sprint-2026-06/2026-06-18-fas19-vag-19.2.md',
  'docs/archive/evaluations-fas19-sprint-2026-06/2026-06-18-fas19-vag-19.3.md',
  'docs/archive/evaluations-fas19-sprint-2026-06/2026-06-18-fas19-vag-19.4.md',
  'docs/archive/evaluations-fas19-sprint-2026-06/2026-06-18-fas19-vag-19.5.md',
  'docs/evaluations/2026-06-18-notebooklm-baseline.md',
  'docs/external-ai/leveranser/2026-06-16-notebooklm-baseline-compare.md',
];

const SYSTEM_SYNC_FILES = [
  'docs/system_sync/system_plan_CURRENT.md',
  'docs/system_sync/locked_ux_features_CURRENT.md',
  'docs/system_sync/firestore_rules_CURRENT.rules',
  'docs/system_sync/storage_rules_CURRENT.rules',
  'docs/system_sync/package_CURRENT.json',
  'docs/system_sync/tailwind_CURRENT.js',
  'docs/system_sync/tsconfig_CURRENT.json',
  'docs/system_sync/tsconfig_core_strict_CURRENT.json',
  'docs/system_sync/system_architecture_summary.md',
];

const EXTRA_COPIES = [
  {
    from: 'docs/external-ai/notebooklm/NOTEBOOKLM-MASTER-PROMPT.md',
    to: 'NOTEBOOKLM-MASTER-PROMPT.md',
  },
  {
    from: 'docs/external-ai/notebooklm/NOTEBOOKLM-LATHUND.md',
    to: 'NOTEBOOKLM-LATHUND.md',
  },
];

const BARN_EPISTEMIK_SRC = '.cursor/rules/barn-observation-epistemik.mdc';
const BARN_EPISTEMIK_DEST = 'barn-observation-epistemik.md';

function stripMdcFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('---', 3);
  if (end === -1) return text;
  return text.slice(end + 3).replace(/^\s+/, '');
}

function copyFlat(relPath, destName) {
  const src = join(root, relPath);
  const dest = join(outDir, destName ?? relPath.split('/').pop());
  copyFileSync(src, dest);
  return { src: relPath, dest: dest.replace(root + '/', ''), bytes: statSync(dest).size };
}

function main() {
  const securityPack = join(handoffDir, 'chatbot-pack-security.md');
  try {
    statSync(securityPack);
  } catch {
    console.error('[notebooklm:sync] Saknar repomix-packs.');
    console.error('Kör först: npm run chatbot:pack:handoff');
    process.exit(1);
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const synced = [];
  const missing = [];

  for (const name of REPOMIX_PACKS) {
    const src = join(handoffDir, name);
    try {
      statSync(src);
      copyFileSync(src, join(outDir, name));
      synced.push({
        src: `exports/chatbot-handoff/${name}`,
        dest: `exports/google-ai-pro/notebooklm/${name}`,
        bytes: statSync(join(outDir, name)).size,
      });
    } catch {
      missing.push(`exports/chatbot-handoff/${name}`);
    }
  }

  for (const relPath of [...REGISTER_FILES, ...EVAL_FILES, ...SYSTEM_SYNC_FILES]) {
    try {
      synced.push(copyFlat(relPath));
    } catch {
      missing.push(relPath);
    }
  }

  for (const { from, to } of EXTRA_COPIES) {
    try {
      synced.push(copyFlat(from, to));
    } catch {
      missing.push(from);
    }
  }

  try {
    const raw = readFileSync(join(root, BARN_EPISTEMIK_SRC), 'utf8');
    const body = stripMdcFrontmatter(raw);
    writeFileSync(join(outDir, BARN_EPISTEMIK_DEST), body, 'utf8');
    synced.push({
      src: BARN_EPISTEMIK_SRC,
      dest: `exports/google-ai-pro/notebooklm/${BARN_EPISTEMIK_DEST}`,
      bytes: statSync(join(outDir, BARN_EPISTEMIK_DEST)).size,
    });
  } catch {
    missing.push(BARN_EPISTEMIK_SRC);
  }

  const stamp = new Date().toISOString();
  const manifest = `# NotebookLM — Livskompassen kärna

**Senast synkad:** ${stamp}  
**Kommando:** \`npm run notebooklm:pack:all\`

## Innan upload

1. Kör \`npm run notebooklm:pack:all\` i projektrot
2. I NotebookLM: **ta bort** gamla källor (maj-2025 design-only pack)
3. Ladda upp **hela** mappen \`exports/google-ai-pro/notebooklm/\`

**Mac Finder:** \`Cmd + Shift + G\` → klistra:

\`\`\`
/Users/Livskompassen/StudioProjects/Livskompassen3.0/exports/google-ai-pro/notebooklm/
\`\`\`

## Chattstart

Klistra in text från \`NOTEBOOKLM-MASTER-PROMPT.md\` som första meddelande.

## Bifogningsordning (prioritet)

1. \`LIFE-OS-BUILD-STATE.md\` — LOCK / FREEZE / DEFER
2. \`DOC-INDEX.md\` — var sanning finns
3. Repomix-packs (\`chatbot-pack-*.md\`, \`ui-design-pack.md\`)
4. Register (SECURITY-LOCK, SYNAPSE-LOCK, UPLOAD-UNIFIED, …)
5. \`system_sync/*_CURRENT.*\` — rules + plan
6. Eval (\`fas19-leverans\`, \`fas19-vag-19.*\`, baseline 2026-06-18)

## Baseline-frågor (verifiera efter upload)

Se \`2026-06-18-notebooklm-baseline.md\`:

1. Är **P1b Inkast HITL** LOCK?
2. Vilken **route** har Barnfokus?
3. Nämns **cross-RAG** som tillåtet?
4. **Fas 19 sprint**-status?

**Avvikelse → CHECKPOINT i Cursor.** Uppdatera inte prod från NotebookLM direkt.

## Filer i detta pack (${synced.length} st)

${synced.map((r) => `- \`${r.dest.split('/').pop()}\``).join('\n')}

---

Kanon: [\`docs/external-ai/notebooklm/NOTEBOOKLM-LATHUND.md\`](../../docs/external-ai/notebooklm/NOTEBOOKLM-LATHUND.md)
`;

  writeFileSync(join(outDir, '00-LAS-MIG-FORST.md'), manifest, 'utf8');
  writeFileSync(
    join(outDir, 'SYNC-STAMP.txt'),
    `Senast synkad: ${stamp}\nKommando: npm run notebooklm:pack:all\nFiler: ${synced.length}\n`,
  );

  console.log('[notebooklm:sync] Synkade', synced.length, 'filer till exports/google-ai-pro/notebooklm/');
  for (const row of synced) {
    console.log('  ', row.dest.split('/').pop());
  }

  if (missing.length) {
    console.warn('[notebooklm:sync] Saknade källor (hoppade över):');
    for (const p of missing) console.warn('  ', p);
    process.exitCode = 1;
  }
}

main();
