#!/usr/bin/env node
/**
 * Lock a module after smoke PASS — updates register + optional @locked header.
 * Usage: node scripts/lock_module.mjs MOD-HJ-DAGBOK --smoke smoke:weaver-hitl
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registerPath = join(root, '.context/module-lock-register.json');

const args = process.argv.slice(2);
const moduleId = args[0];
if (!moduleId) {
  console.error('Usage: node scripts/lock_module.mjs MOD-XXX [--smoke smoke:name] [--skip-smoke]');
  process.exit(1);
}

const smokeIdx = args.indexOf('--smoke');
const smokeScript = smokeIdx >= 0 ? args[smokeIdx + 1] : null;
const skipSmoke = args.includes('--skip-smoke');

const register = JSON.parse(readFileSync(registerPath, 'utf8'));
const mod = register.modules.find((m) => m.id === moduleId);
if (!mod) {
  console.error(`Unknown module: ${moduleId}`);
  process.exit(1);
}

if (!skipSmoke && smokeScript) {
  console.log(`[lock_module] Running ${smokeScript}…`);
  const result = spawnSync('npm', ['run', smokeScript.replace(/^smoke:/, 'smoke:')], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) {
    console.error(`[lock_module] Smoke failed — not locking ${moduleId}`);
    process.exit(result.status ?? 1);
  }
}

const commitResult = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
  cwd: root,
  encoding: 'utf8',
});
const commit = commitResult.stdout?.trim() || 'unknown';
const today = new Date().toISOString().slice(0, 10);

mod.status = 'locked';
mod.lockedAt = today;
mod.lockedCommit = commit;
register.updatedAt = today;

for (const rel of mod.entryFiles ?? []) {
  const abs = join(root, rel);
  if (!existsSync(abs)) continue;
  let content = readFileSync(abs, 'utf8');
  const tag = `@locked ${moduleId}`;
  if (!content.includes(tag)) {
    if (content.startsWith('/**')) {
      content = content.replace('/**', `/** ${tag} — låst modul; unlock via docs/evaluations/*-unlock-${moduleId}.md\n *`);
    } else if (content.startsWith('/*')) {
      content = content.replace('/*', `/* ${tag} — låst modul; unlock via docs/evaluations/*-unlock-${moduleId}.md\n`);
    } else {
      content = `/** ${tag} — låst modul; unlock via docs/evaluations/*-unlock-${moduleId}.md */\n${content}`;
    }
    writeFileSync(abs, content);
    console.log(`[lock_module] Added header to ${rel}`);
  }
}

writeFileSync(registerPath, `${JSON.stringify(register, null, 2)}\n`);
console.log(`[lock_module] ${moduleId} → locked (${today} @ ${commit})`);
