#!/usr/bin/env node
/**
 * Starta Copilot CLI i Livskompassen med YOLO-flaggor (ingen kö).
 * Usage: npm run copilot:lk
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function findCopilotBin() {
  for (const bin of ['copilot', '/opt/homebrew/bin/copilot']) {
    const r = spawnSync('which', [bin], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
    if (existsSync(bin)) return bin;
  }
  console.error('[copilot:lk] Kör: brew install copilot-cli && copilot login');
  process.exit(1);
}

const copilot = findCopilotBin();
const args = [
  '--yolo',
  '--autopilot',
  '--mode',
  'autopilot',
  '--experimental',
  '--max-autopilot-continues',
  '30',
  '--effort',
  'high',
  '--model',
  'auto',
  '--name',
  'livskompassen-free',
  '-C',
  root,
];

console.log('[copilot:lk] Livskompassen + Copilot YOLO (fri session)');
spawnSync(copilot, args, {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, COPILOT_ALLOW_ALL: 'true' },
});
