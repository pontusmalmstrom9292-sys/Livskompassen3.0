/**
 * Static smoke: P1 design modules wired (D3, D12–D14, D16–D20, D22–D23, D29).
 * Usage: npm run smoke:design-modules
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, rel, message) {
  if (!condition) throw new Error(`${rel}: ${message}`);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), relPath, 'saknar fil');
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), relPath, `saknar: ${needle}`);
  }
}

function mustNotInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(!text.includes(needle), relPath, `får inte innehålla: ${needle}`);
  }
}

function main() {
  mustInclude('src/modules/core/home/HomeActionHub.tsx', 'KompassradPanel');
  mustInclude('src/modules/features/family/safeHarbor/components/SafeHarborPage.tsx', 'TryggHamnHub');
  mustInclude('src/modules/features/family/safeHarbor/components/BiffPublicPanel.tsx', 'BiffTriagePanel');
  mustInclude('src/modules/features/family/safeHarbor/components/TryggHamnHub.tsx', 'BiffPublicPanel', 'Brusfilter');
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/components/DrogfrihetHubPage.tsx',
    'DROGFRIHET_CARDS',
    'DROGFRIHET_SUBTABS',
    'drogfrihetTab',
    'Akut: 113',
  );
  mustInclude(
    'src/modules/core/pages/FamiljenPage.tsx',
    "id: 'drogfrihet'",
    'DrogfrihetHubPage embedded',
    'ModuleShell',
    'FamiljenInputSuperModule',
    'fitViewport',
  );
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'RedirectDrogfrihetToFamiljen', "tab: 'drogfrihet'", 'drogfrihetTab');
  assert(
    !read('src/modules/core/routing/AppRoutes.tsx').includes('DrogfrihetHubPage'),
    'AppRoutes.tsx',
    'mountar inte DrogfrihetHubPage direkt — Familjen embedded',
  );
  mustInclude('src/modules/core/navigation/navTruth.ts', 'familjen_drogfrihet', '/familjen?tab=drogfrihet');
  assert(
    !read('src/modules/core/navigation/navTruth.ts').includes('vardagen_drogfrihet'),
    'navTruth.ts',
    'drogfrihet ska inte ligga under vardagen',
  );
  mustInclude('src/modules/core/home/HomeHeroCompass.tsx', 'HomeHeroKanon');
  mustInclude('src/modules/features/lifeJournal/diary/mirror/components/SpeglingsSystem.tsx', 'VivirQuickEntry', 'SvartPaVittForm');
  mustInclude(
    'src/modules/features/lifeJournal/diary/mirror/components/ActCalibrationView.tsx',
    'Fortsätt till VIVIR',
    'onContinue',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/mirror/components/SpeglarSuperModule.tsx',
    'SpeglarSuperModule',
    "'dagbok'",
    "'forensic'",
    "variant === 'forensic'",
  );
  mustInclude('src/modules/core/pages/DagbokPage.tsx', 'SpeglarSuperModule', "variant=\"dagbok\"");
  mustInclude('src/modules/core/pages/DagbokPage.tsx', 'DagbokInputSuperModule', 'HjartatReflektionPanel');
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/DagbokSuperModule.tsx',
    'DagbokSuperModule',
    "'reflektion'",
    "'forensic-readonly'",
    'JournalArchiveReadonly',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/diary/components/DagbokPage.tsx',
    'JournalArchiveReadonly',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultForensicPanel.tsx',
    'SpeglarSuperModule',
    "variant=\"forensic\"",
    'DagbokSuperModule',
    "variant=\"forensic-readonly\"",
  );
  assert(
    !read('src/modules/features/lifeJournal/evidence/vault/components/VaultForensicPanel.tsx').includes(
      'SpeglingsForensicPanel',
    ),
    'VaultForensicPanel.tsx',
    'delegerar till SpeglarSuperModule — inte direkt forensic-import',
  );
  assert(
    !read('src/modules/features/lifeJournal/evidence/vault/components/VaultForensicPanel.tsx').includes(
      'JournalArchive',
    ),
    'VaultForensicPanel.tsx',
    'delegerar journal-arkiv till DagbokSuperModule — inte direkt JournalArchive-import',
  );
  mustInclude(
    'src/modules/features/lifeJournal/diary/mirror/components/SpeglingsSystem.tsx',
    '/familjen?tab=hamn',
    'prefilledMessage',
  );
  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'RedirectHamnToFamiljen',
    'state={location.state}',
  );
  mustInclude(
    'src/modules/features/family/safeHarbor/components/SafeHarborPage.tsx',
    'prefilledMessage',
    'initialMessage={prefilledMessage}',
  );
  mustInclude(
    'src/modules/features/family/children/components/familjen/FamiljenReflektionTab.tsx',
    'ChildProfileCards',
    'PositivaMinnesankare',
    'BalansMatare',
  );
  mustInclude('src/modules/core/pages/FamiljenPage.tsx', 'ParentReminderFooter');
  mustInclude(
    'src/modules/core/pages/FamiljenPage.tsx',
    'FamiljenInputSuperModule',
    'FamiljenReflektionTab',
    'FamiljenLivsloggTab',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx',
    'ValvInputSuperModule',
    'canonicalValvRoute',
    'onVaultTabChange',
    'onValvModeChange',
  );
  assert(
    !read('src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx').includes(
      'getSamlaVaultTabBarItems',
    ) &&
      !read('src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx').includes(
        'getVaultZoneTabBarItems',
      ),
    'VaultPage.tsx',
    'zon-TabBar delegerad till ValvInputSuperModule / zoner (SuperModule Fas 1)',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/ValvSuperModule.tsx',
    'ValvSuperModule',
    "'samla'",
    "'analysera'",
    "'kunskap'",
    "'exportera'",
    "'forensik'",
    'ValvSamlaZone',
    'ValvForensikZone',
    'onVaultTabChange',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/components/zones/ValvAnalyseraZone.tsx',
    'PansaretHeader',
    'VaultMonsterPanel',
    'VaultOrkesterPanel',
  );
  assert(
    !read('src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx').includes('VaultMonsterPanel'),
    'VaultPage.tsx',
    'delegerar zonsinnehåll till ValvSuperModule — inte direkt Mönster-import',
  );
  mustInclude('src/modules/core/copy/valvNavCopy.ts', "logga: 'Arkiv'", "sok: 'Sök i arkiv'");
  mustInclude('src/modules/core/navigation/tabRegistry.ts', 'VAULT_MAIN_TAB_LABELS', 'getNavChildren');
  mustInclude('src/modules/features/lifeJournal/evidence/vault/components/VaultOrkesterPanel.tsx', 'OrkesterAgentTrio', 'Registrerade dokument');
  mustInclude('src/modules/features/lifeJournal/evidence/vault/components/VaultLogList.tsx', 'SERVER-TIDSSTÄMPEL', 'scanTechniquesForLog');
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/components/VitHubPreview.tsx', 'VitCardFlowPanel');
  mustInclude('functions/src/callables/agents.ts', "mode === 'transformator'");
  mustInclude('functions/src/sharedRules.ts', 'KBT_TRANSFORMATOR_SYSTEM_PROMPT');
  mustInclude('.context/design-modules-mockup.md', 'D29', 'D3');
  mustInclude('src/modules/shell/livLauncherRoutes.ts', 'handling', '/planering?tab=handling');
  assert(
    !existsSync(resolve(root, 'src/modules/shell/VardagenShellPage.tsx')),
    'src/modules/shell/VardagenShellPage.tsx',
    'embed-shell ska vara raderad (LivLauncherPage)',
  );
  const appRoutes = read('src/modules/core/routing/AppRoutes.tsx');
  assert(!appRoutes.includes('VardagenShellPage'), 'AppRoutes.tsx', 'får inte mounta VardagenShellPage');
  mustInclude('src/modules/shell/LivLauncherPage.tsx', 'LivLauncherPage', 'LIV_LAUNCHER_EXTERNAL', 'LivLauncherGrid');
  mustInclude('src/modules/shell/LivLauncherGrid.tsx', 'liv-launcher-card', 'LIV_LAUNCHER_CARDS');
  mustInclude('src/styles/obsidian-calm-2.css', '.liv-launcher-grid', '.liv-launcher-card');
  mustInclude('src/modules/shell/LivBackLink.tsx', 'Liv och göra', 'NAV_PATHS.VARDAGEN');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'path="/planering"', 'PlaneringPage');
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'path="/planering/kalender"', 'PlaneringKalenderPage');
  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringSuperModule.tsx',
    'PlaneringSuperModule',
    "'inkorg'",
    "'capture'",
    "variant=\"planering\"",
  );
  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringPage.tsx',
    'PlaneringSuperModule',
    'variant="inkorg"',
  );
  mustInclude(
    'src/modules/features/admin/planning/components/PlaneringInkorgPanel.tsx',
    'PlaneringSuperModule',
    'variant="capture"',
    'ReviewQueuePipelinePanel',
  );
  assert(
    !read('src/modules/features/admin/planning/components/PlaneringPage.tsx').includes('PlaneringInkorgPanel'),
    'PlaneringPage.tsx',
    'delegerar inkorg till PlaneringSuperModule — inte direkt PlaneringInkorgPanel-import',
  );
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'path="/projekt/ny"', 'path="/projekt/regler"');
  mustInclude('src/modules/features/admin/planning/components/PlaneringHub.tsx', 'ProjektPickerSheet');
  mustInclude('src/modules/core/firebase/storage.ts', 'uploadProjectImage');
  mustInclude('src/modules/features/admin/planning/components/PlaneringPage.tsx', 'PlanningKanbanBoard', 'PLANERING_TAGLINE');
  mustInclude('firestore.rules', 'planning_tasks');
  mustInclude('firestore.rules', 'match /project_rules/{docId}');
  mustInclude('firestore.rules', 'match /routine_templates/{docId}');
  mustInclude('firestore.rules', 'match /material_pack_overrides/{docId}');
  mustInclude('src/modules/core/lifeOs/materialPackFirestoreApi.ts', 'listenMaterialPackOverrides');
  mustInclude('src/modules/core/lifeOs/useMaterialPackSync.ts', 'pushUnsyncedMaterialPackOverrides');
  mustInclude('src/modules/core/lifeOs/routineTemplatesApi.ts', 'listenRoutineTemplates');
  mustInclude('src/modules/core/ui/ClusterGrid.tsx', 'navFlags');
  mustInclude('docs/design/CHROME-EMBER-KANON.md', 'LÅST', 'data-panel-style');
  mustInclude('src/modules/core/layout/headerPanelStyle.ts', "return 'ember'");
  mustInclude('src/modules/core/layout/FloatingDock.tsx', 'data-panel-style={panelStyle}');
  mustInclude(
    'src/index.css',
    ".dock-hub-band[data-panel-style='ember'] .dock-hub-band__rail",
    ".glass-header-bar--kanon[data-panel-style='ember']",
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/components/CompassModuleStrip.tsx',
    'CompassQuickWidgetRail',
    'compass-module-block',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/compasses/config/compassWidgetCatalog.ts',
    'COMPASS_WIDGET_CATALOG',
    'morning',
    'evening',
  );
  mustInclude('src/modules/core/home/DagensRiktningCard.tsx', 'CompassQuickWidgetRail');
  mustInclude('src/modules/shell/LivLauncherPage.tsx', 'CompassQuickWidgetRail', 'getDefaultCompassByTime');
  mustInclude('src/modules/features/family/safeHarbor/components/HamnModuleStack.tsx', 'CompassQuickWidgetRail');
  mustInclude('src/modules/core/navigation/navTruth.ts', 'drawerHint');
  mustInclude('src/modules/core/navigation/drawerNav.ts', 'createDrawerL2Icon');
  mustInclude('docs/gemini-handoff/README.md', 'gemini-handoff');

  mustInclude(
    'src/modules/capture/CaptureSuperModule.tsx',
    'ReviewQueuePipelinePanel',
    "variant === 'hem-capture'",
    "variant === 'kompass'",
    'refreshToken={queueRefresh}',
  );
  mustInclude(
    'src/modules/capture/reviewQueuePipeline.ts',
    'inboxQueueStatusLabel',
    'sortInboxForValvSamla',
  );

  console.log('[smoke:design-modules] Modulväljare rollout...');
  mustInclude('src/modules/shared/ui/ExamplePreviewCard.tsx', 'ExamplePreviewCard');
  mustInclude('src/modules/shell/LivLauncherGrid.tsx', 'LIV_LAUNCHER_PREVIEWS');
  mustInclude('src/modules/capture/CaptureSuperModule.tsx', 'HemCaptureModulValjare');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx',
    'EconomyLogPanel',
    'EconomyImpulsePanel',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx',
    'EconomyTidPanel',
  );
  mustInclude('src/modules/features/dailyLife/wellbeing/mabra/components/MabraModulValjare.tsx', 'MabraModulValjare');
  mustInclude('src/modules/features/lifeJournal/evidence/vault/components/ValvZoneModulValjare.tsx', 'ValvZoneModulValjare');
  mustInclude('src/modules/features/admin/projects/components/ProjektTomStatePanel.tsx', 'ProjektTomStatePanel');

  assert(
    !read('src/modules/core/pages/HomePage.tsx').includes('ReviewQueuePanel'),
    'HomePage.tsx',
    'review-kö via CaptureSuperModule — inte separat ReviewQueuePanel',
  );
  assert(
    !read('src/modules/features/admin/planning/components/PlaneringInkorgPanel.tsx').includes(
      "from '@/modules/inkast/components/InboxReviewQueue'",
    ),
    'PlaneringInkorgPanel.tsx',
    'får inte importera InboxReviewQueue — använd InboxReviewQueueLink',
  );

  console.log('[smoke:design-modules] Adaptiv Hemkompass...');
  mustInclude('src/modules/core/home/homeCompassPhase.ts', 'getDefaultCompassByTime', 'getHomeCompassPhase');
  mustInclude('src/modules/core/home/homeQuickNav.ts', 'getHomeQuickNavForPreset', 'rehab_lag');
  mustInclude(
    'src/modules/core/home/homeSuperhubRoutes.ts',
    'HOME_SUPERHUB_ROUTES',
    '/hjartat/input',
    '/planering/input',
    'getHomeSuperhubShortcutsForPreset',
  );
  mustInclude(
    'src/modules/core/home/HomeAdaptiveCompass.tsx',
    'materialEnabled',
    'getHomeQuickNavForPreset',
    'HomeSuperhubShortcuts',
    'getHomeCompassPhase',
    'ParalysPanel',
    'KasamEvening',
    'KompassradPanel',
    'home_snabbval',
    'home-adaptive-compass',
    'home-adaptive-compass__tab--active',
  );
  mustInclude('src/modules/core/home/panels/HomeDagbokPanel.tsx', 'HOME_SUPERHUB_ROUTES', 'hjartatQuickMirror');
  mustInclude('src/modules/core/home/panels/HomeTaskPanel.tsx', 'HOME_SUPERHUB_ROUTES', 'planeringTask');
  mustInclude('src/modules/core/home/HomeHeroKanon.tsx', 'useLifeHubPreset', 'home-greeting-module');
  mustInclude('src/modules/features/dailyLife/wellbeing/compasses/components/DashboardPage.tsx', 'home-adaptive-compass--hub', 'home-adaptive-compass__hub-head');
  mustInclude('src/modules/features/admin/projects/components/ProjektMaterialPackPage.tsx', 'MaterialPackShortcuts', 'duplicateTargetKeys');
  mustInclude('src/modules/core/lifeOs/materialPackBankRefs.ts', 'MATERIAL_PACK_BANK_REFS', 'isValidMaterialPackBankRef');
  mustInclude('src/modules/core/lifeOs/materialPackRoutineBridge.ts', 'routineNavigateShortcuts', 'shortcutsIncludeTarget');
  mustInclude('src/modules/features/admin/projects/components/ProjektMaterialPackPage.tsx', 'MATERIAL_PACK_BANK_REFS', 'routineNavigateShortcuts');
  mustInclude('src/modules/capture/ReviewQueuePipelinePanel.tsx', 'inkastDestinationLink');
  mustInclude('src/modules/inkast/api/inkastService.ts', "case 'journal'");
  mustInclude('src/modules/capture/captureDomainCopy.ts', 'inkastSourceModuleHint', 'valv_samla');
  mustInclude('src/modules/capture/components/HemCaptureModulValjare.tsx', 'HemCaptureModulValjare');
  mustInclude('functions/src/lib/inboxClassifier.ts', 'buildInboxClassifyBlob', 'valv_samla');
  mustInclude('src/modules/features/family/safeHarbor/components/BiffPublicPanel.tsx', 'BiffTriagePanel', 'gransAnalysis');
  mustInclude('src/modules/features/family/safeHarbor/components/TryggHamnHub.tsx', 'HamnModuleStack', 'HAMN_GREY_ROCK_LEAD');
  mustInclude('src/modules/core/security/vaultSessionLifecycle.ts', 'endVaultSession', 'ensureVaultSessionReady');
  mustInclude('src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx', 'ensureVaultSessionReady', 'endVaultSession');
  mustInclude(
    'src/modules/core/home/AdaptiveMemoryCards.tsx',
    'Visa mer',
  );
  mustInclude(
    'src/modules/core/home/HemV3DevelopmentRail.tsx',
    'HemV3DevelopmentRail',
    'HEM_V3_DEVELOPMENT_CARDS',
    'filterDevelopmentCardsForPreset',
    'isLowHomeCapacity',
  );
  mustInclude(
    'src/modules/core/pages/HomePage.tsx',
    'HemV3DevelopmentRail',
    'home_development_rail',
  );
  mustInclude(
    'src/modules/core/home/hemV3DevelopmentCards.ts',
    'HEM_V3_DEVELOPMENT_CARDS',
    'HEM_V3_LOW_CAPACITY_CARD_IDS',
  );

  console.log('[smoke:design-modules] Shared module shell…');
  mustInclude(
    'src/modules/core/layout/ModuleShell.tsx',
    'ModuleShell',
    'HubPageShell',
    'lockViewport',
    'fitViewport',
    'depth',
  );
  mustInclude(
    'src/modules/core/ui/SupermoduleModeSelect.tsx',
    'SupermoduleModeSelect',
    'module-mode-select',
  );
  mustInclude(
    'src/modules/core/ui/ModuleSectionBanner.tsx',
    'ModuleSectionBanner',
    'module-section-banner',
  );
  mustInclude(
    'src/modules/core/pages/DagbokPage.tsx',
    'ModuleShell',
    'lockViewport',
  );
  mustInclude(
    'src/styles/obsidian-depth-mockup.css',
    'module-shell--depth',
    'module-mode-select',
    'od-form-field',
  );
  mustInclude(
    'src/styles/obsidian-calm-2.css',
    'hub-view-lock--fit',
  );
  mustInclude(
    'src/modules/shared/ui/BentoCard.tsx',
    'module-bento-card--depth',
    'depth',
  );

  console.log('[smoke:design-modules] Fas 19.3 zone hub tokens…');
  mustNotInclude('src/modules/features/admin/planning/components/planering.css', '#050b14');
  mustNotInclude('src/modules/features/family/children/components/familjen/familjen.css', '#050b14');
  mustNotInclude('src/modules/features/lifeJournal/evidence/vault/components/valv.css', '#050b14');
  mustNotInclude('src/modules/features/lifeJournal/diary/components/hjartat.css', '#050b14');
  mustInclude('src/index.css', '--zone-gradient-planering', '--color-accent-gold-30', '--color-obsidian-surface');
  mustInclude('src/modules/features/admin/planning/components/planering.css', 'var(--color-obsidian-surface)', 'var(--zone-gradient-planering)');
  mustNotInclude('src/modules/features/dailyLife/wellbeing/mabra/components/mabra.css', '#050b14');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/mabra.css',
    'var(--color-obsidian-surface)',
    'var(--zone-gradient-mabra)',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/components/MabraLayout.tsx',
    'MabraBentoShell',
  );
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/supermodule/MabraInputSuperModule.tsx',
    'supermodule-hub-chrome',
  );
  mustNotInclude(
    'src/modules/features/lifeJournal/evidence/kompis/components/KunskapsvalvFileIngest.tsx',
    'bg-[#',
  );

  console.log('[smoke:design-modules] Fas 22 hex→tokens P0…');
  mustNotInclude('src/modules/features/dailyLife/wellbeing/mabra/components/MabraHistoryView.tsx', '#fbbf24', '#64748b', '#09111e');
  mustNotInclude('src/modules/features/archive/components/ArchiveHub.tsx', '#020617', '#050b14');
  mustNotInclude('src/modules/morning/components/DailyTasksList.tsx', '#d4af37', '#12151f');
  mustNotInclude('src/modules/features/diary/components/supermodule/components/VaultView.tsx', '#111b2d', 'rgba(99,102,241,0.22)');
  mustNotInclude('src/modules/features/diary/components/supermodule/components/InsightsView.tsx', '#111b2d', '#09111e');
  mustNotInclude('src/modules/features/diary/components/supermodule/components/JournalTimeline.tsx', '#111b2d', 'rgba(99,102,241,0.22)');
  mustNotInclude('src/modules/shared/ui/ImmersiveExperienceShell.tsx', '#020617', '#0f172a');
  mustNotInclude('src/modules/features/dashboard/components/VisualCompassWidget.tsx', '#d4af37');

  console.log('[smoke:design-modules] Fas 24 hex→tokens P2…');
  mustNotInclude(
    'src/modules/features/onboarding/barnporten/components/BarnportenPage.tsx',
    '#1a1410',
    '#0a1614',
    'from-[#',
  );
  mustNotInclude(
    'src/modules/features/onboarding/barnporten/components/BarnportenQrPanel.tsx',
    '#fde68a',
    '#1a1410',
    'bg-[#',
  );
  mustInclude(
    'src/modules/features/onboarding/barnporten/components/barnporten.css',
    '--barnporten-bg-top',
    '--barnporten-bg-bottom',
    '--barnporten-qr-dark',
    'barnporten-qr-panel',
  );
  mustInclude(
    'src/modules/features/onboarding/barnporten/components/BarnportenQrPanel.tsx',
    'barnporten-zone',
    'barnporten-qr-panel',
    '--barnporten-qr-dark',
  );
  mustInclude('src/modules/shared/utils/secureExport.ts', 'DOSSIER_PRINT_STYLES');
  mustNotInclude(
    'src/modules/features/lifeJournal/evidence/vault/dossier/components/DossierPage.tsx',
    'border-bottom: 1px solid #cbd5e1',
    'background: #f8fafc; border-left: 4px solid #6366f1',
  );
  mustInclude(
    'src/modules/features/lifeJournal/evidence/vault/dossier/utils/exportDossierPrint.ts',
    'DOSSIER_PRINT_STYLES',
    'printDossierFallback',
  );

  console.log('smoke:design-modules PASS');
}

main();
