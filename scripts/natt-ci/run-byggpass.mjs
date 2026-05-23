#!/usr/bin/env node
/**
 * Natt-CI byggpass — deterministic shell chain (no API key required).
 * See docs/NATT-CI.md and scripts/README.md
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function run(label, command, args, cwd = repoRoot) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) {
    console.error(`\n✗ ${label} failed (exit ${r.status ?? 1})`);
    process.exit(r.status ?? 1);
  }
  console.log(`✓ ${label}`);
}

const steps = [
  ['functions build', 'npm', ['run', 'build'], path.join(repoRoot, 'functions')],
  ['frontend build', 'npm', ['run', 'build'], repoRoot],
  ['eslint', 'npx', ['eslint', '.', '--max-warnings', '0'], repoRoot],
  ['smoke:valv', 'npm', ['run', 'smoke:valv'], repoRoot],
  ['smoke:kunskap', 'npm', ['run', 'smoke:kunskap'], repoRoot],
  ['smoke:dossier', 'npm', ['run', 'smoke:dossier'], repoRoot],
];

console.log('Natt-CI byggpass — repo:', repoRoot);
const started = Date.now();

for (const [label, cmd, args, cwd] of steps) {
  run(label, cmd, args, cwd);
}

const sec = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\n✓ Natt-CI byggpass complete (${sec}s)`);
