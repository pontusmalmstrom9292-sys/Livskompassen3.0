/**
 * Static smoke: Superhub §D — drawer IA, legacy redirects, plausible deniability.
 * Usage: npm run smoke:superhub
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

function mustNotInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(!text.includes(needle), `${relPath} får inte innehålla: ${needle}`);
  }
}

/** Parse navTruth vardag entries with inDrawer flag (static heuristic). */
function parseVardagDrawerEntries(navTruthSrc) {
  const entries = [];
  const idRe = /id:\s*'([^']+)'[\s\S]*?section:\s*'vardag'/g;
  let idMatch;
  while ((idMatch = idRe.exec(navTruthSrc)) !== null) {
    const id = idMatch[1];
    const start = idMatch.index;
    const end = navTruthSrc.indexOf('\n  },', start);
    const block = end > start ? navTruthSrc.slice(start, end) : idMatch[0];
    const inDrawer = /inDrawer:\s*true/.test(block);
    const labelMatch = block.match(/label:\s*'([^']+)'/);
    const label = labelMatch?.[1] ?? id;
    entries.push({ id, label, inDrawer });
  }
  return entries;
}

function main() {
  console.log('[smoke:superhub] Drawer IA (4 rader — MENU-DRAWER-KANON)…');

  const navTruth = read('src/modules/core/navigation/navTruth.ts');
  const drawerNav = read('src/modules/core/navigation/drawerNav.ts');
  const drawerFromNavTruth = read('src/modules/core/layout/drawerFromNavTruth.ts');
  const navigationDrawer = read('src/modules/core/layout/NavigationDrawer.tsx');
  const appRoutes = read('src/modules/core/routing/AppRoutes.tsx');

  const vardagDrawer = parseVardagDrawerEntries(navTruth).filter((e) => e.inDrawer);
  const drawerIds = vardagDrawer.map((e) => e.id).sort();
  assert(
    drawerIds.join(',') === 'familjen,hem,installningar,vardagen',
    `navTruth vardag inDrawer förväntas hem,vardagen,familjen,installningar — fick: ${drawerIds.join(', ')}`,
  );

  const labels = Object.fromEntries(vardagDrawer.map((e) => [e.id, e.label]));
  assert(labels.hem === 'Hem — Skriv', `hem-label: ${labels.hem}`);
  assert(labels.vardagen === 'Liv och göra', `vardagen-label: ${labels.vardagen}`);
  assert(labels.familjen === 'Familj och gränser', `familjen-label: ${labels.familjen}`);
  assert(labels.installningar === 'Inställningar', `installningar-label: ${labels.installningar}`);

  assert(!parseVardagDrawerEntries(navTruth).some((e) => e.id === 'dagbok' && e.inDrawer), 'dagbok får inte vara inDrawer (Fyren-gate)');

  mustInclude('src/modules/core/navigation/navTruth.ts', "path: '/liv'", "path: '/familj'");
  mustInclude('src/modules/core/layout/drawerFromNavTruth.ts', 'isVardagDrawerRowActive', 'DRAWER_VARDAG_ITEMS');
  mustInclude('src/modules/core/navigation/drawerNav.ts', 'DRAWER_VARDAG_ITEMS', 'getVisibleDrawerTruth');
  mustInclude(
    'src/modules/core/layout/NavigationDrawer.tsx',
    'DRAWER_VARDAG_ITEMS',
    'isVardagDrawerRowActive',
    'nav-drawer__row',
  );
  assert(
    !navigationDrawer.includes('<DrawerHubAccordion'),
    'NavigationDrawer får inte montera DrawerHubAccordion (4 platta rader)',
  );

  console.log('[smoke:superhub] Inga publika Valv-länkar i vardags-drawer…');
  mustNotInclude('src/modules/core/navigation/drawerNav.ts', 'requiresVaultPin: true');
  assert(!drawerNav.includes("section: 'valv'"), 'drawerNav.ts får inte blanda valv-sektion i vardagslista');
  mustInclude('src/modules/core/layout/NavigationDrawer.tsx', 'vaultOpen ? (', 'DRAWER_VALV_ITEMS');
  assert(
    navigationDrawer.includes('if (!showValvShell) return null') ||
      read('src/modules/core/layout/DrawerModeToggle.tsx').includes('if (!showValvShell) return null'),
    'Valv-växlare dold i publikt läge',
  );

  console.log('[smoke:superhub] Legacy redirects (AppRoutes + livLauncherRoutes)…');
  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'RedirectLivToVardagen',
    'path="/liv"',
    'RedirectDagbokLegacy',
    'path="/dagbok"',
    'RedirectHamnToFamiljen',
    'path="/hamn"',
    'RedirectDrogfrihetToFamiljen',
    'path="/drogfrihet"',
    'path="/familj"',
    'NAV_PATHS.FAMILJEN}?tab=reflektion',
    'path="/ekonomi"',
    'path="/stampla"',
    'NAV_PATHS.VARDAGEN',
    'LivLauncherPage',
    'FamiljenPage',
  );

  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'path="/mabra"',
    'RedirectMabraRootToVardagen',
    'MabraRoutes',
    'path="/planering"',
    'PlaneringPage',
  );

  mustInclude(
    'src/modules/shell/livLauncherRoutes.ts',
    "'mabra'",
    'LIV_LAUNCHER_INLINE_TABS',
    "handling: '/planering?tab=handling'",
    'resolveLivLegacyTabRedirect',
  );

  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'RedirectLivToVardagen',
    'resolveLivLegacyTabRedirect',
  );

  console.log('[smoke:superhub] Shell-sidor monteras…');
  mustInclude('src/modules/shell/LivLauncherPage.tsx', 'LivLauncherGrid', 'LIV_LAUNCHER_EXTERNAL');
  mustInclude(
    'src/modules/shell/LivLauncherPage.tsx',
    'MabraHubView',
    "activeTab === 'mabra'",
  );
  mustInclude(
    'src/modules/core/pages/FamiljenPage.tsx',
    'FamiljenInputSuperModule',
    'ModuleShell',
    "return 'reflektion'",
  );
  mustInclude(
    'src/modules/features/family/children/components/familjen/FamiljenReflektionTab.tsx',
    'BalansMatare',
  );

  console.log('[smoke:superhub] Kanon-referenser…');
  mustInclude(
    'docs/design/references/MENU-DRAWER-KANON.md',
    'Liv och göra',
    'Inställningar',
    'MUST NOT',
  );
  mustInclude('docs/archive/evaluations-fas21-2026-06/2026-06-01-superhub-leverans.md', 'Drawer 4 rader');

  console.log('[smoke:superhub] PASS — drawer IA, legacy redirects, shell wiring.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:superhub] FAIL:', err.message ?? err);
  process.exit(1);
}
