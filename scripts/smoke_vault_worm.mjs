/**
 * Smoke: Verklighetsvalvet WORM + silo — create/read OK, update/delete nekas.
 * Usage: node scripts/smoke_vault_worm.mjs
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
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { initSmokeAppCheck } from './lib/smoke_app_check.mjs';

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

  if (initSmokeAppCheck(app, env)) {
    console.log('[smoke] App Check (debug token) initierad');
  } else {
    console.warn('[smoke] App Check ej initierad — WORM client-write kan nekas i prod');
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  let cred;
  if (env.SEED_FIREBASE_EMAIL && env.SEED_FIREBASE_PASSWORD) {
    console.log('[smoke] Inloggning med SEED_FIREBASE_EMAIL (krävs för WORM)…');
    cred = await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
  } else {
    console.log('[smoke] Anonymous sign-in (kommer misslyckas om WORM är aktivt)…');
    cred = await signInAnonymously(auth);
  }
  const uid = cred.user.uid;
  console.log('[smoke] uid:', uid);

  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const { seedSmokeVaultClaims } = await import('./lib/firebaseAdmin.mjs');
  try {
    await seedSmokeVaultClaims(uid, projectId);
    await cred.user.getIdToken(true);
    console.log('[smoke] vaultUnlocked custom claims seeded (Admin SDK)');
  } catch (claimErr) {
    console.warn('[smoke] vault claims seed skipped:', claimErr?.message ?? claimErr);
  }

  const stamp = new Date().toISOString();
  const docRef = await addDoc(collection(db, 'reality_vault'), {
    ownerId: uid,
    userId: uid,
    truth: `WORM smoke ${stamp}`,
    action: 'smoke_worm',
    isLocked: true,
    createdAt: serverTimestamp(),
  });
  console.log('[smoke] create reality_vault: OK', docRef.id);

  const snap = await getDocs(query(collection(db, 'reality_vault'), where('ownerId', '==', uid)));
  const found = snap.docs.some((d) => d.id === docRef.id);
  assert(found, 'read owner-scoped: post hittades inte');
  console.log('[smoke] read owner-scoped: OK');

  await expectDenied('update (WORM)', () =>
    updateDoc(doc(db, 'reality_vault', docRef.id), { truth: 'tampered' }),
  );

  await expectDenied('delete (WORM)', () => deleteDoc(doc(db, 'reality_vault', docRef.id)));

  await expectDenied('create med shadow field updatedAt', () =>
    addDoc(collection(db, 'reality_vault'), {
      ownerId: uid,
      userId: uid,
      truth: 'shadow test',
      action: 'smoke_worm',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied('create med fel ownerId', () =>
    addDoc(collection(db, 'reality_vault'), {
      ownerId: 'not-my-uid',
      userId: uid,
      truth: 'spoof',
      action: 'smoke_worm',
      createdAt: serverTimestamp(),
    }),
  );

  console.log('\n[smoke] PASS — WORM-regler och owner-scope verifierade.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
