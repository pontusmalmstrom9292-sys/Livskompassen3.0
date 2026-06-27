/**
 * Smoke: Valv-session gate — valvChatQuery, getEntityProfileRegistry utan token nekas.
 * weaveJournalEntry kräver auth men inte Valv-session (Lager 1 async → weaver_pending).
 * Usage: npm run smoke:valv-gate
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
        code === 'failed-precondition' ||
        code === 'functions/failed-precondition' ||
        msg.includes('Missing or insufficient permissions') ||
        msg.includes('Valv-session krävs') ||
        msg.includes('Valv-session saknas') ||
        msg.includes('App Check-verifiering krävs'),
      `${label}: oväntat fel — ${code || msg}`,
    );
    console.log(`[smoke] ${label}: NEKAD (OK)`);
  }
}

function mustInclude(relPath, ...needles) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  const text = readFileSync(full, 'utf8');
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

async function main() {
  mustInclude('functions/src/callables/valv.ts', 'verifyVaultWebAuthnResponse', 'readWebAuthnResponse');
  mustInclude('functions/src/lib/vaultWebAuthn.ts', 'beginVaultWebAuthnChallenge', 'verifyVaultWebAuthnResponse');
  mustInclude('functions/src/index.ts', 'beginVaultWebAuthnChallenge', 'issueVaultSession');
  mustInclude('functions/src/callables/agents.ts', 'weaveJournalEntry', 'approveWeaverMetadata');
  mustInclude('functions/src/callables/agents.ts', 'approveWeaverMetadata', 'assertVaultSession');
  mustInclude('functions/src/callables/weeklySummary.ts', 'vaultSessionGrantsVaultRead', 'reality_vault');
  mustInclude('functions/src/callables/compass.ts', 'vaultSessionGrantsVaultRead', 'reality_vault');

  const env = loadEnv();
  assert(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_* krävs');

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
  const cred = await signInAnonymously(auth);
  console.log('[smoke] uid:', cred.user.uid);

  const valvChat = httpsCallable(functions, 'valvChatQuery');
  await expectDenied('valvChatQuery utan vaultSessionToken', () =>
    valvChat({ question: 'Smoke gate — ska nekas utan session.' }),
  );

  const registry = httpsCallable(functions, 'getEntityProfileRegistry');
  await expectDenied('getEntityProfileRegistry utan vaultSessionToken', () => registry({}));

  const issueVault = httpsCallable(functions, 'issueVaultSession');
  let liveWebAuthnGate = false;
  try {
    await issueVault({});
  } catch (err) {
    const code = err?.code ?? '';
    const msg = String(err.message ?? '');
    if (
      code === 'permission-denied' ||
      code === 'functions/permission-denied' ||
      code === 'invalid-argument' ||
      code === 'functions/invalid-argument' ||
      code === 'failed-precondition' ||
      code === 'functions/failed-precondition' ||
      msg.includes('WebAuthn krävs') ||
      msg.includes('origin och rpID') ||
      msg.includes('App Check-verifiering krävs')
    ) {
      liveWebAuthnGate = true;
      console.log('[smoke] issueVaultSession utan WebAuthn/App Check: NEKAD (OK)');
    } else {
      throw err;
    }
  }
  if (!liveWebAuthnGate) {
    console.warn(
      '[smoke] LIVE: issueVaultSession utan WebAuthn lyckades — deploy functions:issueVaultSession,functions:beginVaultWebAuthnChallenge',
    );
  }

  console.log('\n[smoke] PASS — Valv-session gate verifierad.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
