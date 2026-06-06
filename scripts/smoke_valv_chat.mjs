/**
 * Smoke: Valv-Chat — reality_vault seed + valvChatQuery (prod callables).
 * Usage: node scripts/smoke_valv_chat.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
  const db = getFirestore(app);
  const functions = getFunctions(app, 'europe-west1');

  console.log('[smoke] Anonymous sign-in…');
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;
  console.log('[smoke] uid:', uid);

  const stamp = new Date().toISOString().slice(0, 19);
  const truth = `Smoke valv ${stamp}: lämning 07:45 enligt schema.`;

  console.log('[smoke] Seed reality_vault…');
  const docRef = await addDoc(collection(db, 'reality_vault'), {
    ownerId: uid,
    userId: uid,
    truth,
    category: 'smoke',
    entryType: 'simple',
    action: 'smoke_test',
    createdAt: serverTimestamp(),
  });
  console.log('[smoke] vault docId:', docRef.id);

  const issueVault = httpsCallable(functions, 'issueVaultSession');
  console.log('[smoke] issueVaultSession…');
  const session = await issueVault({});
  const vaultSessionToken = session.data?.vaultSessionToken;
  assert(typeof vaultSessionToken === 'string' && vaultSessionToken.length >= 32, 'saknar vaultSessionToken');

  const valvChat = httpsCallable(functions, 'valvChatQuery');
  console.log('[smoke] valvChatQuery…');
  const result = await valvChat({ question: 'När var lämning enligt smoke-testet?', vaultSessionToken });
  const data = result.data;
  assert(typeof data?.answer === 'string' && data.answer.length > 0, 'saknar answer');
  assert(Array.isArray(data?.citations), 'saknar citations');

  const hit = data.citations.some((c) => c.docId === docRef.id);
  console.log('[smoke] citations:', data.citations.length, 'match seed:', hit ? 'YES' : 'NO');

  console.log('\n[smoke] PASS — valvChatQuery svarar.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
