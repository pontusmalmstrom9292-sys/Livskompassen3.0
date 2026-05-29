/**
 * Smoke: Barn-stunder (flikar + ankare-växel) — statiskt + liten enhetstest.
 * Usage: npm run smoke:child-moment
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
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

function resolveStundCategory(selected, saveAsAnchor) {
  return saveAsAnchor ? 'ankare' : selected;
}

function main() {
  mustInclude(
    'src/modules/family/children/constants/childMomentViews.ts',
    'Stunder',
    'favoriter',
  );
  mustInclude(
    'src/modules/family/children/components/familjen/ChildMomentTabs.tsx',
    'CHILD_MOMENT_TAB_LABELS',
    'stunder',
  );
  mustInclude(
    'src/modules/family/children/components/ChildSubLogPanel.tsx',
    'Spara som ankare',
    'saveAsAnchor',
    'resolveStundCategory',
    "'stund'",
  );
  mustInclude(
    'src/modules/family/children/components/familjen/ChildMomentStunderPanel.tsx',
    'variant="stund"',
    'Ny stund',
  );
  mustInclude(
    'src/modules/family/children/utils/childMomentHelpers.ts',
    'resolveStundCategory',
    "return saveAsAnchor ? 'ankare'",
  );
  mustInclude(
    'src/modules/family/children/hooks/useChildMomentView.ts',
    "searchParams.get('view')",
  );

  assert(resolveStundCategory('vardag', true) === 'ankare', 'ankare ska vinna');
  assert(resolveStundCategory('positivt', false) === 'positivt', 'positivt oförändrat');
  assert(resolveStundCategory('skola', true) === 'ankare', 'ankare ska vinna över skola');

  console.log('[smoke:child-moment] PASS');
}

main();
