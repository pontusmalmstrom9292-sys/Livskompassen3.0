/**
 * Smoke: G10 — previewInboxClassification + getInboxQueue.
 * Usage: node scripts/smoke_inbox_sort.mjs
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

async function main() {
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

  console.log('[smoke] Anonymous sign-in…');
  await signInAnonymously(auth);

  const preview = httpsCallable(functions, 'previewInboxClassification');
  console.log('[smoke] previewInboxClassification (bevis)…');
  const bevis = await preview({
    fileName: 'sms_motpart_2026.txt',
    text:
      'SMS från Isabelle 2026-03-12: Du svarar aldrig. Barnen mår dåligt pga dig. Jag kräver svar innan fredag.',
  });
  const bevisData = bevis.data?.classification;
  assert(bevisData?.routing === 'bevis', `bevis förväntat, fick ${bevisData?.routing}`);
  console.log('[smoke] bevis routing OK, tags:', bevisData.tags?.join(', '));

  console.log('[smoke] previewInboxClassification (kunskap)…');
  const kunskap = await preview({
    fileName: 'bbic_tips_gaslighting.pdf',
    text:
      'Artikel: Så känner du igen gaslighting. Metod: dokumentera datum och korta fakta. Ingen akut konflikt i texten.',
  });
  const kunskapData = kunskap.data?.classification;
  assert(
    kunskapData?.routing === 'kunskap' || kunskapData?.routing === 'review',
    `kunskap/review förväntat, fick ${kunskapData?.routing}`
  );
  console.log('[smoke] kunskap routing:', kunskapData.routing);

  console.log('[smoke] previewInboxClassification (barnen via familjen)…');
  const barnen = await preview({
    fileName: 'kasper_skola_smoke.txt',
    text: 'Kasper verkade orolig inför läxor idag. Neutral observation från hämtning.',
    sourceModule: 'familjen',
  });
  const barnenData = barnen.data?.classification;
  assert(barnenData?.routing === 'barnen', `barnen förväntat, fick ${barnenData?.routing}`);
  assert(
    barnenData?.childAlias === 'Kasper',
    `barnen childAlias förväntat Kasper, fick ${barnenData?.childAlias}`,
  );
  console.log('[smoke] barnen routing OK, childAlias:', barnenData.childAlias);

  console.log('[smoke] previewInboxClassification (mabra_inkast → dagbok)…');
  const mabra = await preview({
    fileName: 'mabra_reflektion_smoke.txt',
    text: 'Jag behöver vila och återhämtning efter en tung vecka. Ingen konflikt.',
    sourceModule: 'mabra_inkast',
  });
  const mabraData = mabra.data?.classification;
  assert(mabraData?.routing === 'dagbok', `mabra_inkast förväntat dagbok, fick ${mabraData?.routing}`);
  console.log('[smoke] mabra_inkast routing:', mabraData.routing);

  console.log('[smoke] previewInboxClassification (trauma → review)…');
  const trauma = await preview({
    fileName: 'lvu_akut.docx',
    text: 'LVU-utredning akut. Vårdnadstvist. Barnens skydd. Socialtjänsten kallar till möte imorgon.',
  });
  const traumaData = trauma.data?.classification;
  assert(
    traumaData?.routing === 'review' || traumaData?.traumaSensitive === true,
    'trauma ska ge review eller traumaSensitive'
  );
  console.log('[smoke] trauma:', traumaData.routing, 'sensitive:', traumaData.traumaSensitive);

  const queue = httpsCallable(functions, 'getInboxQueue');
  const queueResult = await queue({});
  assert(Array.isArray(queueResult.data?.items), 'getInboxQueue saknar items');
  console.log('[smoke] inbox queue pending:', queueResult.data.items.length);

  console.log('\n[smoke] PASS — G10 inbox classification.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
