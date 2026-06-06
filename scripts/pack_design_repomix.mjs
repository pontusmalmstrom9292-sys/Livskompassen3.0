#!/usr/bin/env node
/**
 * Repomix för hela appens design (AI Studio / Gemini remix).
 * Kör: npm run design:pack
 *
 * Output: exports/ai-studio/repomix-design-full.md
 * Prompt: docs/ai-studio/DESIGN-REMIX-PROMPT.md
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/ai-studio');
const output = join(outDir, 'repomix-design-full.md');
const readme = join(outDir, 'DESIGN-PACK-README.txt');

/** Designkanon + tokens + chrome + all modul-UI (ej backend/api). */
const INCLUDE = [
  '.context/design-language.md',
  '.context/design-modules-mockup.md',
  '.context/locked-icons.md',
  '.context/locked-ux-features.md',
  'docs/specs/design-master.md',
  'docs/specs/design-brief.md',
  'docs/design/**',
  'tailwind.config.js',
  'postcss.config.js',
  'index.html',
  'src/index.css',
  'src/styles/**',
  'src/modules/core/theme/**',
  'src/modules/core/layout/**',
  'src/modules/core/design/**',
  'src/modules/core/ui/**',
  'src/modules/core/components/**',
  'src/modules/core/pages/**',
  'src/modules/core/home/**',
  'src/modules/core/navigation/**',
  'src/modules/core/routing/AppRoutes.tsx',
  'src/modules/core/copy/**',
  'src/modules/features/**/components/**',
  'src/modules/capture/**',
  'src/modules/inkast/**',
  'src/modules/shell/**',
  'src/modules/kompis/components/**',
  'public/favicon.svg',
].join(',');

const IGNORE = [
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/__tests__/**',
  '**/*.stories.tsx',
  '**/node_modules/**',
  '**/*.png',
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.webp',
  '**/*.gif',
  'docs/design/icons-proposals/**',
  'docs/design/slideshow/**',
  'docs/design/galleri/**',
  'docs/design/**/*.html',
  'docs/design/themes/**/svg/**',
].join(',');

mkdirSync(outDir, { recursive: true });

console.log('=== Design repomix (hela appens UI + kanon) ===');
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
  readme,
  `Livskompassen — design repomix
Generated: ${new Date().toISOString()}

1. Bifoga i AI Studio: repomix-design-full.md
2. Klistra prompt från: docs/ai-studio/DESIGN-REMIX-PROMPT.md

Obs: exports/ai-studio/ är gitignored — kör npm run design:pack igen efter större UI-ändringar.
`,
  'utf8',
);

console.log(`\nKlart:\n  ${output}\n  ${readme}`);
console.log('Prompt: docs/ai-studio/DESIGN-REMIX-PROMPT.md');
