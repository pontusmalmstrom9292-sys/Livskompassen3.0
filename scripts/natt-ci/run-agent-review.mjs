#!/usr/bin/env node
/**
 * Optional: Cursor SDK one-shot review after byggpass failures or on schedule.
 * Requires CURSOR_API_KEY in env (never commit).
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const apiKey = process.env.CURSOR_API_KEY?.trim();
if (!apiKey) {
  console.error('CURSOR_API_KEY saknas. Sätt i miljö (Cursor dashboard → API keys).');
  process.exit(1);
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const nattCiDir = path.dirname(fileURLToPath(import.meta.url));

// Run byggpass first; exit code propagates if it fails
const bygg = spawnSync('node', ['run-byggpass.mjs'], {
  cwd: nattCiDir,
  stdio: 'inherit',
});
if (bygg.status !== 0) {
  console.log('\nByggpass misslyckades — startar SDK review för diagnostik…');
}

let Agent;
try {
  const sdk = await import('@cursor/sdk');
  Agent = sdk.Agent;
} catch (e) {
  console.error('Kunde inte ladda @cursor/sdk. Kör: cd scripts/natt-ci && npm install');
  console.error(e);
  process.exit(1);
}

const prompt = `Du är Editorial Technical Architect för Livskompassen v2 (read-only review).

Körde Natt-CI byggpass i ${repoRoot}:
- functions build, frontend build, eslint --max-warnings 0
- smoke:valv, smoke:kunskap, smoke:dossier

Byggpass exit: ${bygg.status === 0 ? 'PASS' : 'FAIL'}.

Leverera på svenska:
1) Om FAIL: kort rotorsak + exakt fil/kommando att fixa (med path:line om kod)
2) Om PASS: bekräfta att inga nya regressionsrisker syns i senaste diff
3) Max ett rekommenderat nästa steg

Jämför mot hela projektets kontext. Inga secrets i svar.`;

console.log('\n▶ Cursor SDK Agent.prompt (local)…');

const result = await Agent.prompt(prompt, {
  apiKey,
  model: { id: 'composer-2.5' },
  local: { cwd: repoRoot },
});

console.log('\n--- SDK result ---');
console.log('status:', result.status);
if (result.result) console.log(result.result);

process.exit(bygg.status === 0 ? 0 : 1);
