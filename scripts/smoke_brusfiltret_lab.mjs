/**
 * Static smoke: Brusfiltret SuperModule Theme Lab (Variant B).
 * Usage: npm run smoke:brusfiltret-lab
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
    'src/modules/core/routing/AppRoutes.tsx',
    'path="/dev/theme-lab/brusfiltret-supermodule"',
    'BrusfiltretSupermoduleLabPage',
  );

  mustNotInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'ProtectedModule><BrusfiltretSupermoduleLabPage',
  );

  mustInclude(
    'src/modules/core/pages/ThemeLabPage.tsx',
    'Brusfiltret SuperModule B',
    '/dev/theme-lab/brusfiltret-supermodule',
  );

  mustInclude(
    'src/modules/core/pages/BrusfiltretSupermoduleLabPage.tsx',
    'to="/widget/hamn"',
    'Prod Brusfiltret',
    'to="/dev/theme-lab"',
    '← Theme Lab',
    'useState(false)',
    'brusfiltret-modul-kanon-ref.png',
  );

  mustInclude(
    'src/modules/sandbox/brusfiltret/BrusfiltretSupermoduleShell.tsx',
    'role="tablist"',
    'klistra_in',
    'jade',
  );

  mustInclude('src/index.css', 'theme-lab-brusfiltret-supermodule.css');
  mustInclude('docs/design/references/BRUSFILTRET-MODUL-KANON.md', 'Variant B');

  assert(
    existsSync(resolve(root, 'docs/design/references/brusfiltret-modul-kanon-ref.png')),
    'saknar kanon-PNG i docs/design/references/',
  );

  console.log('smoke:brusfiltret-lab PASS');
}

main();
