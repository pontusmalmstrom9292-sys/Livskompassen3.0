/**
 * Static smoke: Locked UX features must exist in source (no Firebase).
 * Usage: npm run smoke:locked-ux
 */
import fs, { readFileSync, existsSync } from 'fs';
import path, { resolve, dirname } from 'path';
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
    'src/modules/family/children/components/BarnfokusFraganPanel.tsx',
    'Barnfokus',
    'Minneslista',
    'Spara till',
    's logg',
    'Annan fråga',
  );
  mustInclude(
    'src/modules/family/children/components/BarnensPage.tsx',
    'BarnfokusFraganPanel',
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/family/children/hooks/useFamiljenShell.ts',
    "category: 'barnfokus'",
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/family/children/components/FamiljenPage.tsx',
    'FamiljenReflektionTab',
    'vaultDrawerPath',
  );
  mustInclude(
    'src/modules/evidence/knowledge/components/VaultKunskapsbankPanel.tsx',
    'FamiljenKunskapHubTab',
    'KunskapPage',
  );
  mustInclude(
    'src/modules/family/children/components/familjen/FamiljenReflektionTab.tsx',
    'BarnfokusFraganPanel',
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/family/children/constants.ts',
    'BARNFOKUS_QUESTIONS',
    'barnfokusQuestionForToday',
    'valv_safe',
  );

  // Valv Mönster + Orkester (tab labels: tabRegistry · panels: VaultPage)
  mustInclude(
    'src/modules/core/navigation/tabRegistry.ts',
    'MAIN_VAULT_TAB_IDS',
    'PANSARET_VAULT_TAB_IDS',
    'Mönster',
    'Orkester',
    'Kunskapsbank',
    'getVaultZoneTabBarItems',
    'getPansaretVaultTabBarItems',
  );
  mustInclude(
    'src/modules/evidence/vault/utils/vaultTabs.ts',
    "'monster'",
    "'orkester'",
    "'kunskapsbank'",
    'PANSARET_VAULT_TAB_IDS',
    'VALV_ZONE_IDS',
    'resolveValvZone',
  );
  mustInclude(
    'src/modules/evidence/vault/components/VaultPage.tsx',
    'getVaultZoneTabBarItems',
    'getPansaretVaultTabBarItems',
    'VaultValvBreadcrumb',
    'VaultMonsterPanel',
    'VaultOrkesterPanel',
    'VaultKunskapsbankPanel',
  );
  mustInclude(
    'src/modules/evidence/vault/components/VaultValvBreadcrumb.tsx',
    'Kunskapsbank',
  );
  mustInclude(
    'src/modules/core/navigation/navTruth.ts',
    "label: 'Kunskapsbank'",
    'Chat & Tidshjul',
  );
  mustInclude(
    'src/modules/core/navigation/tabRegistry.ts',
    'TAB_CATEGORY_LABELS',
    'groupVardagDrawerRoots',
  );
  mustInclude('src/modules/core/layout/DrawerHubAccordion.tsx', 'groupVardagDrawerRoots');
  mustInclude(
    'src/modules/evidence/vault/components/VaultMonsterPanel.tsx',
    'Frekvensanalys',
    'buildVaultFrequencyReport',
  );
  mustInclude(
    'src/modules/evidence/vault/components/VaultOrkesterPanel.tsx',
    'AI-Orkestern',
    'Kör mönstersökning',
    'analyzeBiffMessage',
  );
  mustInclude(
    'src/modules/evidence/vault/utils/vaultPatternScan.ts',
    'buildVaultFrequencyReport',
  );

  mustInclude('src/modules/core/ui/ValvArchIcon.tsx', 'ValvArchIcon');
  mustInclude(
    'src/modules/core/layout/DockHubBand.tsx',
    'getDockSideLinks',
    'aria-label="Hem',
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
  mustInclude('src/modules/core/pages/InstallningarPage.tsx', 'LifeHubPresetPicker');
  mustInclude('src/modules/admin/planning/components/RoutinesPanel.tsx', 'runRoutine');
  mustInclude('src/modules/admin/projects/components/ProjektNyPage.tsx', '/admin/projects/ny');
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
  mustInclude('src/modules/core/components/FyrenSmartWidgetBar.tsx', 'FyrenSmartWidgetBar');
  mustInclude('src/modules/core/layout/MainLayout.tsx', 'FyrenSmartWidgetBar');
  mustInclude('src/modules/core/layout/DrawerQuickActions.tsx', 'HUB_MORE_ACTIONS', 'Snabbval');
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
    'src/modules/barnporten/components/BarnportenWidget.tsx',
    'BarnportenWidget',
    'saveBarnportenLog',
    'quickAvsig',
  );
  mustInclude(
    'src/modules/barnporten/api/saveBarnportenLog.ts',
    "authorRole: 'child'",
    "channel: 'barnporten'",
  );
  mustInclude(
    'src/modules/widgets/routing/WidgetRoutes.tsx',
    'WidgetBarnportenPage',
    'barnporten',
  );
  mustInclude('public/barnporten-manifest.webmanifest', '/widget/barnporten');
  mustInclude(
    '.context/locked-ux-features.md',
    'Barnporten',
    'Planeringssidan',
    'Fyren Edge',
  );

  const mockDir = resolve(root, 'docs/design/barnporten/mockups');
  assert(existsSync(mockDir), 'saknar mapp: docs/design/barnporten/mockups');

  mustInclude('src/modules/wellbeing/compasses/components/VardagenPage.tsx', 'vaultDrawerPath', 'kunskap');
  mustInclude('src/modules/core/home/livskompassHeroConfig.ts', 'vaultTab=kunskapsbank');
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
  mustInclude('src/modules/family/children/components/FamiljenPage.tsx', 'HubPageShell', 'ParentReminderFooter');
  mustInclude(
    'src/modules/wellbeing/mabra/components/MabraPage.tsx',
    'HubPageShell',
    'DagligMixPanel',
    'handleDagligMixComplete',
  );
  mustInclude(
    'src/modules/admin/planning/components/PlaneringPage.tsx',
    'HubPageShell',
    'PlanningKanbanBoard',
  );
  mustInclude(
    'src/modules/admin/planning/components/PlaneringHub.tsx',
    'PlaneringHubBody',
    'usePlaneringHubLayout',
  );
  mustInclude(
    'src/modules/admin/planning/components/PlaneringInkorgPanel.tsx',
    'InboxReviewQueue',
  );
  mustInclude('src/modules/inkast/components/InboxReviewQueue.tsx', 'confirmInbox', 'dismissInbox');
  assert(existsSync(resolve(root, 'docs/design/CHROME-POLICY.md')), 'saknar: CHROME-POLICY.md');
  assert(existsSync(resolve(root, 'docs/design/TYPE-SCALE.md')), 'saknar: TYPE-SCALE.md');
  assert(existsSync(resolve(root, '.context/locked-icons.md')), 'saknar: .context/locked-icons.md');
  assert(existsSync(resolve(root, 'docs/design/ICON-STYLE-GUIDE.md')), 'saknar: ICON-STYLE-GUIDE.md');
  mustInclude(
    'src/modules/evidence/kompis/components/KompisAvatar.tsx',
    'KompisMark',
  );
  mustInclude(
    'src/modules/evidence/kompis/components/KnowledgeCitationList.tsx',
    'KnowledgeCitationList',
    'onCitationClick',
  );
  mustInclude(
    'src/modules/evidence/kompis/components/KunskapPage.tsx',
    'handleCitationClick',
    'focusKampsparId',
  );
  mustInclude(
    'src/modules/evidence/knowledge/components/VaultKunskapsbankPanel.tsx',
    'onKampsparCitationClick',
    'focusKampsparId',
  );

  // Post-kluster: produktionskod ska inte importera via borttagna rot-shims
  const legacyImportRoots = [
    'modules/dagbok',
    'modules/kompasser',
    'modules/verklighetsvalvet',
    'modules/planering',
    'modules/mabra',
    'modules/speglings_system',
    'modules/barnens_livsloggar',
    'modules/projekt',
    'modules/valv_chatt',
    'modules/dossier',
    'modules/kompis',
    'modules/ekonomi',
    'modules/safe_harbor',
    'modules/stampla',
  ];
  const srcFiles = [];
  function walkSrc(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) {
        if (name === 'node_modules' || name === 'dist') continue;
        walkSrc(full);
      } else if (/\.(tsx?)$/.test(name)) {
        srcFiles.push(full);
      }
    }
  }
  walkSrc(resolve(root, 'src'));
  const shimIndexOnly = /^src\/modules\/(kompis|ekonomi|safe_harbor|stampla)\/index\.ts$/;
  for (const file of srcFiles) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    if (shimIndexOnly.test(rel)) continue;
    const text = readFileSync(file, 'utf8');
    for (const shim of legacyImportRoots) {
      assert(
        !new RegExp(`from ['"]${shim.replace('/', '\\/')}`).test(text),
        `${rel} importerar legacy-shim ${shim}`,
      );
    }
  }

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
