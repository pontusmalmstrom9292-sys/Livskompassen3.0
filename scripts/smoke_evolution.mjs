/**
 * Smoke: Evolution Engine (evolution_ledger + evolution_hub) rules verification.
 * Usage: node scripts/smoke_evolution.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

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
    const code = err?.code ?? '';
    if (err.message?.includes('förväntade permission-denied')) throw err;
    assert(
      code === 'permission-denied' || String(err.message).includes('Missing or insufficient permissions'),
      `${label}: oväntat fel — ${code || err.message}`,
    );
    console.log(`[smoke] ${label}: NEKAD (OK)`);
  }
}

async function main() {
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
  const db = getFirestore(app);

  let cred;
  if (env.SEED_FIREBASE_EMAIL && env.SEED_FIREBASE_PASSWORD) {
    console.log('[smoke] Inloggning med SEED_FIREBASE_EMAIL (krävs för WORM)…');
    cred = await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
  } else {
    console.log('[smoke] Anonymous sign-in (kommer misslyckas om WORM kräver verifierad email)…');
    cred = await signInAnonymously(auth);
  }
  const uid = cred.user.uid;
  console.log('[smoke] uid:', uid);

  const stamp = new Date().toISOString();

  // === 1. Verify WORM evolution_ledger ===
  console.log('\n--- Test 1: evolution_ledger WORM rules ---');
  
  const ledgerDocRef = await addDoc(collection(db, 'evolution_ledger'), {
    ownerId: uid,
    userId: uid,
    type: 'milestone_unlocked',
    pillar: 'kognitiv',
    levelBefore: 1,
    levelAfter: 2,
    rationale: `Smoke test of Lagen om Evig Tillväxt at ${stamp}`,
    metadata: { test: true },
    createdAt: serverTimestamp(),
  });
  console.log('[smoke] create evolution_ledger: OK', ledgerDocRef.id);

  // Read back
  const ledgerSnap = await getDoc(ledgerDocRef);
  assert(ledgerSnap.exists(), 'Kunde inte läsa skapat ledger-dokument');
  console.log('[smoke] read evolution_ledger: OK');

  // Verify update is denied
  await expectDenied('update evolution_ledger', () =>
    updateDoc(doc(db, 'evolution_ledger', ledgerDocRef.id), { rationale: 'tampered' })
  );

  // Verify delete is denied
  await expectDenied('delete evolution_ledger', () =>
    deleteDoc(doc(db, 'evolution_ledger', ledgerDocRef.id))
  );

  // Verify shadow fields (updatedAt) are denied on create
  await expectDenied('create evolution_ledger with shadow fields', () =>
    addDoc(collection(db, 'evolution_ledger'), {
      ownerId: uid,
      userId: uid,
      type: 'milestone_unlocked',
      pillar: 'kognitiv',
      levelBefore: 1,
      levelAfter: 2,
      rationale: 'shadow',
      metadata: {},
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    })
  );

  // Verify invalid milestone types are denied on create
  await expectDenied('create evolution_ledger with invalid milestone type', () =>
    addDoc(collection(db, 'evolution_ledger'), {
      ownerId: uid,
      userId: uid,
      type: 'invalid_milestone_type',
      pillar: 'kognitiv',
      levelBefore: 1,
      levelAfter: 2,
      rationale: 'invalid',
      metadata: {},
      createdAt: serverTimestamp(),
    })
  );

  // === 2. Verify evolution_hub (mutable status) ===
  console.log('\n--- Test 2: evolution_hub rules ---');

  const hubDocRef = doc(db, 'evolution_hub', uid);
  
  await setDoc(hubDocRef, {
    ownerId: uid,
    userId: uid,
    pillars: {
      kognitiv: { level: 2, score: 85 },
      emotionell: { level: 1, score: 30 },
      vardag: { level: 1, score: 40 },
      relationell: { level: 1, score: 50 },
      valv: { level: 1, score: 20 },
    },
    childrenAgeState: {
      kasper: { ageYears: 8, currentBracket: 'early_school', lastUpdated: stamp },
      arvid: { ageYears: 5, currentBracket: 'toddler_preschool', lastUpdated: stamp },
    },
    unlockedFeatureFlags: ['economy_advanced'],
    updatedAt: serverTimestamp(),
  });
  console.log('[smoke] create/set evolution_hub: OK');

  // Read back
  const hubSnap = await getDoc(hubDocRef);
  assert(hubSnap.exists(), 'Kunde inte läsa skapat hub-dokument');
  console.log('[smoke] read evolution_hub: OK');

  // Verify update is allowed
  await updateDoc(hubDocRef, {
    unlockedFeatureFlags: ['economy_advanced', 'planning_kanban'],
    updatedAt: serverTimestamp(),
  });
  console.log('[smoke] update evolution_hub: OK');

  // Verify delete is denied
  await expectDenied('delete evolution_hub', () => deleteDoc(hubDocRef));

  console.log('\n[smoke] ALL PASS — Evolution Engine rules verified.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
