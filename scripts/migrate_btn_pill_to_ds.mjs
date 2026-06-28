#!/usr/bin/env node
/**
 * Migrates btn-pill--* class strings to ds-btn ds-btn--* in src/modules (Premium UI Polish Phase 3).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const srcModules = join(root, 'src/modules');

const REPLACEMENTS = [
  ['btn-pill--accent', 'ds-btn ds-btn--accent'],
  ['btn-pill--secondary', 'ds-btn ds-btn--secondary'],
  ['btn-pill--ghost', 'ds-btn ds-btn--ghost'],
  ['btn-pill--success', 'ds-btn ds-btn--success'],
  ['btn-pill--danger', 'ds-btn ds-btn--danger'],
  ['btn-pill--primary', 'ds-btn ds-btn--accent'],
];

let files = [];
try {
  files = execSync(`rg -l "btn-pill--" "${srcModules}" -g '*.tsx' -g '*.ts'`, {
    encoding: 'utf8',
    cwd: root,
  })
    .trim()
    .split('\n')
    .filter(Boolean);
} catch {
  files = [];
}

let changed = 0;
for (const rel of files) {
  const path = rel.startsWith('/') ? rel : join(root, rel);
  let text = readFileSync(path, 'utf8');
  const before = text;
  for (const [from, to] of REPLACEMENTS) {
    text = text.split(from).join(to);
  }
  if (text !== before) {
    writeFileSync(path, text);
    changed += 1;
  }
}

console.log(`[migrate_btn_pill_to_ds] Updated ${changed} files (${files.length} scanned)`);
