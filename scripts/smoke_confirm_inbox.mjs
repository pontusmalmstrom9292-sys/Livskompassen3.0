/**
 * Smoke: Inbox confirm/dismiss lifecycle wiring (static + optional prod).
 * Usage: npm run smoke:confirm-inbox
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initSmokeAppCheck } from './lib/smoke_app_check.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function mustInclude(relPath, ...needles) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  const text = readFileSync(full, 'utf8');
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function loadEnv() {
  if (!existsSync(envPath)) return null;
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

async function main() {
  console.log('[smoke:confirm-inbox] Static wiring…');
  mustInclude('functions/src/callables/inbox.ts', 'confirmInboxItem', 'dismissInboxItem');
  mustInclude('functions/src/callables/inbox.ts', 'guardSensitiveCallableV2');
  mustInclude('firestore.rules', 'match /inbox_queue/{docId}', 'allow create, update, delete: if false');

  const env = loadEnv();
  if (!env?.VITE_FIREBASE_API_KEY || !env?.VITE_FIREBASE_PROJECT_ID) {
    console.log('[smoke:confirm-inbox] PASS (static only — saknar .env för prod)');
    return;
  }

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

  if (env.SEED_FIREBASE_EMAIL && env.SEED_FIREBASE_PASSWORD) {
    await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
  } else {
    await signInAnonymously(auth);
  }

  const getQueue = httpsCallable(functions, 'getInboxQueue');
  const queue = await getQueue({});
  assert(Array.isArray(queue.data?.items), 'getInboxQueue ska returnera items[]');
  console.log('[smoke:confirm-inbox] getInboxQueue OK — items:', queue.data.items.length);
  console.log('\n[smoke:confirm-inbox] PASS');
}

main().catch((err) => {
  console.error('[smoke:confirm-inbox] FAIL:', err.message ?? err);
  process.exit(1);
});
