/**
 * Smoke: Adaptation Core Lager 1–2 wiring.
 * Usage: npm run smoke:adaptation
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

function main() {
  mustInclude(
    'shared/adaptation/adaptationTypes.ts',
    'ADAPTATION_LAYER_FLAG',
    'adaptation_layer_v1',
    'AdaptationPrefsDoc',
  );
  mustInclude(
    'shared/adaptation/adaptationLedgerSync.ts',
    'prefsLedgerFingerprint',
    'collectLedgerEntriesFromPrefsDiff',
    'adaptationLedgerDedupKey',
  );
  mustInclude(
    'functions/src/callables/adaptation.ts',
    'getAdaptationProfile',
    'recordAdaptationSignal',
    'isAdaptationLayerEnabled',
  );
  mustInclude(
    'functions/src/triggers/onAdaptationPrefsWrite.ts',
    'onAdaptationPrefsWrite',
    'adaptation_prefs/{uid}',
    'rebuildAdaptationSemanticProfileForUser',
    'isAdaptationSemanticEnabled',
  );
  mustInclude(
    'functions/src/lib/adaptationSemanticContext.ts',
    'loadAdaptationSemanticContext',
    'appendAdaptationSemanticContext',
  );
  mustInclude(
    'functions/src/callables/generateKompassrad.ts',
    'loadAdaptationSemanticContext',
    'appendAdaptationSemanticContext',
  );
  mustInclude(
    'functions/src/agents/vertexAgent.ts',
    'appendAdaptationSemanticContext',
  );
  mustInclude(
    'src/modules/core/hooks/useAdaptationSync.ts',
    'adaptation_semantic_profile',
    'ADAPTATION_SEMANTIC_FLAG',
  );
  mustInclude(
    'src/modules/core/adaptation/AdaptationPrefsPanel.tsx',
    'semanticSummary',
  );
  mustInclude(
    'functions/src/index.ts',
    'getAdaptationProfile',
    'recordAdaptationSignal',
    'onAdaptationPrefsWrite',
  );
  mustInclude(
    'src/modules/core/firebase/adaptationLedgerFirestore.ts',
    'syncAdaptationPrefsToLedger',
    'mergeAdaptationPrefs',
  );
  mustInclude(
    'src/modules/core/store/useAdaptationStore.ts',
    'isParalysMode',
    'recordSignal',
    'ADAPTATION_LAYER_FLAG',
  );
  mustInclude(
    'src/modules/core/hooks/useAdaptationSync.ts',
    'useAdaptationSync',
    'adaptation_prefs',
    'ADAPTATION_LAYER_FLAG',
  );
  mustInclude(
    'src/modules/core/adaptation/adaptationService.ts',
    'fetchAdaptationProfile',
    'recordAdaptationSignal',
  );
  mustInclude(
    'src/App.tsx',
    'useAdaptationSync',
    'useAdaptationSignalRouter',
  );
  mustInclude(
    'src/modules/core/adaptation/AdaptationPrefsPanel.tsx',
    'mergeAdaptationPrefs',
    'uiDensity',
    'coachTone',
  );
  mustInclude(
    'src/modules/core/hooks/useAdaptationSignalRouter.ts',
    'resolveRouteAdaptationSignal',
    'recordSignal',
  );
  mustInclude(
    'src/modules/core/adaptation/adaptationRouteSignals.ts',
    'route_valv',
    'route_familjen',
  );
  mustInclude(
    'src/modules/core/pages/InstallningarPage.tsx',
    'AdaptationPrefsPanel',
  );
  mustInclude(
    'src/modules/core/home/HomeAdaptiveCompass.tsx',
    'inkast_open_home',
  );
  mustInclude(
    'src/modules/core/home/homeCapacityGate.ts',
    'isAdaptationParalysMode',
  );
  mustInclude(
    'firestore.rules',
    'match /adaptation_prefs/{uid}',
    'match /adaptation_ledger/{docId}',
    'match /adaptation_semantic_profile/{uid}',
    'allow update, delete: if false',
  );
  mustInclude(
    'shared/adaptation/adaptationSemanticTypes.ts',
    'ADAPTATION_SEMANTIC_FLAG',
    'adaptation_semantic_v1',
    'buildSemanticProfileFromPrefs',
  );
  mustInclude(
    'functions/src/callables/adaptationSemantic.ts',
    'getAdaptationSemanticProfile',
    'rebuildAdaptationSemanticProfile',
    'isAdaptationSemanticEnabled',
  );
  mustInclude(
    'functions/src/lib/adaptationSemanticRebuild.ts',
    'rebuildAdaptationSemanticProfileForUser',
    'semantic_indexed',
  );
  mustInclude(
    'functions/src/index.ts',
    'getAdaptationSemanticProfile',
    'rebuildAdaptationSemanticProfile',
  );
  mustInclude(
    'src/modules/core/manifest/masterManifest.ts',
    'adaptation_ledger',
    'adaptation_prefs',
    'adaptation_semantic_profile',
    'rebuildAdaptationSemanticProfile',
  );

  mustInclude(
    'src/modules/core/firebase/offlineWritePolicy.ts',
    'adaptation_ledger',
  );

  console.log('[smoke:adaptation] PASS — Adaptation Core wiring (L1 + L2a–c).');
}

main();
