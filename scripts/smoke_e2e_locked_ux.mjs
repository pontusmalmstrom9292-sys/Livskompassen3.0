#!/usr/bin/env node
/**
 * Browser E2E gate — locked UX i publikt läge.
 * Usage: npm run smoke:e2e-locked-ux
 *
 * Ingår i smoke:predeploy. Installerar Chromium vid behov (CI: --with-deps).
 */
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ci = process.env.CI === 'true' || process.env.CI === '1';

function run(label, command, args, opts = {}) {
  console.log(`[smoke:e2e-locked-ux] ▶ ${label}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    ...opts,
  });
  if (result.status !== 0) {
    console.error(`[smoke:e2e-locked-ux] FAIL — ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('[smoke:e2e-locked-ux] Browser gate — locked UX publikt läge');

if (ci) {
  run('playwright install (CI + deps)', 'npx', ['playwright', 'install', '--with-deps', 'chromium']);
} else {
  run('playwright install chromium', 'npx', ['playwright', 'install', 'chromium']);
}

// CI=1 så Playwright startar egen dev-server (setup:env i playwright.config.ts).
run('playwright test', 'npx', [
  'playwright',
  'test',
  'e2e/locked-ux-public.spec.ts',
  'e2e/obsidian-calm-tokens.spec.ts',
  '--reporter=line',
], {
  env: { ...process.env, CI: '1' },
});

console.log('[smoke:e2e-locked-ux] PASS');
