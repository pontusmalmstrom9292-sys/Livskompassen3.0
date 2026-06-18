/**
 * Smoke: Familjen — children_logs seed + childrenLogsQuery (G8).
 * Usage: node scripts/smoke_children_logs.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
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

  const debugToken = env.VITE_APP_CHECK_DEBUG_TOKEN;
  const appId = env.VITE_FIREBASE_APP_ID;
  const projectNumber = env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  if (debugToken && appId && projectNumber) {
    const exchangeUrl = `https://firebaseappcheck.googleapis.com/v1/projects/${projectNumber}/apps/${appId}:exchangeDebugToken?key=${encodeURIComponent(apiKey)}`;
    initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: async () => {
          const res = await fetch(exchangeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Firebase-AppCheck': debugToken },
            body: JSON.stringify({ debugToken, limitedUse: false }),
          });
          if (!res.ok) {
            throw new Error(`App Check exchangeDebugToken ${res.status}: ${await res.text()}`);
          }
          const data = await res.json();
          return {
            token: data.token,
            expireTimeMillis: data.ttl
              ? Date.now() + Number.parseInt(String(data.ttl).replace('s', ''), 10) * 1000
              : Date.now() + 3_600_000,
          };
        },
      }),
      isTokenAutoRefreshEnabled: true,
    });
  }

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, 'europe-west1');

  let cred;
  if (env.SEED_FIREBASE_EMAIL && env.SEED_FIREBASE_PASSWORD) {
    console.log('[smoke] Email sign-in (krävs för children_logs WORM)…');
    cred = await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
  } else {
    console.log('[smoke] Anonymous sign-in…');
    cred = await signInAnonymously(auth);
  }
  const uid = cred.user.uid;
  console.log('[smoke] uid:', uid);

  const stamp = new Date().toISOString().slice(0, 19);
  const observation = `Smoke barn ${stamp}: Kasper sov dåligt, vaknade 04:30.`;

  console.log('[smoke] Seed children_logs…');
  const docRef = await addDoc(collection(db, 'children_logs'), {
    ownerId: uid,
    userId: uid,
    childAlias: 'Kasper',
    action: 'livslogg',
    observation,
    truth: observation,
    category: 'vardag',
    createdAt: serverTimestamp(),
  });
  console.log('[smoke] children_logs docId:', docRef.id);

  const privateObservation = `Smoke private ${stamp}: Barnporten hemlig rad som inte får synas i RAG.`;
  console.log('[smoke] Seed private_child (ska filtreras bort)…');
  const privateRef = await addDoc(collection(db, 'children_logs'), {
    ownerId: uid,
    userId: uid,
    childAlias: 'Kasper',
    action: 'livslogg',
    observation: privateObservation,
    truth: privateObservation,
    category: 'vardag',
    visibility: 'private_child',
    authorRole: 'child',
    channel: 'barnporten',
    createdAt: serverTimestamp(),
  });
  console.log('[smoke] private_child docId:', privateRef.id);

  const query = httpsCallable(functions, 'childrenLogsQuery');
  console.log('[smoke] childrenLogsQuery…');
  const result = await query({
    question: 'Hur har Kaspers sömn varit enligt smoke-testet?',
    childAlias: 'Kasper',
  });
  const data = result.data;
  assert(typeof data?.answer === 'string' && data.answer.length > 0, 'saknar answer');
  assert(data?.silo === 'barnen', 'saknar silo barnen');
  assert(Array.isArray(data?.citations), 'saknar citations');

  const hit = data.citations.some((c) => c.docId === docRef.id);
  const privateLeak = data.citations.some((c) => c.docId === privateRef.id);
  assert(!privateLeak, 'private_child läckte in i childrenLogsQuery citations');
  console.log('[smoke] citations:', data.citations.length, 'match seed:', hit ? 'YES' : 'NO', 'private leak:', privateLeak ? 'YES' : 'NO');
  console.log('[smoke] answer excerpt:', data.answer.slice(0, 120));

  console.log('\n[smoke] PASS — childrenLogsQuery svarar.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
