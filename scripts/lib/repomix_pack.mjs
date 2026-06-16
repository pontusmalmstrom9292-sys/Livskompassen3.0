#!/usr/bin/env node
/**
 * Shared repomix runner for ChatBox handoff packs.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * @param {{ root: string, output: string, include: string[], label: string }} opts
 */
export function runRepomixPack({ root, output, include, label }) {
  mkdirSync(dirname(output), { recursive: true });

  console.log(`=== ${label} ===`);
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
      include.join(','),
      '--output',
      output,
    ],
    { cwd: root, stdio: 'inherit', shell: true },
  );

  if (result.status !== 0) {
    console.error(`[fail] ${label}`);
    process.exit(result.status ?? 1);
  }

  console.log(`\nKlart: ${output}`);
}
