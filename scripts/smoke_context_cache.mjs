/**
 * Smoke: G12 — getContextCacheStatus + invalidateSession (Zero Footprint registry).
 * Usage: node scripts/smoke_context_cache.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initSmokeAppCheck } from './lib/smoke_app_check.mjs';

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

  initSmokeAppCheck(app, env);

  const auth = getAuth(app);
  const functions = getFunctions(app, 'europe-west1');

  console.log('[smoke] Anonymous sign-in…');
  const cred = await signInAnonymously(auth);
  console.log('[smoke] uid:', cred.user.uid);

  const status = httpsCallable(functions, 'getContextCacheStatus');
  console.log('[smoke] getContextCacheStatus…');
  const before = await status({});
  assert(before.data?.registry === 'firestore', 'saknar firestore registry');
  assert(before.data?.collection === 'context_cache_registry', 'saknar collection');
  assert(typeof before.data?.count === 'number', 'saknar count');
  console.log('[smoke] entries before:', before.data.count);

  const invalidate = httpsCallable(functions, 'invalidateSession');
  console.log('[smoke] invalidateSession (Kill Switch)…');
  const inv = await invalidate({});
  assert(inv.data?.success === true, 'invalidateSession failed');

  const after = await status({});
  assert(after.data?.count === 0, `förväntar 0 entries efter invalidate, fick ${after.data?.count}`);

  console.log('\n[smoke] PASS — G12 context cache registry.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
