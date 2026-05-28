/**
 * Static smoke: Locked UX features must exist in source (no Firebase).
 * Usage: npm run smoke:locked-ux
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
  // Barnfokus-frågor (ev. Middagsfrågan)
  mustInclude(
    'src/modules/barnens_livsloggar/components/BarnfokusFraganPanel.tsx',
    'Barnfokus',
    'Minneslista',
    'Spara till',
    's logg',
    'Annan fråga',
  );
  mustInclude(
    'src/modules/barnens_livsloggar/components/BarnensPage.tsx',
    'BarnfokusFraganPanel',
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/barnens_livsloggar/hooks/useFamiljenShell.ts',
    "category: 'barnfokus'",
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/barnens_livsloggar/components/FamiljenPage.tsx',
    'FamiljenReflektionTab',
    'vaultDrawerPath',
  );
  mustInclude(
    'src/modules/verklighetsvalvet/components/VaultKunskapsbankPanel.tsx',
    'FamiljenKunskapHubTab',
    'KunskapPage',
  );
  mustInclude(
    'src/modules/barnens_livsloggar/components/familjen/FamiljenReflektionTab.tsx',
    'BarnfokusFraganPanel',
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/barnens_livsloggar/constants.ts',
    'BARNFOKUS_QUESTIONS',
    'barnfokusQuestionForToday',
    'valv_safe',
  );

  // Valv Mönster + Orkester
  mustInclude(
    'src/modules/verklighetsvalvet/components/VaultPage.tsx',
    "'monster'",
    "'orkester'",
    "'kunskapsbank'",
    'label: \'Mönster\'',
    'label: \'Orkester\'',
    'label: \'Kunskapsbank\'',
    'VaultMonsterPanel',
    'VaultOrkesterPanel',
    'VaultKunskapsbankPanel',
  );
  mustInclude(
    'src/modules/verklighetsvalvet/components/VaultMonsterPanel.tsx',
    'Frekvensanalys',
    'buildVaultFrequencyReport',
  );
  mustInclude(
    'src/modules/verklighetsvalvet/components/VaultOrkesterPanel.tsx',
    'AI-Orkestern',
    'Kör mönstersökning',
    'analyzeBiffMessage',
  );
  mustInclude(
    'src/modules/verklighetsvalvet/utils/vaultPatternScan.ts',
    'buildVaultFrequencyReport',
  );

  mustInclude('src/modules/core/ui/ValvArchIcon.tsx', 'ValvArchIcon');
  mustInclude(
    'src/modules/core/layout/DockHubBand.tsx',
    'getDockSideLinks',
    'HubPresetSheet',
    'delayMs: 3000',
  );
  mustInclude('src/modules/core/navigation/navTruth.ts', "id: 'vardagen'", '/vardagen');
  mustInclude(
    'src/modules/inkast/components/InkastLiteCard.tsx',
    'submitInkastLite',
    'formatInkastResultMessage',
    'id="inkast-lite"',
  );
  mustInclude('src/modules/inkast/api/inkastService.ts', 'parseSubmitInkastLiteResult');
  mustInclude('src/modules/core/pages/HomePage.tsx', 'InkastLiteCard');
  mustInclude('functions/src/index.ts', 'submitInkastLite');
  mustInclude(
    'docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md',
    'LifeHubPreset',
    'foralder_trygg',
  );
  mustInclude(
    'src/modules/core/lifeOs/lifeHubPresets.ts',
    'LIFE_HUB_PRESETS',
    'materialEnabled',
  );
  mustInclude('src/modules/core/pages/HomePage.tsx', 'useLifeHubPreset');
  mustInclude('src/modules/core/lifeOs/HubPresetSheet.tsx', 'LifeHubPresetPicker');
  mustInclude('src/modules/planering/components/RoutinesPanel.tsx', 'runRoutine');
  mustInclude('src/modules/projekt/components/ProjektNyPage.tsx', '/projekt/ny');
  mustInclude('src/index.css', '.dock-hub-band');

  mustInclude(
    'docs/design/PLANERING-PROJEKT-HYBRID.md',
    'Handling ligger fast',
    'PLANERING-P3-KANBAN-KANON',
    'PROJEKT-SPEC',
    'W1-kompakt-projekt',
  );
  assert(
    existsSync(resolve(root, 'docs/design/references/PLANERING-P3-KANBAN-KANON.png')),
    'saknar: PLANERING-P3-KANBAN-KANON.png',
  );
  assert(
    existsSync(resolve(root, 'docs/design/galleri/widget/v2/W1-kompakt-projekt.png')),
    'saknar: widget v2 W1-kompakt-projekt.png',
  );

  // Planeringssidan (design lock)
  mustInclude(
    'docs/design/PLANERINGSSIDA-SPEC.md',
    '/planering',
    'planning_email_rules',
    'P1',
    'P4',
  );

  // Fyren widget + tyst inspelning (design lock)
  mustInclude(
    'docs/design/WIDGET-BAR-SPEC.md',
    'FyrenWidgetBar',
    'Tyst inspelning',
    'reality_vault',
    'W1',
  );
  mustInclude('docs/design/HOMESCREEN-WIDGETS-SPEC.md', 'WH1', 'ingestWidgetRecording');
  mustInclude('src/modules/core/components/FyrenSmartWidgetBar.tsx', 'FyrenSmartWidgetBar', 'useLongPress', 'delayMs: 3000');
  mustInclude('src/modules/core/layout/MainLayout.tsx', 'FyrenSmartWidgetBar');
  mustInclude('src/modules/widgets/pages/WidgetRecordPage.tsx', 'useWidgetVaultRecording');
  mustInclude('src/modules/widgets/pages/WidgetFamiljenPage.tsx', 'widget_snabb');
  mustInclude('src/modules/widgets/api/widgetVaultRecording.ts', 'SAMMANFATTNING');
  mustInclude('public/manifest.webmanifest', '/widget/inspelning', '/widget/familjen', '/widget/stampla');
  mustInclude(
    'android/app/src/main/java/com/livskompassen/app/widgets/StampWidgetProvider.java',
    'widget/stampla',
  );
  mustInclude('docs/design/ANDROID-WIDGETS-SPEC.md', 'RecordWidgetProvider', 'Capacitor');
  mustInclude(
    'android/app/src/main/java/com/livskompassen/app/widgets/RecordWidgetProvider.java',
    'WidgetLaunch',
  );
  mustInclude('src/modules/widgets/WidgetDeepLinkBridge.tsx', 'livskompassen-widget-nav');

  // Barnporten (design lock)
  mustInclude(
    'docs/design/BARNPORTEN-SPEC.md',
    'Barnporten',
    'barnportenAgents',
    'promoteChildLogToVault',
    'children_logs',
    'BARNPORTEN_AGENTS',
  );
  mustInclude(
    'src/modules/barnporten/constants/barnportenAgents.ts',
    'Trygg-Kompisen',
    'agent_trygg_kompisen',
  );
  mustInclude(
    '.context/locked-ux-features.md',
    'Barnporten',
    'Planeringssidan',
    'Fyren Edge',
  );

  const mockDir = resolve(root, 'docs/design/barnporten/mockups');
  assert(existsSync(mockDir), 'saknar mapp: docs/design/barnporten/mockups');

  mustInclude('src/modules/kompasser/components/VardagenPage.tsx', 'vaultDrawerPath', 'kunskap');
  mustInclude('src/modules/core/home/LivskompassHero.tsx', 'vaultTab=kunskapsbank');
  mustInclude(
    'docs/design/references/MENU-DRAWER-KANON.md',
    'MENU-DRAWER-KANON.png',
    'Vardag',
    'Valv',
    'Kunskapsbank',
    'navTruth.ts',
    'DrawerModeToggle',
    'isInValvDrawerContext',
    'showValvShell',
    'Pansaret',
    'Forensik',
  );
  assert(
    existsSync(resolve(root, 'docs/design/references/MENU-DRAWER-KANON.png')),
    'saknar: docs/design/references/MENU-DRAWER-KANON.png',
  );

  // Theme Pack J — hub chrome (navTruth, typeScale, drawer quick actions)
  mustInclude(
    'src/modules/core/navigation/navTruth.ts',
    'NAV_TRUTH',
    'DRAWER_VARDAG_ENTRIES',
    'DRAWER_VALV_ENTRIES',
    'vaultDrawerPath',
    "section: 'valv'",
    'valv_grp_pansaret',
    'valv_grp_forensik',
    'getDrawerRoots',
    'planering_handling',
    'hem_inkast',
  );
  mustInclude('src/modules/core/navigation/drawerNav.ts', 'DRAWER_VARDAG_ITEMS', 'DRAWER_VALV_ITEMS', 'navTruth');
  mustInclude('src/modules/core/layout/HubPageShell.tsx', 'hubHeaderClasses', 'hub-page-shell');
  mustInclude('src/modules/core/ui/typeScale.ts', 'hubHeaderClasses', 'titleHub');
  mustInclude(
    'src/modules/core/layout/NavigationDrawer.tsx',
    'DrawerModeToggle',
    'DrawerHubAccordion',
    'nav-drawer__section-title',
    'isInValvDrawerContext',
    'showValvShell',
  );
  mustInclude('src/modules/core/layout/DrawerHubAccordion.tsx', 'nav-drawer__row--sub', 'isDrawerItemActive');
  mustInclude('src/modules/core/components/DrawerHomeQuickActions.tsx', 'FYREN_HOME_QUICK_ACTIONS');
  mustInclude('src/modules/barnens_livsloggar/components/FamiljenPage.tsx', 'HubPageShell', 'ParentReminderFooter');
  mustInclude(
    'src/modules/mabra/components/MabraPage.tsx',
    'HubPageShell',
    'DagligMixPanel',
    'handleDagligMixComplete',
  );
  mustInclude(
    'src/modules/planering/components/PlaneringPage.tsx',
    'HubPageShell',
    'PlanningKanbanBoard',
  );
  assert(existsSync(resolve(root, 'docs/design/CHROME-POLICY.md')), 'saknar: CHROME-POLICY.md');
  assert(existsSync(resolve(root, 'docs/design/TYPE-SCALE.md')), 'saknar: TYPE-SCALE.md');
  assert(existsSync(resolve(root, '.context/locked-icons.md')), 'saknar: .context/locked-icons.md');
  assert(existsSync(resolve(root, 'docs/design/ICON-STYLE-GUIDE.md')), 'saknar: ICON-STYLE-GUIDE.md');
  mustInclude('src/modules/kompis/components/KompisAvatar.tsx', 'KompisMark');

  console.log(
    '[smoke:locked-ux] PASS — Barnfokus, Valv-baksida (Mönster/Orkester/Kunskapsbank), drawer Vardag+Valv, Planering, Widget, Barnporten.',
  );
}

try {
  main();
} catch (err) {
  console.error('[smoke:locked-ux] FAIL —', err.message || err);
  process.exit(1);
}
