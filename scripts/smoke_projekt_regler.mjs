/**
 * Static smoke: Projekt regler — /projekt/regler + project_rules Firestore wiring.
 * Usage: npm run smoke:projekt-regler
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
  console.log('[smoke:projekt-regler] Route + Firestore wiring…');

  const appRoutes = read('src/modules/core/routing/AppRoutes.tsx');
  assert(appRoutes.includes('path="/projekt/regler"'), 'AppRoutes saknar path="/projekt/regler"');
  assert(
    appRoutes.includes('AuthGate') || appRoutes.includes('ProtectedModule'),
    'AppRoutes saknar AuthGate eller ProtectedModule för skyddade routes',
  );
  assert(appRoutes.includes('ProjektReglerPage'), 'AppRoutes saknar ProjektReglerPage');

  mustInclude(
    'src/modules/features/admin/projects/components/ProjektReglerPage.tsx',
    'useProjectRules',
    '+ Lägg till regel',
    'ProjectRuleCard',
    'onBlur',
  );

  mustInclude(
    'src/modules/features/admin/projects/hooks/useProjectRules.ts',
    'listenProjectRules',
    'createProjectRule',
    'updateProjectRule',
    'deleteProjectRule',
    'loadProjectAutomationRules',
  );

  mustInclude(
    'src/modules/features/admin/projects/api/projectRulesApi.ts',
    'assertOfflineWriteAllowed',
    'FIRESTORE_COLLECTIONS.project_rules',
    'onSnapshot',
    'addDoc',
    'updateDoc',
    'deleteDoc',
    "where('ownerId', '==', userId)",
  );

  mustInclude(
    'src/modules/core/firebase/offlineWritePolicy.ts',
    'C.project_rules',
  );

  mustInclude(
    'firestore.rules',
    'match /project_rules/{docId}',
    "'create_task', 'add_note'",
  );

  mustInclude(
    'src/modules/features/admin/projects/components/ProjektHubPage.tsx',
    'to="/projekt/regler"',
    'Regler & automation',
  );

  mustInclude(
    'src/modules/core/navigation/GoraHubTabBar.tsx',
    'resolveGoraTab',
    '/projekt',
  );

  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringEmailRulesPanel.tsx',
    'to="/projekt/regler"',
  );

  // Cross-smoke guards — locked-ux + design-modules ska behålla project_rules
  mustInclude('scripts/smoke_locked_ux.mjs', 'match /project_rules/{docId}');
  mustInclude('scripts/smoke_design_modules.mjs', 'match /project_rules/{docId}');

  mustInclude('src/modules/core/types/firestore.ts', "project_rules: 'project_rules'");

  console.log('[smoke:projekt-regler] PASS — route, API, rules, nav, offline allowlist.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:projekt-regler] FAIL:', err.message);
  process.exit(1);
}
