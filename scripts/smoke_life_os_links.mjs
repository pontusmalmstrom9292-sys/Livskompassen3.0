/**
 * Static smoke: Life OS Links (MaterialPack-editor)
 * Validerar Våg C (bankRef-dropdown och routine_templates koppling) samt Våg B (firestore rules).
 * Usage: node scripts/smoke_life_os_links.mjs
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

function main() {
  // 1. Verifiera att bankRef dropdown (Våg C) finns i ProjektMaterialPackPage
  mustInclude(
    'src/modules/features/admin/projects/components/ProjektMaterialPackPage.tsx',
    'bankRefGroups.panel',
    'bankRefGroups.reflection',
    'bankRefGroups.play',
    'isValidMaterialPackBankRef',
    'labelForMaterialPackBankRef'
  );

  // 2. Verifiera att routine_templates koppling (Våg C) finns i ProjektMaterialPackPage
  mustInclude(
    'src/modules/features/admin/projects/components/ProjektMaterialPackPage.tsx',
    'routineCandidates',
    'routineNavigateShortcuts'
  );

  // 3. Verifiera bridge implementerad
  mustInclude(
    'src/modules/core/lifeOs/materialPackRoutineBridge.ts',
    'RoutineNavigateShortcut',
    'routineNavigateShortcuts'
  );

  // 4. Verifiera att firestore.rules (Våg B) tillåter material_pack_overrides
  mustInclude(
    'firestore.rules',
    'match /material_pack_overrides/{docId}',
    "request.resource.data.presetId in ['foralder_trygg', 'rehab_lag', 'vardag_arbete', 'minimal']"
  );

  console.log('[smoke:life-os-links] PASS — MaterialPack editor Våg C (bankRef, rutiner) och Våg B (firestore rules).');
}

try {
  main();
} catch (err) {
  console.error('[smoke:life-os-links] FAIL —', err.message || err);
  process.exit(1);
}
