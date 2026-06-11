/**
 * Smoke: Kompasser — saveCheckIn + breakDownResponse.
 * Usage: npm run smoke:compass
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initSmokeAppCheck } from './lib/smoke_app_check.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function loadEnv() {
  if (!existsSync(envPath)) throw new Error('Saknar .env');
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

  initSmokeAppCheck(app, env);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, 'europe-west1');

  console.log('[smoke] Anonymous sign-in…');
  const { user } = await signInAnonymously(auth);
  const uid = user.uid;

  console.log('[smoke] saveCheckIn (checkins WORM)…');
  const checkRef = await addDoc(collection(db, 'checkins'), {
    userId: uid,
    ownerId: uid,
    questionId: 'compass_day',
    questionText: 'Smoke kompass',
    optionSelected: 'Stabil',
    taskCategory: 'day',
    createdAt: serverTimestamp(),
  });
  assert(checkRef.id, 'checkin saknar id');
  console.log('[smoke] checkin OK —', checkRef.id);

  console.log('[smoke] breakDownResponse…');
  const breakDown = httpsCallable(functions, 'breakDownResponse');
  const bd = await breakDown({ text: 'Jag ska svara på ett svårt mejl men fastnar.' });
  const steps = bd.data?.microSteps;
  assert(Array.isArray(steps) && steps.length > 0, 'saknar microSteps');
  assert(steps[0].instruction, 'mikrosteg saknar instruction');
  console.log('[smoke] Paralys OK —', steps.length, 'steg');

  console.log('\n[smoke] PASS — Kompasser backend.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
