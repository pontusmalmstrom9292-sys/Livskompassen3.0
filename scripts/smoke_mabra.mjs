/**
 * Smoke: Måbra — mabra_sessions WORM + mabraCoach callable.
 * Usage: npm run smoke:mabra
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
  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, 'europe-west1');

  console.log('[smoke] Anonymous sign-in…');
  const { user } = await signInAnonymously(auth);
  await user.getIdToken(true);
  const uid = user.uid;

  console.log('[smoke] mabra_sessions WORM create…');
  const sessionRef = await addDoc(collection(db, 'mabra_sessions'), {
    userId: uid,
    ownerId: uid,
    exerciseType: 'breathing',
    hubSymptom: 'panic_rsd',
    durationSeconds: 60,
    createdAt: serverTimestamp(),
  });
  assert(sessionRef.id, 'mabra_sessions saknar id');
  console.log('[smoke] session OK —', sessionRef.id);

  const coachFn = httpsCallable(functions, 'mabraCoach');

  console.log('[smoke] mabraCoach guardrail (ex-text)…');
  const guardResult = await coachFn({
    hubSymptom: 'panic_rsd',
    exerciseType: 'breathing',
    optionalNote: 'Fick sms från ex om vårdnad och konflikt',
  });
  assert(guardResult.data?.redirectToSpeglar === true, 'guardrail ska sätta redirectToSpeglar');
  console.log('[smoke] guardrail OK');

  console.log('[smoke] mabraCoach…');
  const result = await coachFn({
    hubSymptom: 'panic_rsd',
    exerciseType: 'breathing',
  });
  const coach = result.data?.coach;
  assert(typeof coach === 'string' && coach.trim().length > 0, 'saknar coach (string)');
  console.log('[smoke] coach excerpt:', coach.slice(0, 180));

  console.log('\n[smoke] PASS — Måbra backend.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  if (err.code) console.error('[smoke] code:', err.code);
  if (err.details) console.error('[smoke] details:', err.details);
  process.exit(1);
});
