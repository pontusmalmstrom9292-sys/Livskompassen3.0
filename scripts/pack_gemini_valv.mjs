#!/usr/bin/env node
/**
 * Valv-paket för Gemini — repomix + uppladdningsmapp.
 * Kör: npm run gemini:pack:valv
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const REPOMIX_INCLUDE =
  'docs/design/VALV-HUBB-SPEC.md,docs/design/references/VALV-ICON-KANON.md,docs/specs/modules/Verklighetsvalvet-SPEC.md,.context/locked-ux-features.md,.context/arkiv-minne.md,docs/gemini-handoff/V1-valv-zone-wireframe.md,docs/gemini-handoff/M2-valv-drawer-copy.md,docs/gemini-handoff/valv/V1-PROMPT.md,src/modules/evidence/vault/**,src/modules/evidence/knowledge/components/VaultKunskapsbankPanel.tsx,src/modules/core/navigation/navTruth.ts';

const UPLOAD_SOURCES = [
  { from: 'docs/design/VALV-HUBB-SPEC.md', to: '01-VALV-HUBB-SPEC.md' },
  { from: 'docs/specs/modules/Verklighetsvalvet-SPEC.md', to: '02-Verklighetsvalvet-SPEC.md' },
  { from: 'docs/design/references/VALV-ICON-KANON.md', to: '03-VALV-ICON-KANON.md' },
  { from: '.context/locked-ux-features.md', to: '04-locked-ux-features.md' },
  { from: '.context/arkiv-minne.md', to: '05-arkiv-minne-silos.md' },
  { from: 'docs/gemini-handoff/V1-valv-zone-wireframe.md', to: '06-V1-valv-zone-wireframe.md' },
  { from: 'docs/gemini-handoff/M2-valv-drawer-copy.md', to: '07-M2-valv-drawer-copy.md' },
  { from: 'docs/gemini-handoff/valv/V1-PROMPT.md', to: '08-V1-PROMPT-klistra-in.md' },
  { from: 'docs/google-ai-pro/PROMPTS.md', to: '09-master-prompt-ref.md' },
];

const repomixOut = join(root, 'exports/gemini-handoff/repomix/gemini-pack-valv.md');
const uploadDir = join(root, 'exports/gemini-handoff/valv-upload');

mkdirSync(dirname(repomixOut), { recursive: true });
rmSync(uploadDir, { recursive: true, force: true });
mkdirSync(uploadDir, { recursive: true });

console.log('=== repomix valv (kod + kanon) ===');
const result = spawnSync(
  'npx',
  ['repomix', '--include', REPOMIX_INCLUDE, '--output', repomixOut],
  { cwd: root, stdio: 'inherit', shell: true },
);
if (result.status !== 0) {
  console.error('[fail] gemini-pack-valv');
  process.exit(result.status ?? 1);
}

console.log('\n=== valv-upload (dra till Gemini) ===');
for (const { from, to } of UPLOAD_SOURCES) {
  const src = join(root, from);
  if (!existsSync(src)) {
    console.warn(`[skip] saknas: ${from}`);
    continue;
  }
  cpSync(src, join(uploadDir, to));
  console.log(`[ok] ${to}`);
}

cpSync(repomixOut, join(uploadDir, '00-gemini-pack-valv-repomix.md'));
console.log('[ok] 00-gemini-pack-valv-repomix.md');

writeFileSync(
  join(uploadDir, 'LÄS-MIG.txt'),
  `Valv → Gemini (Livskompassen v2)
================================

1. Öppna Gemini (gemini.google.com) — ny chatt.
2. Klistra in master-prompt från 09-master-prompt-ref.md (första blocket).
3. Bifoga ELLER klistra in 00-gemini-pack-valv-repomix.md (hela filen).
4. Klistra in uppdraget från 08-V1-PROMPT-klistra-in.md.
5. Spara Geminis svar i docs/gemini-handoff/ som V1-valv-svar.md (eller klistra tillbaka i Cursor).

Mapp: ${uploadDir}
Genererad: ${new Date().toISOString()}
`,
);

console.log(`\nKlart.\n  Repomix: ${repomixOut}\n  Upload:  ${uploadDir}\n`);
