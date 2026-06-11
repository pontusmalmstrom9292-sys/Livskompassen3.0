/**
 * Smoke: G9 — EntityProfile registry + WebAuthn-gate på issueVaultSession.
 * Live registry E2E kräver manuell WebAuthn i appen (ej automatiskt i Node).
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

function mustInclude(relPath, ...needles) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  const text = readFileSync(full, 'utf8');
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

async function expectDenied(label, fn) {
  try {
    await fn();
    throw new Error(`${label}: förväntade permission-denied men lyckades`);
  } catch (err) {
    if (err.message?.includes('förväntade permission-denied')) throw err;
    const code = err?.code ?? '';
    const msg = String(err.message ?? '');
    assert(
      code === 'permission-denied' ||
        code === 'functions/permission-denied' ||
        code === 'invalid-argument' ||
        code === 'functions/invalid-argument' ||
        msg.includes('WebAuthn krävs') ||
        msg.includes('origin och rpID'),
      `${label}: oväntat fel — ${code || msg}`,
    );
    console.log(`[smoke] ${label}: NEKAD (OK)`);
  }
}

async function main() {
  mustInclude('functions/src/lib/entityProfileStore.ts', 'KEY_ENTITIES', 'SystemSynapse');
  mustInclude('functions/src/callables/valv.ts', 'getEntityProfileRegistry', 'assertVaultSession');

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
  await expectDenied('issueVaultSession utan WebAuthn', () => issueVault({}));

  console.log('\n[smoke] PASS — EntityProfile wiring + WebAuthn-gate.');
  console.log('[smoke] getEntityProfileRegistry E2E: kör manuellt i app efter Fyren + biometri.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
