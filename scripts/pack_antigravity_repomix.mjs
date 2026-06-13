#!/usr/bin/env node
/**
 * Kuraterad Repomix för Google Antigravity (byggande / UI / mockups).
 * Exkluderar arkiv, exports, ikonförslag och binära assets.
 * Kör: npm run antigravity:pack
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/antigravity');
const output = join(outDir, 'repomix-antigravity-build.md');

const INCLUDE = [
  '.context/**',
  'AGENTS.md',
  '.cursorrules',
  'docs/SYSTEMKONTROLL.md',
  'docs/INNEHALL-REGISTER.md',
  'docs/MODUL-FUNKTIONS-REGISTER.md',
  'docs/MODUL-GAP-OVERSIKT.md',
  'docs/specs/**',
  'docs/design/**',
  'docs/evaluations/2026-06-11-antigravity-handoff.md',
  'docs/evaluations/2026-06-11-multitask-mt1.md',
  'docs/evaluations/2026-06-11-multitask-mt2.md',
  'docs/evaluations/2026-06-11-mt3-blockers.md',
  'docs/google-ai-pro/**',
  'docs/gemini-handoff/**',
  'src/**',
  'functions/src/**',
  'firebase.json',
  'firestore.rules',
  'storage.rules',
  'package.json',
  'vite.config.ts',
  'tailwind.config.js',
  'tsconfig.json',
  'tsconfig.app.json',
  'eslint.config.js',
  'index.html',
  'capacitor.config.ts',
  'public/favicon.svg',
].join(',');

const IGNORE = [
  'docs/archive/**',
  'exports/**',
  'docs/design/icons-proposals/**',
  'docs/design/galleri/**',
  'docs/design/slideshow/**',
  'docs/design/**/*.html',
  'docs/design/themes/**/svg/**',
  '**/*.png',
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.webp',
  '**/*.gif',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/__tests__/**',
  'android/**',
  'ios/**',
  'dataconnect/**',
  'node_modules/**',
  'public/icons/**',
  'scripts/smoke_*.mjs',
  'scripts/orkester_*.mjs',
].join(',');

mkdirSync(outDir, { recursive: true });

console.log('=== Antigravity repomix (byggande, ren) ===');
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
    '--ignore',
    IGNORE,
    '--output',
    output,
  ],
  { cwd: root, stdio: 'inherit', shell: true },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

writeFileSync(
  join(outDir, 'README.txt'),
  `Livskompassen — Antigravity build repomix
Generated: ${new Date().toISOString()}

Bifoga: repomix-antigravity-build.md
Handoff: docs/evaluations/2026-06-11-antigravity-handoff.md

Stanna i Cursor: firestore.rules, sharedRules.ts, synapser, deploy.
`,
  'utf8',
);

console.log(`\nKlart: ${output}`);
