/**
 * Smoke: Kunskapsvalvet — ingestKampsparEntry + knowledgeVaultQuery (prod callables).
 * Usage: node scripts/smoke_kunskap.mjs
 * Requires: .env with VITE_FIREBASE_* and Anonymous Auth enabled in Console.
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
  if (!existsSync(envPath)) {
    throw new Error('Saknar .env i projektroten — kopiera från .env.example');
  }
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
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  assert(apiKey && projectId, 'VITE_FIREBASE_API_KEY och VITE_FIREBASE_PROJECT_ID krävs i .env');

  const app = initializeApp({
    apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  const auth = getAuth(app);
  const functions = getFunctions(app, 'europe-west1');

  console.log('[smoke] Anonymous sign-in…');
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;
  console.log('[smoke] uid:', uid);

  const ingest = httpsCallable(functions, 'ingestKampsparEntry');
  const query = httpsCallable(functions, 'knowledgeVaultQuery');

  const stamp = new Date().toISOString().slice(0, 19);
  const title = `Smoke-test ${stamp}`;
  const content =
    'Morgonrutin: lämning 07:45, andning 4-7-8 innan skolgården. Trigger: sms från skola.';

  console.log('[smoke] ingestKampsparEntry…');
  const ingestResult = await ingest({
    title,
    content,
    category: 'smoke',
    eventDate: new Date().toISOString().slice(0, 10),
    source: 'smoke_test',
  });
  const ingestData = ingestResult.data;
  assert(ingestData?.docId, 'ingest saknar docId');
  console.log('[smoke] ingest OK — docId:', ingestData.docId, 'embeddingDim:', ingestData.embeddingDim);

  console.log('[smoke] knowledgeVaultQuery…');
  const queryResult = await query({
    prompt: 'Vad var min morgonrutin för skol lämning enligt smoke-testet?',
  });
  const rag = queryResult.data;
  assert(typeof rag?.answer === 'string' && rag.answer.length > 0, 'saknar answer');
  assert(Array.isArray(rag?.citations), 'saknar citations array');

  const hit = rag.citations.some((c) => c.docId === ingestData.docId);
  console.log('[smoke] query OK — answer length:', rag.answer.length, 'citations:', rag.citations.length);
  console.log('[smoke] citation match smoke doc:', hit ? 'YES' : 'NO (token-match kan missa — kontrollera manuellt)');

  if (rag.citations.length > 0) {
    console.log('[smoke] first citation:', JSON.stringify(rag.citations[0], null, 2));
  }
  console.log('[smoke] answer excerpt:', rag.answer.slice(0, 200));

  console.log('\n[smoke] PASS — Kunskap callables svarar.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
