/**
 * Smoke: G7 journal_woven — opt-in dagbok → kampspar (callable journalWovenToKampspar).
 * Usage: node scripts/smoke_journal_woven.mjs
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

  console.log('[smoke:journal_woven] Anonymous sign-in…');
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;

  const stamp = new Date().toISOString().slice(0, 19);
  const mood = 'Lugn';
  const text = `Smoke G7 ${stamp}: kort reflektion för Kampspár-opt-in.`;

  console.log('[smoke:journal_woven] Seed journal…');
  const journalRef = await addDoc(collection(db, 'journal'), {
    userId: uid,
    ownerId: uid,
    mood,
    text,
    createdAt: serverTimestamp(),
  });
  console.log('[smoke:journal_woven] journalEntryId:', journalRef.id);

  const woven = httpsCallable(functions, 'journalWovenToKampspar');

  console.log('[smoke:journal_woven] optIn=false ska faila…');
  let rejected = false;
  try {
    await woven({
      journalEntryId: journalRef.id,
      mood,
      text,
      optIn: false,
    });
  } catch {
    rejected = true;
  }
  assert(rejected, 'optIn:false skulle kasta invalid-argument');

  console.log('[smoke:journal_woven] optIn=true första anrop…');
  const first = await woven({
    journalEntryId: journalRef.id,
    mood,
    text,
    optIn: true,
  });
  const firstData = first.data;
  assert(typeof firstData?.kampsparDocId === 'string', 'saknar kampsparDocId');
  console.log('[smoke:journal_woven] kampsparDocId:', firstData.kampsparDocId);

  console.log('[smoke:journal_woven] idempotent andra anrop…');
  const second = await woven({
    journalEntryId: journalRef.id,
    mood,
    text,
    optIn: true,
  });
  assert(
    second.data?.kampsparDocId === firstData.kampsparDocId,
    'idempotent: samma kampsparDocId förväntades'
  );
  assert(second.data?.idempotent === true, 'idempotent flag förväntades true');

  console.log('[smoke:journal_woven] PASS');
}

main().catch((err) => {
  console.error('[smoke:journal_woven] FAIL:', err.message ?? err);
  process.exit(1);
});
