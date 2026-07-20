#!/usr/bin/env node
/**
 * Static smoke: firebase-functions runtime pin (v1 + v2 hybrid).
 * Usage: npm run smoke:functions-pin
 *
 * Blocks accidental Dependabot merge of firebase-functions v7+ which breaks
 * functions.region / CallableContext v1 callables in CI.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readAgentsCallableSource } from './lib/readAgentsCallableSource.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const PINNED_MAJOR = 7;
const REQUIRED_V2_IMPORT = "from 'firebase-functions/v2";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function parseFirebaseFunctionsVersion(pkgJsonText) {
  const pkg = JSON.parse(pkgJsonText);
  const raw = pkg.dependencies?.['firebase-functions'];
  assert(typeof raw === 'string', 'functions/package.json saknar firebase-functions dependency');
  const cleaned = raw.replace(/^[\^~]/, '');
  const major = Number.parseInt(cleaned.split('.')[0], 10);
  assert(Number.isFinite(major), `ogiltig firebase-functions version: ${raw}`);
  return { raw, major };
}

function main() {
  console.log('[smoke:functions-pin] firebase-functions pin (v2 only)…');

  const fnPkg = read('functions/package.json');
  const { raw, major } = parseFirebaseFunctionsVersion(fnPkg);

  assert(
    major === PINNED_MAJOR,
    `firebase-functions måste vara v${PINNED_MAJOR}.x (nu: ${raw})`,
  );
  assert(
    !/^[\^~]/.test(raw),
    `firebase-functions ska vara exakt pin utan ^/~ (nu: ${raw})`,
  );

  const dependabot = read('.github/dependabot.yml');
  assert(
    dependabot.includes('firebase-functions'),
    '.github/dependabot.yml saknar ignore för firebase-functions',
  );
  assert(
    /semver-major/.test(dependabot),
    '.github/dependabot.yml ignorerar inte semver-major för firebase-functions',
  );

  const knowledge = read('functions/src/callables/knowledge.ts');
  assert(
    knowledge.includes(REQUIRED_V2_IMPORT),
    `functions/src/callables/knowledge.ts saknar ${REQUIRED_V2_IMPORT}`,
  );

  const agentsSrc = readAgentsCallableSource(root);
  assert(
    agentsSrc.includes(REQUIRED_V2_IMPORT),
    `functions/src/callables/agents/* saknar ${REQUIRED_V2_IMPORT}`,
  );

  console.log(`[smoke:functions-pin] PASS — firebase-functions ${raw} (v${major}.x pin).`);
}

try {
  main();
} catch (err) {
  console.error('[smoke:functions-pin] FAIL:', err.message);
  process.exit(1);
}
