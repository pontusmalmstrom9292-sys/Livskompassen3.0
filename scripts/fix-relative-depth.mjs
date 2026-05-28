#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const MODULES = path.join(ROOT, 'src/modules');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name === 'node_modules') continue;
      walk(full, out);
    } else if (/\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

function prefixToModulesRoot(fileDir) {
  const rel = path.relative(MODULES, fileDir);
  if (!rel || rel === '.') return '';
  return '../'.repeat(rel.split(path.sep).filter(Boolean).length);
}

function fixFile(file) {
  const p = prefixToModulesRoot(path.dirname(file));
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  const targets = [
    'core',
    'kompis',
    'ekonomi',
    'safe_harbor',
    'valv_ekonomi',
    'widgets',
    'admin/planning',
    'admin/projects',
    'evidence/vault',
    'evidence/vaultChat',
    'evidence/knowledge',
    'diary/diary',
    'diary/mirror',
    'family/children',
    'wellbeing/mabra',
    'wellbeing/compasses',
  ];
  for (const t of targets) {
    text = text.replace(new RegExp(`from ['"](?:\\.\\./)+${t.replace('/', '\\/')}`, 'g'), `from '${p}${t}`);
  }
  if (text !== before) fs.writeFileSync(file, text);
  return text !== before;
}

let n = 0;
for (const f of walk(path.join(ROOT, 'src'))) n += fixFile(f) ? 1 : 0;
console.log(`[fix-relative-depth] ${n} files`);
