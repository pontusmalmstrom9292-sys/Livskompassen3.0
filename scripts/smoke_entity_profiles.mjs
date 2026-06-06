/**
 * Smoke: G9 — getEntityProfileRegistry (KEY_ENTITIES seed + SystemSynapses).
 * Usage: node scripts/smoke_entity_profiles.mjs
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
  const cred = await signInAnonymously(auth);
  console.log('[smoke] uid:', cred.user.uid);

  const issueVault = httpsCallable(functions, 'issueVaultSession');
  console.log('[smoke] issueVaultSession…');
  const session = await issueVault({});
  const vaultSessionToken = session.data?.vaultSessionToken;
  assert(typeof vaultSessionToken === 'string' && vaultSessionToken.length >= 32, 'saknar vaultSessionToken');

  const registry = httpsCallable(functions, 'getEntityProfileRegistry');
  console.log('[smoke] getEntityProfileRegistry…');
  const result = await registry({ vaultSessionToken });
  const data = result.data;

  assert(Array.isArray(data?.profiles), 'saknar profiles');
  assert(data.profiles.length >= 7, `förväntar ≥7 profiler, fick ${data.profiles.length}`);
  assert(Array.isArray(data?.synapses), 'saknar synapses');
  assert(data.synapses.length >= 3, `förväntar ≥3 synapses, fick ${data.synapses.length}`);

  const isabelle = data.profiles.find((p) => p.displayName === 'Isabelle');
  assert(isabelle?.role === 'MOTPART', 'saknar MOTPART Isabelle');
  assert(
    data.profiles.some((p) => p.displayName === 'Kasper' && p.role === 'BARN'),
    'saknar barn Kasper'
  );

  const siloSynapse = data.synapses.find((s) => s.title?.includes('Tre silos'));
  assert(siloSynapse, 'saknar SystemSynapse tre silos');

  console.log('[smoke] profiles:', data.profiles.length, 'synapses:', data.synapses.length);
  console.log('\n[smoke] PASS — EntityProfile registry.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
