#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');

const MODULE_MAP = {
  verklighetsvalvet: 'evidence/vault',
  valv_chatt: 'evidence/vaultChat',
  dagbok: 'diary/diary',
  speglings_system: 'diary/mirror',
  mabra: 'wellbeing/mabra',
  kompasser: 'wellbeing/compasses',
  planering: 'admin/planning',
  projekt: 'admin/projects',
  barnens_livsloggar: 'family/children',
  kompis: 'evidence/kompis',
  ekonomi: 'wellbeing/economy',
  safe_harbor: 'family/safeHarbor',
  stampla: 'admin/stampla',
};

const MOVED_ROOTS = new Set(
  Object.values(MODULE_MAP).map((p) => path.join('src/modules', p)),
);
const MOVED_DEPTH = Object.fromEntries(
  Object.entries(MODULE_MAP).map(([oldName, newPath]) => [
    oldName,
    newPath.split('/').length + 1,
  ]),
);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      walk(full, out);
    } else if (/\.(tsx?|mjs|css|md)$/.test(name)) out.push(full);
  }
  return out;
}

function isUnderMovedRoot(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  for (const moved of MOVED_ROOTS) {
    const prefix = moved.replace(/\\/g, '/');
    if (rel.startsWith(`${prefix}/`) || rel === prefix) return true;
  }
  return rel.startsWith('src/modules/evidence/knowledge/');
}

function rewriteContent(text, filePath) {
  let next = text;
  for (const [oldName, newPath] of Object.entries(MODULE_MAP)) {
    if (next.includes(`modules/${newPath}`)) {
      // Redan omskriven — undvik dubbel prefix (t.ex. wellbeing/wellbeing/mabra).
      continue;
    }
    next = next.replaceAll(`modules/${oldName}`, `modules/${newPath}`);
    const newSeg = `/${newPath}/`;
    if (!next.includes(newSeg)) {
      next = next.replaceAll(`/${oldName}/`, newSeg);
    }
  }
  next = next.replaceAll('modules/evidence/vault/dossier', 'modules/evidence/vault/dossier');

  if (isUnderMovedRoot(filePath)) {
    for (const [oldName, newPath] of Object.entries(MODULE_MAP)) {
      const up = '../'.repeat(MOVED_DEPTH[oldName] ?? 3);
      const relNew = `${up}${newPath}`;
      next = next.replaceAll(`from '../../${oldName}`, `from '${relNew}`);
      next = next.replaceAll(`from "../../../${oldName}`, `from '${relNew}`);
      next = next.replaceAll(`from "../../../../${oldName}`, `from "${relNew}`);
      next = next.replaceAll(`from "../../${oldName}`, `from "${relNew}`);
      next = next.replaceAll(`from '../../${oldName}/`, `from '${relNew}/`);
      next = next.replaceAll(`from "../../${oldName}/`, `from "${relNew}/`);
    }
    next = next.replaceAll(`from '../../dossier`, `from '../../../evidence/vault/dossier`);
    next = next.replace(/from '(\.\.\/)+core\//g, (m) => {
      const depth = (m.match(/\.\.\//g) || []).length;
      if (depth < 3) return `from '${'../'.repeat(depth + 1)}core/`;
      return m;
    });
  }
  return next;
}

let changed = 0;
for (const file of [...walk(SRC), ...walk(path.join(ROOT, 'scripts')).filter((f) => f.endsWith('.mjs'))]) {
  const raw = fs.readFileSync(file, 'utf8');
  const next = rewriteContent(raw, file);
  if (next !== raw) {
    fs.writeFileSync(file, next);
    changed++;
  }
}
console.log(`[fix-module-imports] ${changed} files`);
