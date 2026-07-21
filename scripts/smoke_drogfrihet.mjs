/**
 * Static smoke: Drogfrihet sacred invariants (MOD-FAM-DROG).
 * Usage: npm run smoke:drogfrihet
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
  // Placement — Familjen, not Vardagen
  mustInclude(
    'src/modules/core/pages/FamiljenPage.tsx',
    "id: 'drogfrihet'",
    'DrogfrihetHubPage embedded',
  );
  mustInclude('src/modules/core/navigation/navTruth.ts', 'familjen_drogfrihet', '/familjen?tab=drogfrihet');
  assert(
    !read('src/modules/core/navigation/navTruth.ts').includes('vardagen_drogfrihet'),
    'navTruth.ts',
    'drogfrihet ska inte ligga under vardagen',
  );
  mustInclude('src/modules/core/routing/AppRoutes.tsx', 'RedirectDrogfrihetToFamiljen', "path=\"/drogfrihet\"");
  assert(
    !read('src/modules/core/routing/AppRoutes.tsx').includes('DrogfrihetHubPage'),
    'AppRoutes.tsx',
    'mountar inte DrogfrihetHubPage direkt',
  );

  // Hub + SOS
  const hub = 'src/modules/features/dailyLife/drogfrihet/components/DrogfrihetHubPage.tsx';
  mustInclude(hub, 'DROGFRIHET_SUBTABS', 'RecoveryUrgeSosModule', 'SOS — sug nu', 'Akut: 112');
  mustInclude(hub, "get('akut')", 'setSosOpen(true)');
  mustInclude(
    'src/modules/features/mabra/components/RecoveryUrgeSosModule.tsx',
    'RECOVERY_SOS_ANCHOR_COPY',
    'ingen logg',
    'HALT_ITEMS',
    'URGE_SURF_COPY',
    'AFTER_COPY',
    'tel:112',
    'tel:90101',
    'useDsReducedMotion',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/content/akutProtocolContent.ts',
    'HALT_ITEMS',
    'PROTOCOL_META',
    'DISTRACT_PROMPTS_1MIN',
  );

  // Deep link redirect
  mustInclude(
    'src/modules/core/routing/AppRoutes.tsx',
    'RedirectDrogfrihetToFamiljen',
    "/akut",
    "akut",
  );

  // Subtabs
  mustInclude(hub, "id: 'idag'", "id: 'steg'", "id: 'resurser'", "id: 'reflektion'", "id: 'kunskap'");

  // Counter + no gamification
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/lib/drogfrihetCounter.ts',
    'DrogfrihetCounterState',
  );
  mustNotInclude(hub, 'leaderboard', 'level up', 'community feed');
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/content/drogfrihetCatalog.ts',
    'inga streaks',
  );
  mustNotInclude(
    'src/modules/features/dailyLife/drogfrihet/content/drogfrihetCatalog.ts',
    'leaderboard',
    'XP',
  );

  // Swedish emergency chain
  const resources = 'src/modules/features/dailyLife/drogfrihet/constants/resources.ts';
  mustInclude(resources, "id: 'res-112'", 'tel:112', "id: 'res-90101'", 'tel:90101', 'Droghjälpen', 'Alkoholhjälpen');
  mustNotInclude(resources, 'tel:113', 'Ring 113', 'res-113');
  mustInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/constants.ts',
    "emergencyNumber: '112'",
  );
  mustNotInclude(
    'src/modules/features/dailyLife/wellbeing/mabra/constants.ts',
    "emergencyNumber: '113'",
  );

  // Disclaimer
  mustInclude(resources, 'ersätter inte medicinsk', '112');

  // 12-step wired
  mustInclude(hub, 'RecoveryTwelveStepJournal');

  // Dual-lock entry presence
  mustInclude(
    'src/modules/features/mabra/components/RecoveryTwelveStepJournal.tsx',
    '@locked MOD-FAM-DROG',
  );
  mustInclude(
    'src/modules/features/mabra/components/RecoveryUrgeSosModule.tsx',
    '@locked MOD-FAM-DROG',
  );
  mustInclude(
    'src/modules/features/mabra/components/RecoveryRealityCheckForm.tsx',
    '@locked MOD-FAM-DROG',
  );
  mustInclude(resources, '@locked MOD-FAM-DROG');
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/lib/drogfrihetCounter.ts',
    '@locked MOD-FAM-DROG',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/components/RecoveryPlanPanel.tsx',
    'If–Then',
    'coreWhy',
    '@locked MOD-FAM-DROG',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/components/ComebackBanner.tsx',
    'COMEBACK_COPY',
    'LAPSE_VS_RELAPSE',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/components/EscalationBanner.tsx',
    'ESCALATION_COPY',
    '1177',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/constants/kunskapFacts.ts',
    'kunskap-fact-df-007',
    'kunskap-fact-df-008',
  );
  mustInclude(
    'src/modules/features/mabra/components/RecoveryUrgeSosModule.tsx',
    'touchLastSosAt',
    'recordSosOpenLocal',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/components/DrogfrihetCounterSettings.tsx',
    'setComebackPending',
  );
  mustInclude(
    'src/modules/features/mabra/components/RecoveryUrgeSosModule.tsx',
    '@locked MOD-FAM-DROG',
  );
  mustInclude(
    'src/modules/features/mabra/components/RecoveryRealityCheckForm.tsx',
    '@locked MOD-FAM-DROG',
  );
  mustInclude(resources, '@locked MOD-FAM-DROG');
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/lib/drogfrihetCounter.ts',
    '@locked MOD-FAM-DROG',
  );

  mustInclude(hub, 'MotivationContentDeck', 'ProgressionPanel', 'NotifPrefsPanel');
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/content/dfQuoteBank.ts',
    'DF_QUOTE_COUNT',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/content/dfQuestionBank.ts',
    'DF_QUESTION_COUNT',
  );
  mustInclude(
    'src/modules/features/widgets/routing/WidgetRoutes.tsx',
    'drogfrihet-akut',
  );
  mustInclude(
    'src/modules/core/constants/fyrenHomeQuickActions.ts',
    'drogfrihet-akut',
    'akut=1',
  );
  mustInclude(
    'src/modules/features/mabra/components/RecoveryUrgeSosModule.tsx',
    'pushKpiEvent',
  );

  mustInclude(hub, 'BuddyContactPanel', 'NotifPrefsPanel');
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/api/drogfrihetPushApi.ts',
    'syncDrogfrihetPushPrefs',
    'pingDrogfrihetBuddy',
  );
  mustInclude(
    'src/modules/features/dailyLife/drogfrihet/components/BuddyContactPanel.tsx',
    'Trygg person',
    'pingDrogfrihetBuddy',
  );
  mustInclude(
    'android/app/src/main/java/com/livskompassen/app/widgets/DrogfrihetAkutWidgetProvider.java',
    '/widget/drogfrihet-akut',
  );
  mustInclude(
    'android/app/src/main/AndroidManifest.xml',
    'DrogfrihetAkutWidgetProvider',
    'DrogfrihetFirebaseMessagingService',
  );
  mustInclude(
    'functions/src/callables/drogfrihetPush.ts',
    'syncDrogfrihetPushPrefs',
    'sendDrogfrihetNudge',
    'linkDrogfrihetBuddy',
    'pingDrogfrihetBuddy',
  );
  mustInclude(
    'android/app/src/main/java/com/livskompassen/app/core/NativeInterface.java',
    'getDrogfrihetFcmToken',
    'scheduleDrogfrihetNudges',
  );

  console.log('[smoke:drogfrihet] PASS');
}

main();
