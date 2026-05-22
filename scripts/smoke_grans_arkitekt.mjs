/**
 * Smoke: G14 — Gräns-Arkitekten via analyzeMessage (module=safe_harbor).
 * Usage: node scripts/smoke_grans_arkitekt.mjs
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
    throw new Error('Saknar .env i projektroten');
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

const TEST_MESSAGE =
  'Du är alltid så känslig. Du hittar på allting. Du måste förklara varför du aldrig svarar på sms.';

async function main() {
  const env = loadEnv();
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  assert(apiKey && projectId, 'VITE_FIREBASE_* krävs i .env');

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
  await signInAnonymously(auth);

  const analyze = httpsCallable(functions, 'analyzeMessage');
  console.log('[smoke] analyzeMessage (safe_harbor)…');
  const result = await analyze({
    message: TEST_MESSAGE,
    module: 'safe_harbor',
  });
  const data = result.data;

  assert(data?.agentId === 'agent_grans_arkitekten', `förväntar agent_grans_arkitekten, fick ${data?.agentId}`);
  assert(data?.status === 'SUCCESS', `status ska vara SUCCESS, fick ${data?.status}`);
  assert(data?.data?.gransAnalysis, 'saknar data.gransAnalysis');
  assert(
    typeof data.data.gransAnalysis.greyRockReply === 'string' &&
      data.data.gransAnalysis.greyRockReply.length > 5,
    'saknar greyRockReply'
  );
  assert(
    data.data.response || data.data.greyRockResponse,
    'saknar response/greyRockResponse i data'
  );
  assert(typeof data.dcap?.riskScore === 'number', 'saknar dcap.riskScore');

  console.log('[smoke] agent:', data.agentId, 'risk:', data.dcap.riskScore);
  console.log('[smoke] greyRock:', data.data.gransAnalysis.greyRockReply.slice(0, 80), '…');
  console.log('\n[smoke] PASS — G14 Gräns-Arkitekten.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
