/**
 * Static smoke: Locked Obsidian Depth 3D shell must exist.
 * Usage: npm run smoke:obsidian-depth
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function main() {
  mustInclude(
    'src/modules/core/theme/themePackObsidianDepth.ts',
    "export const OBSIDIAN_DEPTH_THEME_ID = 'OD-obsidian-depth'",
    '#d4af37',
    'Låst',
  );
  mustInclude(
    'src/modules/core/theme/themeRegistry.ts',
    'THEME_PACK_OBSIDIAN_DEPTH',
    'themePackObsidianDepth',
  );
  mustInclude(
    'src/styles/obsidian-depth-mockup.css',
    'LÅST',
    '.od-depth__bento-card',
    '.od-depth__cta',
    '.od-depth__dock-inner',
    'module-shell--depth',
    'module-mode-select',
    "html[data-theme='OD-obsidian-depth']",
  );
  mustInclude(
    'src/modules/core/pages/ObsidianDepthMockupPage.tsx',
    'ObsidianDepthMockupPage',
    'od-depth__bento',
    'od-depth__cta',
    'od-depth__dock',
  );
  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    '/dev/obsidian-depth',
    'ObsidianDepthMockupPage',
  );
  mustInclude(
    'docs/design/themes/OBSIDIAN-DEPTH-SPEC.md',
    'LÅST',
    'OD-obsidian-depth',
    '/dev/obsidian-depth',
  );
  mustInclude(
    '.context/locked-obsidian-depth.md',
    'OD-obsidian-depth',
    'obsidian-depth-mockup.css',
  );

  for (const png of [
    'docs/design/theme-lab/obsidian-depth-mobile.png',
    'docs/design/theme-lab/obsidian-depth-active.png',
  ]) {
    assert(existsSync(resolve(root, png)), `saknar kanonbild: ${png}`);
  }

  console.log('[smoke:obsidian-depth] PASS — låst 3D-skalet, theme pack, mockup, kanonbilder.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:obsidian-depth] FAIL —', err.message || err);
  process.exit(1);
}
