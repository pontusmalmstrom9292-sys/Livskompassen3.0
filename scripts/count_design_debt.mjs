#!/usr/bin/env node
/**
 * Emits design-debt metrics for docs/Dashboard.md (Premium UI Polish Phase 9).
 */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const src = join(root, 'src');

function rgCount(pattern, glob = '*.tsx') {
  try {
    const out = execSync(
      `rg -l "${pattern}" "${src}" -g '${glob}' 2>/dev/null | wc -l`,
      { encoding: 'utf8', cwd: root },
    );
    return Number.parseInt(out.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

function rgFiles(pattern, searchRoot = src) {
  try {
    return execSync(`rg -l '${pattern}' "${searchRoot}" -g '*.tsx' -g '*.ts' 2>/dev/null`, {
      encoding: 'utf8',
      cwd: root,
    })
      .trim()
      .split('\n')
      .filter(Boolean).length;
  } catch {
    return 0;
  }
}

const modules = join(src, 'modules');
// btn-pill migration target: src/modules only (DS Button.tsx keeps legacy CSS bridge comment)
const btnPill = rgFiles('btn-pill--', modules);
const dsBtn = rgFiles('ds-btn--', modules);
const dsModal = rgFiles('@/design-system');
// Ad-hoc dialogs in modules excluding DS Modal/Sheet and locked NavigationDrawer
const adHocDialogRaw = execSync(
  `rg -l 'role="dialog"' "${modules}" -g '*.tsx' -g '*.ts' 2>/dev/null || true`,
  { encoding: 'utf8', cwd: root },
)
  .trim()
  .split('\n')
  .filter(Boolean)
  .filter(
    (f) =>
      !f.includes('design-system/') &&
      !f.endsWith('NavigationDrawer.tsx'),
  ).length;
const adHocDialog = adHocDialogRaw;
const indexCss = existsSync(join(root, 'src/index.css'))
  ? readFileSync(join(root, 'src/index.css'), 'utf8').split('\n').length
  : 0;

const metrics = {
  btnPillFiles: btnPill,
  dsBtnFiles: dsBtn,
  designSystemImportFiles: dsModal,
  adHocDialogFiles: adHocDialog,
  indexCssLoc: indexCss,
  generatedAt: new Date().toISOString(),
};

console.log(JSON.stringify(metrics, null, 2));
