#!/usr/bin/env node
/**
 * Browser E2E — Vardagen / Liv och göra entry + legacy redirects.
 * Usage: npm run smoke:e2e-vardagen
 */
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ci = process.env.CI === 'true' || process.env.CI === '1';

function run(label, command, args, opts = {}) {
  console.log(`[smoke:e2e-vardagen] ▶ ${label}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    ...opts,
  });
  if (result.status !== 0) {
    console.error(`[smoke:e2e-vardagen] FAIL — ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('[smoke:e2e-vardagen] Browser gate — Liv och göra');

if (ci) {
  run('playwright install (CI + deps)', 'npx', ['playwright', 'install', '--with-deps', 'chromium']);
} else {
  run('playwright install chromium', 'npx', ['playwright', 'install', 'chromium']);
}

run('playwright test vardagen + legacy', 'npx', [
  'playwright',
  'test',
  'e2e/vardagen-entry.spec.ts',
  'e2e/legacy-redirects.spec.ts',
  'e2e/mobile-scroll-zones.spec.ts',
  '--reporter=line',
]);

console.log('[smoke:e2e-vardagen] PASS');
