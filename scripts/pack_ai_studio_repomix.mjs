#!/usr/bin/env node
/**
 * Kompakt Repomix för Google AI Studio (~250–350 KB, ~75k tokens).
 * Kör: npm run ai-studio:pack
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/ai-studio');
const output = join(outDir, 'repomix-ai-studio.md');

/** Kuraterat urval — kanon + core + backend-ingångar (ej hela src/functions). */
const INCLUDE = [
  '.context/**',
  'AGENTS.md',
  'docs/SYSTEMKONTROLL.md',
  'docs/INNEHALL-REGISTER.md',
  'docs/specs/modules/Arkiv-GAP-REGISTER.md',
  'docs/design/references/MENU-DRAWER-KANON.md',
  'src/modules/core/**',
  'firebase.json',
  'firestore.rules',
  'functions/src/sharedRules.ts',
  'functions/src/index.ts',
].join(',');

mkdirSync(outDir, { recursive: true });

console.log('=== AI Studio repomix (komprimerad) ===');
const result = spawnSync(
  'npx',
  [
    'repomix',
    '--style',
    'markdown',
    '--compress',
    '--remove-comments',
    '--remove-empty-lines',
    '--no-directory-structure',
    '--include',
    INCLUDE,
    '--output',
    output,
  ],
  { cwd: root, stdio: 'inherit', shell: true },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`\nKlart: ${output}`);
console.log('Ladda upp i AI Studio tillsammans med din uppgiftsprompt.');
