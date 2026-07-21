/**
 * Smoke: generatePayslip callable + payslip_snapshots WORM read.
 * Usage: npm run smoke:payslip
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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

  console.log('[smoke] generatePayslip callable…');
  const fn = httpsCallable(functions, 'generatePayslip');
  let data;
  try {
    const res = await fn({});
    data = res.data;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('not-found') || msg.includes('NOT_FOUND')) {
      console.warn('[smoke] SKIP — deploya functions (generatePayslip) först.');
      process.exit(0);
    }
    throw e;
  }

  assert(data?.payslipId, 'saknar payslipId');
  assert(data?.result?.taxSek != null, 'saknar taxSek');
  console.log('[smoke] payslip OK —', data.payslipId, 'net', data.result?.netSalarySek);

  const snap = await getDoc(doc(db, 'payslip_snapshots', data.payslipId));
  assert(snap.exists(), 'payslip_snapshots saknas');
  assert(snap.data()?.ownerId === user.uid, 'ownerId fel');
  assert(snap.data()?.isLocked === true, 'isLocked ska vara true');
  console.log('[smoke] WORM snapshot läsbar');

  console.log('\n[smoke] PASS — generatePayslip.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
