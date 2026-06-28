#!/usr/bin/env node
/**
 * Fails if diff introduces new btn-pill-- usage in src/modules (Premium UI Polish gate).
 * Usage: node scripts/smoke_no_new_btn_pill.mjs [baseRef]
 */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const base = process.argv[2] ?? 'main';
const root = join(import.meta.dirname, '..');

try {
  const diff = execFileSync('git', ['diff', `${base}...HEAD`, '--unified=0', '--', 'src/modules'], {
    encoding: 'utf8',
    cwd: root,
  });
  const added = diff
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .join('\n');
  const matches = added.match(/btn-pill--/g);
  if (matches?.length) {
    console.error(
      `[smoke:no-new-btn-pill] FAIL — ${matches.length} new btn-pill-- reference(s) vs ${base}`,
    );
    process.exit(1);
  }
  console.log(`[smoke:no-new-btn-pill] PASS — no new btn-pill-- in modules diff vs ${base}`);
} catch (err) {
  if (err.status === 128) {
    console.log('[smoke:no-new-btn-pill] SKIP — no git base for diff');
    process.exit(0);
  }
  throw err;
}
