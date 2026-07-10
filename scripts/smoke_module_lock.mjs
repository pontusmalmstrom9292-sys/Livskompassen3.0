#!/usr/bin/env node
/**
 * Module lock register validation + diff guard for locked modules.
 * Usage: npm run smoke:module-lock
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registerPath = join(root, '.context/module-lock-register.json');

function fail(msg) {
  console.error(`[smoke:module-lock] FAIL — ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`[smoke:module-lock] ${msg}`);
}

if (!existsSync(registerPath)) {
  fail('Missing .context/module-lock-register.json');
}

const register = JSON.parse(readFileSync(registerPath, 'utf8'));
const modules = register.modules ?? [];
if (!Array.isArray(modules) || modules.length === 0) {
  fail('Register has no modules');
}

const ids = new Set();
for (const mod of modules) {
  if (!mod.id) fail('Module missing id');
  if (ids.has(mod.id)) fail(`Duplicate module id: ${mod.id}`);
  ids.add(mod.id);
  if (!['developing', 'review', 'locked'].includes(mod.status)) {
    fail(`${mod.id}: invalid status ${mod.status}`);
  }
  if (mod.status === 'locked') {
    if (!mod.lockedAt) fail(`${mod.id}: locked without lockedAt`);
    if (!mod.lockedCommit) fail(`${mod.id}: locked without lockedCommit`);
    const entryFiles = mod.entryFiles ?? [];
    if (entryFiles.length === 0) {
      fail(`${mod.id}: locked module needs at least one entryFile`);
    }
    for (const rel of entryFiles) {
      const abs = join(root, rel);
      if (!existsSync(abs)) fail(`${mod.id}: missing entryFile ${rel}`);
      const content = readFileSync(abs, 'utf8');
      const tag = `@locked ${mod.id}`;
      if (!content.includes(tag) && !content.includes(`@locked-ux`) && !content.includes('PROTECTED CORE')) {
        fail(`${mod.id}: entryFile ${rel} missing "${tag}" header`);
      }
    }
  }
}

ok(`Register OK — ${modules.length} modules (${modules.filter((m) => m.status === 'locked').length} locked)`);

// Diff guard: changed locked globs require unlock doc
const diffResult = spawnSync('git', ['status', '--porcelain'], {
  cwd: root,
  encoding: 'utf8',
});
const changedFiles =
  diffResult.status === 0
    ? diffResult.stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const cleaned = line.replace(/^\?\?\s+/, '').replace(/^[ MADRCU?!]{1,2}\s+/, '');
          const parts = cleaned.split(' -> ');
          return parts[parts.length - 1];
        })
        .filter(Boolean)
    : [];

if (changedFiles.length === 0) {
  ok('PASS — no diff or clean tree');
  process.exit(0);
}

function globMatch(file, pattern) {
  const normalized = pattern.replace(/\/\*\*$/, '');
  return file === normalized || file.startsWith(`${normalized}/`);
}

const lockedTouched = [];
for (const mod of modules.filter((m) => m.status === 'locked')) {
  for (const file of changedFiles) {
    for (const glob of mod.globs ?? []) {
      if (globMatch(file, glob)) {
        lockedTouched.push({ mod: mod.id, file });
      }
    }
  }
}

if (lockedTouched.length === 0) {
  ok('PASS — diff does not touch locked module globs');
  process.exit(0);
}

const unlockDocs = changedFiles.filter(
  (f) => f.startsWith('docs/evaluations/') && f.includes('-unlock-MOD-'),
);
const unlockDocsOnDisk = existsSync(join(root, 'docs/evaluations'))
  ? spawnSync('git', ['ls-files', '--others', '--exclude-standard', 'docs/evaluations'], {
      cwd: root,
      encoding: 'utf8',
    })
      .stdout.split('\n')
      .map((l) => l.trim())
      .filter((f) => f.includes('-unlock-MOD-'))
  : [];
const allUnlockDocs = [...new Set([...unlockDocs, ...unlockDocsOnDisk])];
let hasApprovedUnlock = false;
for (const doc of allUnlockDocs) {
  const abs = join(root, doc);
  if (!existsSync(abs)) continue;
  const content = readFileSync(abs, 'utf8');
  if (/approved:\s*yes/i.test(content)) {
    hasApprovedUnlock = true;
    break;
  }
}

if (!hasApprovedUnlock) {
  const details = lockedTouched.map((t) => `${t.mod} ← ${t.file}`).join('; ');
  fail(`Diff touches locked modules without approved unlock doc: ${details}`);
}

ok('PASS — locked diff allowed via approved unlock doc');
