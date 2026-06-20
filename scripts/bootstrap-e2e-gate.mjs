#!/usr/bin/env node
/**
 * Non-interactive E2E bootstrap — för Cursor/agent eller curl|node.
 * Hämtar inte git; förutsätter att e2e/ + smoke_e2e_locked_ux.mjs redan finns
 * ELLER kör: bash scripts/bootstrap-e2e-gate.sh
 *
 * Usage: node scripts/bootstrap-e2e-gate.mjs
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const required = [
  'e2e/locked-ux-public.spec.ts',
  'e2e/obsidian-calm-tokens.spec.ts',
  'playwright.config.ts',
  'scripts/smoke_e2e_locked_ux.mjs',
];

for (const f of required) {
  if (!existsSync(resolve(root, f))) {
    console.error(`[bootstrap-e2e] saknar ${f}`);
    console.error('Kör på Mac: bash scripts/bootstrap-e2e-gate.sh');
    process.exit(1);
  }
}

console.log('[bootstrap-e2e] install @playwright/test om saknas…');
if (!existsSync(resolve(root, 'node_modules/@playwright/test'))) {
  run('npm', ['install', '@playwright/test@^1.61.0', '--save-dev', '--legacy-peer-deps']);
}

run('node', ['scripts/smoke_e2e_locked_ux.mjs']);
