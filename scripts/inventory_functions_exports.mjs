#!/usr/bin/env node
/**
 * Inventory Cloud Functions exports vs live deploy (A12).
 * Exit 0: source-only inventory or live match.
 * Exit 1: live diff finds exports missing in Firebase.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'functions/src/index.ts');
const gapDoc = path.join(root, 'docs/evaluations/2026-07-18-functions-deploy-gap.md');

function parseIndexExports(source) {
  const names = new Set();
  const exportBlock = /export\s*\{([^}]+)\}/gs;
  let match;
  while ((match = exportBlock.exec(source)) !== null) {
    for (const part of match[1].split(',')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const aliasMatch = trimmed.match(/\bas\s+(\w+)\s*$/);
      if (aliasMatch) {
        names.add(aliasMatch[1]);
        continue;
      }
      const name = trimmed.split(/\s+/)[0];
      if (name && name !== 'from') names.add(name);
    }
  }
  const exportStar = /export\s*\*\s*from\s*['"]([^'"]+)['"]/g;
  while ((match = exportStar.exec(source)) !== null) {
    const rel = match[1];
    const resolved = path.resolve(path.dirname(indexPath), rel);
    const candidates = [`${resolved}.ts`, path.join(resolved, 'index.ts')];
    for (const file of candidates) {
      if (fs.existsSync(file)) {
        for (const n of parseIndexExports(fs.readFileSync(file, 'utf8'))) names.add(n);
        break;
      }
    }
  }
  return names;
}

function firebaseAuthAvailable() {
  try {
    const out = spawnSync('firebase', ['login:list', '--json'], { encoding: 'utf8' });
    if (out.status !== 0) return false;
    const parsed = JSON.parse(out.stdout || '{}');
    return Array.isArray(parsed.users) && parsed.users.length > 0;
  } catch {
    return false;
  }
}

function listLiveFunctions() {
  const out = execSync('firebase functions:list --json', {
    cwd: root,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const parsed = JSON.parse(out);
  const rows = Array.isArray(parsed) ? parsed : parsed.result ?? parsed.functions ?? [];
  return new Set(
    rows
      .map((row) => row?.id ?? row?.name ?? row?.functionName)
      .filter(Boolean)
      .map((id) => String(id).replace(/^functions\//, '')),
  );
}

const source = fs.readFileSync(indexPath, 'utf8');
const sourceExports = [...parseIndexExports(source)].sort();

const report = {
  generatedAt: new Date().toISOString(),
  sourceExportCount: sourceExports.length,
  sourceExports,
  mode: 'source-only',
  liveExportCount: null,
  missingInLive: [],
  extraInLive: [],
};

console.log(`[inventory:functions] Source exports (${sourceExports.length}):`);
console.log(sourceExports.join(', '));

if (!firebaseAuthAvailable()) {
  console.log('\n[inventory:functions] Firebase auth unavailable — source-only inventory.');
  console.log(`See gap analysis: ${gapDoc}`);
  process.exit(0);
}

try {
  report.mode = 'live-diff';
  const live = listLiveFunctions();
  report.liveExportCount = live.size;
  report.missingInLive = sourceExports.filter((name) => !live.has(name));
  report.extraInLive = [...live].filter((name) => !sourceExports.includes(name)).sort();

  console.log(`\n[inventory:functions] Live functions (${live.size})`);
  if (report.missingInLive.length) {
    console.error('\n[inventory:functions] Missing in live deploy:');
    console.error(report.missingInLive.join(', '));
    console.error(`\nSee: ${gapDoc}`);
    process.exit(1);
  }
  if (report.extraInLive.length) {
    console.log('\n[inventory:functions] Extra in live (not in index.ts):');
    console.log(report.extraInLive.join(', '));
  }
  console.log('\n[inventory:functions] Live deploy matches index.ts exports.');
  process.exit(0);
} catch (err) {
  console.warn('[inventory:functions] Live list failed — falling back to source-only.');
  console.warn(err instanceof Error ? err.message : err);
  console.log(`See gap analysis: ${gapDoc}`);
  process.exit(0);
}
