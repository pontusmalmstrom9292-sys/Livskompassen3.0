#!/usr/bin/env node
/**
 * Live browser E2E — auth + Liv och göra tabs + drawer navigation.
 * Usage: npm run smoke:e2e-live
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ci = process.env.CI === 'true' || process.env.CI === '1';

function run(label, command, args, opts = {}) {
  console.log(`[smoke:e2e-live] ▶ ${label}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    ...opts,
  });
  if (result.status !== 0) {
    console.error(`[smoke:e2e-live] FAIL — ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('[smoke:e2e-live] Browser gate — live navigation P0');

mkdirSync(resolve(root, 'e2e/.auth'), { recursive: true });

if (ci) {
  run('playwright install (CI + deps)', 'npx', ['playwright', 'install', '--with-deps', 'chromium']);
} else {
  run('playwright install chromium', 'npx', ['playwright', 'install', 'chromium']);
}

run('playwright test live navigation', 'npx', [
  'playwright',
  'test',
  '--project=g85-mobile-authed',
  'e2e/fixtures/auth.setup.ts',
  'e2e/liv-gora-tabs.spec.ts',
  'e2e/drawer-navigation.spec.ts',
  'e2e/dock-navigation-public.spec.ts',
  '--reporter=line',
], {
  env: { ...process.env, CI: '1' },
});

console.log('[smoke:e2e-live] PASS');
