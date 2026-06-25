#!/usr/bin/env node
/**
 * Capture Executive Premium sandbox screens → docs/design/galleri/freeport-premium/
 * Usage: npm run capture:freeport-premium
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'docs/design/galleri/freeport-premium');

function run(label, command, args) {
  console.log(`[capture:freeport-premium] ▶ ${label}`);
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: false });
  if (result.status !== 0) {
    console.error(`[capture:freeport-premium] FAIL — ${label}`);
    process.exit(result.status ?? 1);
  }
}

run('playwright install chromium', 'npx', ['playwright', 'install', 'chromium']);
run('capture gallery', 'npx', [
  'playwright',
  'test',
  'e2e/freeport-premium-gallery.spec.ts',
  '--reporter=line',
]);

const count = existsSync(outDir)
  ? spawnSync('ls', ['-1', outDir], { encoding: 'utf8' }).stdout.trim().split('\n').filter(Boolean).length
  : 0;

console.log(`[capture:freeport-premium] PASS — ${count} bilder i docs/design/galleri/freeport-premium/`);
