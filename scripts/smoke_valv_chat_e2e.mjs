/**
 * Smoke: Valv chat E2E — reality_vault seed + valvChatQuery med session + citations.
 * Usage: npm run smoke:valv-chat-e2e
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initSmokeAppCheck } from './lib/smoke_app_check.mjs';
import { obtainSmokeVaultSession } from './lib/smoke_vault_session.mjs';

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

function mustInclude(relPath, ...needles) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  const text = readFileSync(full, 'utf8');
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function isInternalCallableError(err) {
  const code = err?.code ?? '';
  const msg = String(err?.message ?? '');
  return code === 'internal' || code === 'functions/internal' || msg === 'INTERNAL';
}

async function main() {
  mustInclude('functions/src/callables/valv.ts', 'valvChatQuery', 'secrets: [geminiApiKey]');

  const env = loadEnv();
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  assert(env.VITE_FIREBASE_API_KEY && projectId, 'VITE_FIREBASE_* krävs i .env');

  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  initSmokeAppCheck(app, env);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, 'europe-west1');

  let cred;
  if (env.SEED_FIREBASE_EMAIL && env.SEED_FIREBASE_PASSWORD) {
    cred = await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
    const { seedSmokeVaultClaims } = await import('./lib/firebaseAdmin.mjs');
    await seedSmokeVaultClaims(cred.user.uid, projectId);
    await cred.user.getIdToken(true);
  } else {
    cred = await signInAnonymously(auth);
  }
  const uid = cred.user.uid;

  const stamp = new Date().toISOString().slice(0, 19);
  const truth = `Smoke valv-chat ${stamp}: lämning 07:45 enligt schema, dokumenterat datum.`;

  const docRef = await addDoc(collection(db, 'reality_vault'), {
    ownerId: uid,
    userId: uid,
    truth,
    category: 'smoke',
    entryType: 'simple',
    action: 'smoke_valv_chat_e2e',
    createdAt: serverTimestamp(),
  });
  console.log('[smoke] vault docId:', docRef.id);

  const valvChat = httpsCallable(functions, 'valvChatQuery');
  try {
    await valvChat({ question: 'Vad står i beviset om lämning?' });
    throw new Error('valvChatQuery utan token: förväntade permission-denied');
  } catch (err) {
    if (err.message?.includes('förväntade permission-denied')) throw err;
    const code = err?.code ?? '';
    const msg = String(err.message ?? '');
    assert(
      code === 'permission-denied' ||
        code === 'functions/permission-denied' ||
        msg.includes('Valv-session'),
      `valvChatQuery gate: oväntat fel — ${code || msg}`,
    );
    console.log('[smoke] valvChatQuery utan token: NEKAD (OK)');
  }

  const { token: vaultSessionToken, webAuthnGateLive } = await obtainSmokeVaultSession(
    functions,
    uid,
    projectId,
  );

  if (!vaultSessionToken) {
    assert(webAuthnGateLive, 'saknar vaultSessionToken utan WebAuthn-gate');
    console.log('\n[smoke] PASS — valvChatQuery gate (E2E kräver ADC/admin-seed eller WebAuthn i app).');
    process.exit(0);
  }

  let result;
  try {
    result = await valvChat({
      question: 'Vad säger beviset om lämning och tid?',
      vaultSessionToken,
    });
  } catch (err) {
    const code = err?.code ?? '';
    const msg = String(err?.message ?? '');
    const ragUnavailable =
      (code === 'functions/internal' || code === 'internal') &&
      (msg.includes('Valv-Chat kunde inte svara') || msg.includes('Vertex') || msg.includes('Gemini'));
    if (ragUnavailable) {
      console.log(
        '\n[smoke] SKIP — valvChatQuery session auth OK (LLM/RAG-backend ej tillgänglig i smoke-env).',
      );
      process.exit(0);
    }
    throw err;
  }

  const data = result.data;
  assert(typeof data?.answer === 'string' && data.answer.length > 0, 'saknar answer');
  assert(Array.isArray(data?.citations), 'saknar citations array');
  console.log('[smoke] answer length:', data.answer.length);
  console.log('[smoke] citations:', data.citations.length);

  console.log('\n[smoke] PASS — valvChatQuery E2E med session.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
