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
    'src/modules/features/family/children/components/BarnfokusFraganPanel.tsx',
    'Barnfokus',
    'Minneslista',
    'Spara till',
    's logg',
    'Annan fråga',
  );
  mustInclude(
    'src/modules/features/family/children/components/BarnensPage.tsx',
    'BarnfokusFraganPanel',
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/features/family/children/hooks/useFamiljenShell.ts',
    "category: 'barnfokus'",
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/core/pages/FamiljenPage.tsx',
    'BarnfokusSuperModule',
    'vaultDrawerPath',
  );
  mustInclude(
    'src/modules/features/family/children/components/familjen/BarnfokusSuperModule.tsx',
    'FamiljenReflektionTab',
    'FamiljenLivsloggTab',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/knowledge/components/VaultKunskapsbankPanel.tsx',
    'FamiljenKunskapHubTab',
    'KunskapPage',
  );
  mustInclude(
    'src/modules/features/family/children/components/familjen/FamiljenReflektionTab.tsx',
    'BarnfokusFraganPanel',
    'handleSaveBarnfokus',
  );
  mustInclude(
    'src/modules/features/family/children/constants.ts',
    'BARNFOKUS_QUESTIONS',
    'barnfokusQuestionForToday',
    'valv_safe',
  );

  // Valv Mönster + Orkester (tab labels: tabRegistry · panels: VaultPage)
  mustInclude(
    'src/modules/core/copy/valvNavCopy.ts',
    'VAULT_MAIN_TAB_LABELS',
    'Meddelanden eller SMS-analys',
    'VALV_ZONE_LABELS',
  );
  mustInclude(
    'src/modules/core/copy/valvNavCopy.ts',
    'monster: \'Mönster\'',
    'Kunskapsbank',
    'aktorskarta: \'Personer i ärendet\'',
  );
  mustInclude(
    'src/modules/core/navigation/tabRegistry.ts',
    'MAIN_VAULT_TAB_IDS',
    'PANSARET_VAULT_TAB_IDS',
    'VAULT_MAIN_TAB_LABELS',
    'getKunskapVaultTabBarItems',
    'getVaultZoneTabBarItems',
    'getSamlaVaultTabBarItems',
    'getAnalyseraVaultTabBarItems',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/utils/vaultTabs.ts',
    "'monster'",
    "'orkester'",
    "'kunskapsbank'",
    "'aktorskarta'",
    'SAMLA_VAULT_TAB_IDS',
    'ANALYSERA_VAULT_TAB_IDS',
    'KUNSKAP_VAULT_TAB_IDS',
    'VALV_ZONE_IDS',
    'resolveValvZone',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx',
    'getVaultZoneTabBarItems',
    'VaultValvBreadcrumb',
    'ValvSuperModule',
    'onVaultTabChange',
  );
  assert(
    !read('src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx').includes(
      'getSamlaVaultTabBarItems',
    ),
    'VaultPage.tsx',
    'sub-TabBar delegerad till zoner (ValvSuper Fas 2)',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/zones/ValvSamlaZone.tsx',
    'getSamlaVaultTabBarItems',
    'VaultSamlaHub',
    'WeaverPendingVaultBanner',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/zones/ValvAnalyseraZone.tsx',
    'getAnalyseraVaultTabBarItems',
    'VaultMonsterPanel',
    'VaultOrkesterPanel',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/zones/ValvKunskapZone.tsx',
    'getKunskapVaultTabBarItems',
    'VaultKunskapsbankPanel',
    'VaultAktorskartaPanel',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/zones/ValvForensikZone.tsx',
    'getForensicVaultTabBarItems',
    'VaultForensicPanel',
  );
  mustInclude(
    'src/modules/core/pages/ValvetRoutePage.tsx',
    "params.delete('samlaView')",
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultSamlaHub.tsx',
    'VaultInkastCompact',
    'VaultSamlaDriveHint',
    'samlaView',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/knowledge/components/VaultAktorskartaPanel.tsx',
    'EntityAddForm',
    'fetchEntityProfileRegistry',
    'VaultAktorskartaPanel',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/kompis/components/EntityAddForm.tsx',
    'createEntityProfile',
    'Lägg till person',
  );
  mustInclude(
    'functions/src/index.ts',
    'addEntityProfile',
    'getEntityProfileRegistry',
  );
  mustInclude(
    'functions/src/lib/entityProfileStore.ts',
    'addUserEntityProfile',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultValvBreadcrumb.tsx',
    'ZONE_LABEL',
    'getVaultZoneTabBarItems',
  );
  mustInclude(
    'src/modules/core/navigation/navTruth.ts',
    'VALV_ZONE_LABELS.kunskap',
    'VALV_KUNSKAP_DRAWER_LEAF',
    'valv_aktorskarta',
    'DAGBOK_BEVIS_DRAWER_LABEL',
  );
  mustInclude(
    'src/modules/core/copy/valvNavCopy.ts',
    'Fråga & tidslinje',
    'Personer i ärendet',
  );
  mustInclude(
    'src/modules/core/navigation/tabRegistry.ts',
    'TAB_CATEGORY_LABELS',
    'groupVardagDrawerRoots',
  );
  mustInclude('src/modules/core/layout/DrawerHubAccordion.tsx', 'isDrawerLinkActive', 'drawer-hub__link');
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultMonsterPanel.tsx',
    'Frekvensanalys',
    'buildVaultFrequencyReport',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultOrkesterPanel.tsx',
    'Assistentroller',
    'Kör mönstersökning',
    'analyzeBiffMessage',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/utils/vaultPatternScan.ts',
    'buildVaultFrequencyReport',
  );

  mustInclude('src/modules/core/ui/ValvArchIcon.tsx', 'ValvArchIcon');
  mustInclude(
    'src/modules/core/layout/DockHubBand.tsx',
    'getDockSideLinks',
    'aria-label="Hem',
    'delayMs: 3000',
    'openValvViaFyren',
    'FyrenProgressRing',
    'openValvViaFyren',
  );
  mustInclude('src/modules/core/auth/valvFyrenGate.ts', 'authenticateVaultGate', 'setVaultGate');
  mustInclude('src/modules/features/lifeJournal/evidence/vault/utils/vaultTabs.ts', 'VALV_ZONE_INGRESS');
  mustInclude('src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx', 'VALV_ZONE_INGRESS');
  mustInclude('src/modules/features/lifeJournal/evidence/vault/components/zones/ValvSamlaZone.tsx', 'WeaverPendingVaultBanner');
  mustInclude('src/modules/core/auth/valvFyrenGate.ts', 'setVaultGate', 'openValvViaFyren');
  mustInclude('src/modules/core/navigation/navTruth.ts', "id: 'vardagen'", '/vardagen', "label: 'Liv och göra'", 'getNavChildren');
  mustInclude(
    'src/modules/capture/CaptureSuperModule.tsx',
    'CaptureSuperModule',
    'InkastDirectPanel',
    'ReviewQueuePipelinePanel',
    'hem-inkast',
    'id="inkast-lite"',
  );
  mustInclude(
    'src/modules/capture/ReviewQueuePipelinePanel.tsx',
    'ReviewQueuePipelinePanel',
    'fetchInboxQueue',
    'VALV_SAMLA_GRANSKA_LINK',
  );
  assert(
    !read('src/modules/core/pages/HomePage.tsx').includes('ReviewQueuePanel'),
    'HomePage.tsx',
    'delegerar review-kö till CaptureSuperModule — inte direkt ReviewQueuePanel-import',
  );
  mustInclude(
    'src/modules/capture/InkastDirectPanel.tsx',
    'submitInkastLite',
    'formatInkastResultMessage',
  );
  mustInclude('src/modules/inkast/api/inkastService.ts', 'parseSubmitInkastLiteResult');
  mustInclude('src/modules/core/pages/HomePage.tsx', 'CaptureSuperModule');
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
  mustInclude('src/modules/features/admin/planning/components/RoutinesPanel.tsx', 'runRoutine', '<select');
  mustInclude('src/modules/features/admin/planning/components/PlaneringNextStepSelect.tsx', 'Nästa steg');
  mustInclude('src/modules/features/admin/planning/components/PlanningTaskDetail.tsx', '<select');
  mustInclude('src/modules/features/admin/projects/components/ProjektNyPage.tsx', '/admin/projects/ny');
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
  mustInclude('firestore.rules', 'match /project_rules/{docId}');
  mustInclude('src/modules/features/admin/projects/api/projectRulesApi.ts', 'listenProjectRules');

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
  mustInclude('src/modules/features/widgets/pages/WidgetRecordPage.tsx', 'useWidgetVaultRecording');
  mustInclude('src/modules/features/widgets/pages/WidgetFamiljenPage.tsx', 'widget_snabb');
  mustInclude('src/modules/features/widgets/api/widgetVaultRecording.ts', 'SAMMANFATTNING');
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
  mustInclude('src/modules/features/widgets/WidgetDeepLinkBridge.tsx', 'livskompassen-widget-nav');

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
    'src/modules/features/onboarding/barnporten/constants/barnportenAgents.ts',
    'Trygg-Kompisen',
    'agent_trygg_kompisen',
  );
  mustInclude(
    'src/modules/features/onboarding/barnporten/components/BarnportenWidget.tsx',
    'BarnportenWidget',
    'saveBarnportenLog',
    'quickAvsig',
  );
  mustInclude(
    'src/modules/features/onboarding/barnporten/api/saveBarnportenLog.ts',
    "authorRole: 'child'",
    "channel: 'barnporten'",
  );
  mustInclude(
    'src/modules/features/widgets/routing/WidgetRoutes.tsx',
    'WidgetBarnportenPage',
    'barnporten',
  );
  mustInclude('public/barnporten-manifest.webmanifest', '/widget/barnporten');
  mustInclude(
    '.context/locked-ux-features.md',
    'Barnporten',
    'Planeringssidan',
    'Fyren Edge',
    'Aktörskarta',
    'VaultAktorskartaPanel',
    'Inkorg → Valv-bro',
    'barnporten-inkorg-valv-kanon.png',
    'Human-In-The-Loop',
  );
  mustInclude(
    'src/modules/features/onboarding/barnporten/components/BarnportenInboxPanel.tsx',
    'BarnportenInboxPanel',
    'Granska i arkiv',
    'Skapa trygghet. Bygg tillit.',
    'Flytta till Valv (HITL)',
    'SaveAsEvidencePrompt',
  );
  mustInclude('src/modules/features/onboarding/barnporten/api/barnportenOfflineQueue.ts', 'enqueueBarnportenLog');
  mustInclude('src/modules/core/components/FyrenWidgetBar.tsx', "id: 'inkast'", '/#inkast-lite');
  mustInclude(
    'src/modules/features/family/children/components/SaveAsEvidencePrompt.tsx',
    'SaveAsEvidencePrompt',
    'Spara som bevis',
    'Shield',
    'buildVaultPayloadFromChildLog',
  );
  mustInclude(
    'src/modules/features/family/children/utils/childLogEvidence.ts',
    'sourceRef',
    'children_logs/',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultLogList.tsx',
    'SERVER-TIDSSTÄMPEL',
  );

  const mockDir = resolve(root, 'docs/design/barnporten/mockups');
  assert(existsSync(mockDir), 'saknar mapp: docs/design/barnporten/mockups');
  assert(
    existsSync(resolve(mockDir, 'barnporten-inkorg-valv-kanon.png')),
    'saknar: barnporten-inkorg-valv-kanon.png',
  );

  mustInclude('src/modules/features/dailyLife/wellbeing/compasses/components/VardagenPage.tsx', 'vaultDrawerPath', 'kunskap');
  mustInclude('src/modules/core/home/livskompassHeroConfig.ts', "vaultDrawerPath('kunskapsbank')");
  mustInclude(
    'docs/design/references/MENU-DRAWER-KANON.md',
    'MENU-DRAWER-KANON.png',
    'Vardag',
    'Valv',
    'Göra',
    'Kunskapsbank',
    'navTruth.ts',
    'DrawerModeToggle',
    'Vardag + Valv',
    'showValvShell',
    'Pansaret',
    'Forensik',
    'Djupare',
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
    'valv_grp_samla',
    'valv_samla',
    'valv_analysera',
    'valv_forensik',
    'getDrawerRoots',
    'vardagen_handling',
    'familjen_hamn',
    'familjen_drogfrihet',
    'familjen_barnporten',
    'familjen_tillsammans',
  );
  mustInclude('src/modules/core/navigation/drawerNav.ts', 'DRAWER_VARDAG_ITEMS', 'DRAWER_VALV_ITEMS', 'navTruth');
  mustInclude('src/modules/core/layout/HubPageShell.tsx', 'hubHeaderClasses', 'hub-page-shell');
  mustInclude('src/modules/core/ui/typeScale.ts', 'hubHeaderClasses', 'titleHub');
  mustInclude(
    'src/modules/core/layout/NavigationDrawer.tsx',
    'DrawerModeToggle',
    'DrawerHubAccordion',
    'Vardag',
    'Valvet',
    'vaultOpen',
    'showValvShell',
    'nav-drawer__backdrop',
    'DRAWER_VALV_ITEMS',
    'handleLockVaultImmediately',
    'Lås Valvet nu',
  );
  assert(
    !read('src/modules/core/layout/NavigationDrawer.tsx').includes('DrawerQuickActions'),
    'NavigationDrawer.tsx får inte montera DrawerQuickActions (MENU-DRAWER-KANON)',
  );
  assert(
    !read('src/modules/core/layout/NavigationDrawer.tsx').includes('DrawerHomeQuickActions'),
    'NavigationDrawer.tsx får inte montera DrawerHomeQuickActions (MENU-DRAWER-KANON)',
  );
  assert(
    !read('src/modules/core/layout/CompassHubOrb.tsx').includes('dock-compass-hub__label'),
    'CompassHubOrb: ingen synlig mitt-etikett (DOCK-KANON)',
  );
  mustInclude('src/modules/core/layout/DrawerModeToggle.tsx', 'if (!showValvShell) return null');
  mustInclude('src/modules/core/layout/DrawerHubAccordion.tsx', 'isDrawerItemActive', 'glowColor');
  mustInclude('src/modules/core/components/DrawerHomeQuickActions.tsx', 'FYREN_HOME_QUICK_ACTIONS');
  mustInclude('src/modules/core/pages/FamiljenPage.tsx', 'HubPageShell', 'ParentReminderFooter');
  mustInclude(
    'src/modules/core/pages/FamiljenPage.tsx',
    'HubDropdownNav',
    'glowColor="blue"',
    "id: 'reflektion'",
    "id: 'livslogg'",
    "id: 'tillsammans'",
    "id: 'barnporten'",
    "id: 'hamn'",
    "id: 'drogfrihet'",
    'SafeHarborPage embedded',
    'DrogfrihetHubPage embedded',
  );
  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'path="/barnen"',
    'path="/hamn"',
    'RedirectHamnToFamiljen',
    "search: '?tab=hamn'",
    'RedirectDrogfrihetToFamiljen',
    'path="/drogfrihet"',
  );
  mustInclude(
    'src/modules/core/navigation/navigationRegistry.ts',
    "hamn: { id: 'hamn', label: 'Trygg hamn'",
    "drogfrihet: { id: 'drogfrihet', label: 'Drogfrihet'",
    "barnporten: { id: 'barnporten'",
    "tillsammans: { id: 'tillsammans'",
  );
  mustInclude(
    'src/modules/core/navigation/hubContextBar.ts',
    "id: 'barnporten'",
    '/familjen?tab=barnporten',
    "id: 'hamn'",
  );
  mustInclude('src/modules/features/family/safeHarbor/components/SafeHarborPage.tsx', 'embedded', '!embedded');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/MabraPage.tsx',
    'HubPageShell',
    'DagligMixPanel',
    'handleDagligMixComplete',
    'MabraHubCollapsible',
  );
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/components/ValuesCompass.tsx', '<select');
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/components/MabraVitHub.tsx', 'Snabbstart');
  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringPage.tsx',
    'HubPageShell',
    'PlanningKanbanBoard',
    'GoraHubTabBar',
    'PLANERING_MORE_TABS',
    'Fler verktyg',
  );
  mustInclude('src/modules/features/admin/planning/constants.ts', 'PLANERING_MORE_TABS', 'fokus', 'framsteg', 'regler');
  mustInclude('src/modules/core/navigation/GoraHubTabBar.tsx', 'resolveGoraTab', 'GoraHubTabBar');
  mustInclude('src/modules/features/admin/projects/components/ProjektHubPage.tsx', 'GoraHubTabBar', 'HubPageShell');
  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringHub.tsx',
    'PlaneringHubBody',
    'usePlaneringHubLayout',
  );
  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringInkorgPanel.tsx',
    'InboxReviewQueue',
  );
  mustInclude('src/modules/inkast/components/InboxReviewQueue.tsx', 'confirmInbox', 'dismissInbox');
  mustInclude(
    'src/modules/inkast/components/InboxReviewQueue.tsx',
    'inboxQueueStatusLabel',
    'sortInboxForValvSamla',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultSamlaHub.tsx',
    'InboxReviewQueue',
  );
  assert(existsSync(resolve(root, 'docs/design/CHROME-POLICY.md')), 'saknar: CHROME-POLICY.md');
  assert(existsSync(resolve(root, 'docs/design/TYPE-SCALE.md')), 'saknar: TYPE-SCALE.md');
  assert(existsSync(resolve(root, '.context/locked-icons.md')), 'saknar: .context/locked-icons.md');
  assert(existsSync(resolve(root, 'docs/design/ICON-STYLE-GUIDE.md')), 'saknar: ICON-STYLE-GUIDE.md');
  mustInclude(
    'src/modules/features/lifeJournal/evidence/kompis/components/KompisAvatar.tsx',
    'KompisMark',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/kompis/components/KnowledgeCitationList.tsx',
    'KnowledgeCitationList',
    'onCitationClick',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/kompis/components/KunskapPage.tsx',
    'handleCitationClick',
    'focusKampsparId',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/knowledge/components/VaultKunskapsbankPanel.tsx',
    'onKampsparCitationClick',
    'focusKampsparId',
    'vaultDrawerPath',
    'aktorskarta',
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

  mustInclude(
    'src/modules/core/security/clearDeviceSession.ts',
    'clearDeviceSession',
    'clearAllDrafts',
  );
  mustInclude('src/modules/core/pages/InstallningarPage.tsx', 'ClearDevicePanel');
  mustInclude('src/modules/features/lifeJournal/diary/mirror/utils/speglarSessionStorage.ts', 'clearSpeglarSession');
  assert(
    !read('src/App.tsx').includes('useShakeToKill'),
    'App.tsx får inte montera useShakeToKill (Kill Switch borttagen)',
  );
  assert(
    !existsSync(resolve(root, 'src/modules/core/hooks/useShakeToKill.ts')),
    'useShakeToKill.ts ska vara borttagen',
  );

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
