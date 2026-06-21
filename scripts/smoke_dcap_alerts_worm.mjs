/**
 * Smoke: dcap_alerts WORM — Admin SDK create, client read OK, client mutate NEKAD.
 * Reviews går till dcap_alert_reviews (append-only), aldrig mutera alert.
 * Usage: npm run smoke:dcap-alerts-worm
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
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

async function seedDcapAlertViaAdmin(admin, uid, stamp) {
  const inputHash = `smoke_worm_${stamp.replace(/[:.]/g, '')}`;
  const docRef = await admin.firestore().collection('dcap_alerts').add({
    ownerId: uid,
    userId: uid,
    riskScore: 85,
    recommendedAction: 'ALERT',
    inputHash,
    payloadHash: inputHash.slice(0, 16),
    detectionCount: 0,
    status: 'pending_human_review',
    source: 'smoke_dcap_alerts_worm',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { alertId: docRef.id, inputHash };
}

async function main() {
  const env = loadEnv();
  assert(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_* krävs');
  assert(env.SEED_FIREBASE_EMAIL && env.SEED_FIREBASE_PASSWORD, 'SEED_FIREBASE_* krävs för live WORM-smoke');

  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  if (initSmokeAppCheck(app, env)) {
    console.log('[smoke] App Check (debug token) initierad');
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('[smoke] Inloggning med SEED_FIREBASE_EMAIL…');
  const cred = await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
  const uid = cred.user.uid;
  console.log('[smoke] uid:', uid);

  const { loadFirebaseAdmin } = await import('./lib/firebaseAdmin.mjs');
  const admin = loadFirebaseAdmin(projectId);
  const stamp = new Date().toISOString();

  const { alertId } = await seedDcapAlertViaAdmin(admin, uid, stamp);
  console.log('[smoke] Admin create dcap_alerts: OK', alertId);

  const alertSnap = await getDoc(doc(db, 'dcap_alerts', alertId));
  assert(alertSnap.exists(), 'client read single doc: saknas');
  assert(alertSnap.data()?.ownerId === uid, 'client read: fel ownerId');
  console.log('[smoke] client read single doc: OK');

  const listSnap = await getDocs(query(collection(db, 'dcap_alerts'), where('ownerId', '==', uid)));
  assert(listSnap.docs.some((d) => d.id === alertId), 'client read owner-scoped: post hittades inte');
  console.log('[smoke] client read owner-scoped: OK');

  await expectDenied('client create dcap_alerts', () =>
    addDoc(collection(db, 'dcap_alerts'), {
      ownerId: uid,
      userId: uid,
      riskScore: 90,
      recommendedAction: 'ALERT',
      inputHash: 'client_spoof',
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied('client update dcap_alerts (WORM)', () =>
    updateDoc(doc(db, 'dcap_alerts', alertId), { status: 'tampered' }),
  );

  await expectDenied('client delete dcap_alerts (WORM)', () =>
    deleteDoc(doc(db, 'dcap_alerts', alertId)),
  );

  const reviewRef = await admin.firestore().collection('dcap_alert_reviews').add({
    ownerId: uid,
    userId: uid,
    alertId,
    decision: 'acknowledged',
    source: 'smoke_dcap_alerts_worm',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('[smoke] Admin create dcap_alert_reviews: OK', reviewRef.id);

  const reviewSnap = await getDoc(doc(db, 'dcap_alert_reviews', reviewRef.id));
  assert(reviewSnap.exists(), 'client read review: saknas');
  console.log('[smoke] client read dcap_alert_reviews: OK');

  await expectDenied('client create dcap_alert_reviews', () =>
    addDoc(collection(db, 'dcap_alert_reviews'), {
      ownerId: uid,
      userId: uid,
      alertId,
      decision: 'dismissed',
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied('client update dcap_alert_reviews (WORM)', () =>
    updateDoc(doc(db, 'dcap_alert_reviews', reviewRef.id), { decision: 'tampered' }),
  );

  console.log('\n[smoke] PASS — dcap_alerts WORM + separata reviews verifierade.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
