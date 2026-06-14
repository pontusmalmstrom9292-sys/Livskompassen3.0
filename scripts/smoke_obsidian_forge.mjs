/**
 * Static smoke: Obsidian Forge Theme Lab must exist.
 * Usage: npm run smoke:obsidian-forge
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

function mustNotInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(!text.includes(needle), `${relPath} får inte innehålla: ${needle}`);
  }
}

function main() {
  mustInclude(
    'docs/design/themes/OBSIDIAN-FORGE-SPEC.md',
    'UTVÄRDERING',
    '/dev/obsidian-forge',
    '#d4af37',
  );
  mustInclude(
    'src/styles/obsidian-forge-lab.css',
    '.od-forge__hero',
    '.od-forge__bento-card',
    '.od-forge__chip',
    '.od-forge__dock',
    '.od-forge__drawer-row',
    '#d4af37',
    'od-forge-bridge',
  );
  mustNotInclude(
    'src/styles/obsidian-forge-lab.css',
    'indigo',
    'text-red',
    '#6366f1',
    'teal-',
  );
  mustInclude(
    'src/modules/core/pages/ObsidianForgeLabPage.tsx',
    'ObsidianForgeLabPage',
    'OdForgeHeroCard',
    'OdForgeBentoGrid',
    'OdForgeDockChrome',
  );
  mustInclude(
    'src/modules/core/ui/forge/OdForgeHeroCard.tsx',
    'od-forge__hero',
    'od-forge__cta',
  );
  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    '/dev/obsidian-forge',
    'ObsidianForgeLabPage',
  );
  mustInclude(
    'src/modules/core/ui/forge/odForgeBridge.ts',
    'FORGE_PROD_WIRE_ENABLED = false',
    'isOdForgeBridgeActive',
    "classList.toggle('od-forge-bridge'",
  );
  mustInclude('src/index.css', 'obsidian-forge-lab.css');

  console.log('[smoke:obsidian-forge] PASS — Theme Lab preview, komponenter, route, gold-only CSS.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:obsidian-forge] FAIL —', err.message || err);
  process.exit(1);
}
