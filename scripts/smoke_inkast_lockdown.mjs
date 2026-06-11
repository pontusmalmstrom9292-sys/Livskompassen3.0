/**
 * Smoke: Smart Inkast lockdown — UI-kanon, TAG_GROUPS, submitInkastLite → inboxPersist.
 * Usage: node scripts/smoke_inkast_lockdown.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

const CANONICAL = {
  inkastManualEditForm: 'src/modules/inkast/components/InkastManualEditForm.tsx',
  taggSelector: 'src/modules/shared/components/TaggSelector.tsx',
  taggHelpPanel: 'src/modules/shared/components/TaggHelpPanel.tsx',
  inkastService: 'src/modules/inkast/api/inkastService.ts',
  inboxPersist: 'functions/src/lib/inboxPersist.ts',
  inboxClassifier: 'functions/src/lib/inboxClassifier.ts',
  submitInkastLite: 'functions/src/lib/submitInkastLite.ts',
  userTagsApi: 'src/modules/shared/tags/userTagsApi.ts',
};

const REQUIRED_TAGS = [
  { group: 'narcissism', id: 'gaslighting', label: '#gaslighting' },
  { group: 'barn', id: 'maende', label: '#mående' },
  { group: 'personligt', id: 'aterhamtning', label: '#återhämtning' },
];

const OBSIDIAN_MARKERS = ['chip--active', 'chip--idle', 'text-text-muted', 'text-text-dim', 'bg-surface'];

function loadEnv() {
  if (!existsSync(envPath)) throw new Error('Saknar .env i projektroten');
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readCanonical(relativePath) {
  const full = resolve(root, relativePath);
  assert(existsSync(full), `Saknar fil: ${relativePath}`);
  return readFileSync(full, 'utf8');
}

function smokeStaticStructure() {
  console.log('[smoke:inkast] Statisk struktur…');
  for (const [name, rel] of Object.entries(CANONICAL)) {
    assert(existsSync(resolve(root, rel)), `Saknar ${name}: ${rel}`);
  }

  const taggSelector = readCanonical(CANONICAL.taggSelector);
  const taggHelp = readCanonical(CANONICAL.taggHelpPanel);
  const manualForm = readCanonical(CANONICAL.inkastManualEditForm);
  const inkastService = readCanonical(CANONICAL.inkastService);
  const inboxPersist = readCanonical(CANONICAL.inboxPersist);

  assert(taggSelector.includes('value: string[]'), 'TaggSelector ska stödja flerval (string[])');
  assert(taggSelector.includes('toggleInkastTag'), 'TaggSelector ska använda toggleInkastTag');
  assert(manualForm.includes('TaggSelector'), 'InkastManualEditForm ska montera TaggSelector');
  assert(manualForm.includes('TaggHelpPanel'), 'InkastManualEditForm ska montera TaggHelpPanel');

  const confirmPanel = readCanonical('src/modules/inkast/components/InkastConfirmPanel.tsx');
  assert(confirmPanel.includes('onAbort'), 'InkastConfirmPanel ska exponera Avbryt uppladdning');

  for (const marker of OBSIDIAN_MARKERS) {
    assert(
      taggSelector.includes(marker) || taggHelp.includes(marker) || manualForm.includes(marker),
      `Obsidian Calm-markör saknas i UI: ${marker}`,
    );
  }

  for (const tag of REQUIRED_TAGS) {
    assert(inkastService.includes(`id: '${tag.id}'`), `TAG_GROUPS saknar ${tag.id}`);
    assert(inkastService.includes(tag.label), `TAG_GROUPS saknar label ${tag.label}`);
  }

  assert(inboxPersist.includes('inboxTags: input.classification.tags'), 'inboxPersist skriver inboxTags');
  assert(inboxPersist.includes('reality_vault'), 'inboxPersist → reality_vault');
  assert(inboxPersist.includes('children_logs'), 'inboxPersist → children_logs');

  const classifier = readCanonical(CANONICAL.inboxClassifier);
  assert(classifier.includes('buildInboxClassifyBlob'), 'inboxClassifier saknar buildInboxClassifyBlob');
  assert(classifier.includes('valv_samla'), 'inboxClassifier saknar valv_samla-heuristik');
  assert(inkastService.includes('sourceModule?: string'), 'inkastService preview saknar sourceModule');
  assert(
    readCanonical('src/modules/capture/CapturePanel.tsx').includes('sourceModule'),
    'CapturePanel ska skicka sourceModule till preview',
  );

  const barnenBridge = readCanonical('src/modules/inkast/components/InkastBarnenValvBridge.tsx');
  assert(barnenBridge.includes('SaveAsEvidencePrompt'), 'InkastBarnenValvBridge ska återanvända SaveAsEvidencePrompt');
  assert(barnenBridge.includes('inkastBarnenBridgeProps'), 'InkastBarnenValvBridge ska exponera inkastBarnenBridgeProps');
  assert(
    readCanonical('src/modules/capture/CapturePanel.tsx').includes('InkastBarnenValvBridge'),
    'CapturePanel ska montera Barnen→Valv-bro',
  );
  assert(
    readCanonical('src/modules/capture/InkastDirectPanel.tsx').includes('InkastBarnenValvBridge'),
    'InkastDirectPanel ska montera Barnen→Valv-bro',
  );
  assert(
    readCanonical('src/modules/inkast/components/InboxReviewQueue.tsx').includes('InkastBarnenValvBridge'),
    'InboxReviewQueue ska montera Barnen→Valv-bro efter HITL',
  );
  assert(
    readCanonical('src/modules/features/family/children/utils/childLogEvidence.ts').includes('sourceRef'),
    'childLogEvidence ska skriva sourceRef för Valv-bro',
  );

  const rules = readFileSync(resolve(root, 'firestore.rules'), 'utf8');
  assert(rules.includes('match /user_tags/{docId}'), 'firestore.rules saknar user_tags');

  console.log('[smoke:inkast] Statisk struktur OK');
}

async function smokeCallablePipeline() {
  const env = loadEnv();
  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  const auth = getAuth(app);
  const functions = getFunctions(app, 'europe-west1');

  console.log('[smoke:inkast] Anonymous sign-in…');
  await signInAnonymously(auth);

  const preview = httpsCallable(functions, 'previewInboxClassification');
  const previewResult = await preview({
    fileName: 'lockdown_smoke.txt',
    text: 'Reflektion idag: jag behöver vila och återhämtning efter en tung vecka. Ingen konflikt.',
  });
  const previewClass = previewResult.data?.classification;
  assert(previewClass?.routing, 'previewInboxClassification saknar routing');
  console.log('[smoke:inkast] preview routing:', previewClass.routing);

  const previewValv = await preview({
    fileName: 'valv_samla_smoke.txt',
    text: 'Neutral anteckning utan barn eller konflikt — bara test.',
    sourceModule: 'valv_samla',
  });
  const valvClass = previewValv.data?.classification;
  assert(valvClass?.routing === 'bevis', `valv_samla preview förväntat bevis, fick ${valvClass?.routing}`);
  console.log('[smoke:inkast] preview valv_samla routing:', valvClass.routing);

  const submit = httpsCallable(functions, 'submitInkastLite');
  const smokeText =
    'Smoke lockdown 2026-06-06: manuellt inkast med flera taggar. Endast test — neutral reflektion.';
  const submitResult = await submit({
    text: smokeText,
    fileName: 'inkast_lockdown_smoke.txt',
    sourceModule: 'smoke_inkast_lockdown',
    manualRouting: 'kunskap',
    manualTags: ['gaslighting', 'aterhamtning'],
    manualCategory: 'gaslighting',
    manualComment: 'Smoke lockdown — flerval taggar.',
    optInTrauma: true,
  });

  const data = submitResult.data;
  assert(Array.isArray(data?.items) && data.items.length >= 1, 'submitInkastLite saknar items');
  const item = data.items[0];
  const cls = item?.classification;
  assert(cls?.routing === 'kunskap', `manual kunskap förväntat, fick ${cls?.routing}`);
  assert(cls?.tags?.includes('manuell'), 'tags ska innehålla manuell');
  assert(
    cls?.tags?.includes('gaslighting') && cls?.tags?.includes('aterhamtning'),
    `tags saknar flerval: ${cls?.tags?.join(', ')}`,
  );
  assert(item?.action === 'persisted' || item?.action === 'queued', 'action saknas');
  console.log('[smoke:inkast] submit action:', item.action, 'collection:', item.collection);
  console.log('[smoke:inkast] classification.tags:', cls.tags.join(', '));
}

async function main() {
  smokeStaticStructure();
  await smokeCallablePipeline();
  console.log('\n[smoke:inkast] PASS — Smart Inkast lockdown.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke:inkast] FAIL —', err.message || err);
  process.exit(1);
});
