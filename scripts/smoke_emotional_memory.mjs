/**
 * Smoke: emotional-memory modul — statisk wiring + valfri WORM live-test.
 * Usage: npm run smoke:emotional-memory
 */
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { initSmokeAppCheck } from './lib/smoke_app_check.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(path) {
  assert(existsSync(path), `Saknar fil: ${path}`);
  return readFileSync(path, 'utf8');
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

async function expectDenied(label, fn) {
  try {
    await fn();
    throw new Error(`${label}: förväntade permission-denied men lyckades`);
  } catch (err) {
    if (err.message?.includes('förväntade permission-denied')) throw err;
    const code = err?.code ?? '';
    assert(
      code === 'permission-denied' || String(err.message).includes('Missing or insufficient permissions'),
      `${label}: oväntat fel — ${code || err.message}`,
    );
    console.log(`[smoke] ${label}: NEKAD (OK)`);
  }
}

function runStaticChecks() {
  const moduleRoot = resolve(root, 'src/modules/features/emotional-memory');
  const required = [
    'index.ts',
    'MemoryTestView.tsx',
    'store/useEmotionalMemoryStore.ts',
    'components/MemoryInputView.tsx',
    'components/EmotionalMemoryComponent.tsx',
    'components/EmotionalMemoryListPanel.tsx',
  ];
  for (const file of required) {
    assert(existsSync(resolve(moduleRoot, file)), `Saknar modulfil: ${file}`);
  }

  const indexSrc = read(resolve(moduleRoot, 'index.ts'));
  assert(indexSrc.includes('EmotionalMemoryComponent'), 'index.ts exporterar inte EmotionalMemoryComponent');
  assert(indexSrc.includes('useEmotionalMemoryStore'), 'index.ts exporterar inte useEmotionalMemoryStore');
  assert(indexSrc.includes('saveEmotionalMemory'), 'index.ts exporterar inte saveEmotionalMemory');

  const firestoreSrc = read(resolve(root, 'src/modules/core/firebase/emotionalMemoryFirestore.ts'));
  assert(firestoreSrc.includes('EMOTIONAL_MEMORY_WORM_KEYS'), 'Saknar EMOTIONAL_MEMORY_WORM_KEYS');
  assert(firestoreSrc.includes('assertWormPayload'), 'Saknar WORM payload guard');

  const rules = read(resolve(root, 'firestore.rules'));
  assert(rules.includes('match /emotional_memory/{docId}'), 'firestore.rules saknar emotional_memory');
  assert(rules.includes('isValidEmotionalMemoryCreate'), 'firestore.rules saknar validering');
  assert(rules.includes('allow update, delete: if false'), 'firestore.rules saknar WORM update/delete block');

  const routes = read(resolve(root, 'src/modules/core/routing/AppRoutes.tsx'));
  assert(routes.includes('/dev/memory-test'), 'AppRoutes saknar dev-rutt');
  assert(
    routes.includes('import.meta.env.DEV'),
    'AppRoutes saknar prod-skydd (import.meta.env.DEV) för /dev/memory-test',
  );

  const mabraView = read(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/components/EmotionalMemoryView.tsx'),
  );
  assert(mabraView.includes('EmotionalMemoryComponent'), 'MåBra EmotionalMemoryView delegerar inte till komponenten');

  console.log('[smoke] Statisk wiring: OK');
}

async function runLiveWormTest(env) {
  if (!env?.SEED_FIREBASE_EMAIL || !env?.SEED_FIREBASE_PASSWORD) {
    console.log('[smoke] Hoppar live WORM-test (saknar SEED_FIREBASE_* i .env)');
    return;
  }

  assert(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_* krävs för live-test');

  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  if (initSmokeAppCheck(app, env)) {
    console.log('[smoke] App Check (debug token) initierad');
  } else {
    console.log('[smoke] App Check hoppad (saknar VITE_APP_CHECK_DEBUG_TOKEN)');
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('[smoke] Live WORM — inloggning med SEED_FIREBASE_EMAIL…');
  const cred = await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
  const uid = cred.user.uid;

  const payload = {
    userId: uid,
    ownerId: uid,
    createdAt: serverTimestamp(),
    memoryType: 'feeling',
    content: `[smoke] emotional-memory ${new Date().toISOString()}`,
    intensity: 5,
  };

  const ref = collection(db, 'emotional_memory');
  const docRef = await addDoc(ref, payload);
  console.log('[smoke] create OK:', docRef.id);

  await expectDenied('update', () =>
    updateDoc(doc(db, 'emotional_memory', docRef.id), { content: 'mutated' }),
  );
  await expectDenied('delete', () => deleteDoc(doc(db, 'emotional_memory', docRef.id)));

  console.log('[smoke] Live WORM: OK');
}

async function main() {
  runStaticChecks();
  const env = loadEnv();
  await runLiveWormTest(env);
  console.log('\n[smoke] PASS — emotional-memory.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
