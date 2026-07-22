/**
 * Smoke: Stämpelklocka — time_entries create + update (in/ut).
 * Usage: npm run smoke:stampla
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
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

function formatDateLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTimeLocal(date = new Date()) {
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
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

  if (initSmokeAppCheck(app, env)) {
    console.log('[smoke] App Check (debug token) initierad');
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('[smoke] Anonymous sign-in…');
  const { user } = await signInAnonymously(auth);
  const uid = user.uid;

  const now = new Date();
  const date = formatDateLocal(now);
  const clockIn = formatTimeLocal(now);

  console.log('[smoke] recordTimeIn (time_entries create, isOpen=true)…');
  const createRef = await addDoc(collection(db, 'time_entries'), {
    userId: uid,
    ownerId: uid,
    date,
    clockIn,
    clockOut: null,
    category: 'Arbete',
    breakMinutes: 30,
    scopePercent: 100,
    hoursWorked: 0,
    isOpen: true,
    createdAt: serverTimestamp(),
  });
  assert(createRef.id, 'time_entry saknar id');

  const afterIn = await getDoc(doc(db, 'time_entries', createRef.id));
  assert(afterIn.exists(), 'time_entry finns inte efter create');
  assert(afterIn.data().isOpen === true, 'isOpen ska vara true efter instämpling');
  assert(afterIn.data().ownerId === uid, 'ownerId fel efter create');
  console.log('[smoke] instämpling OK —', createRef.id);

  const clockOut = formatTimeLocal(new Date(now.getTime() + 60_000));
  console.log('[smoke] recordTimeOut (time_entries update, isOpen=false)…');
  await updateDoc(doc(db, 'time_entries', createRef.id), {
    userId: uid,
    ownerId: uid,
    clockOut,
    hoursWorked: 0.5,
    isOpen: false,
    updatedAt: serverTimestamp(),
  });

  const afterOut = await getDoc(doc(db, 'time_entries', createRef.id));
  assert(afterOut.exists(), 'time_entry finns inte efter update');
  assert(afterOut.data().isOpen === false, 'isOpen ska vara false efter utstämpling');
  assert(afterOut.data().clockOut === clockOut, 'clockOut saknas efter utstämpling');
  assert(afterOut.data().ownerId === uid, 'ownerId fel efter update');
  console.log('[smoke] utstämpling OK —', afterOut.data().hoursWorked, 'h');

  console.log('\n[smoke] PASS — Stämpelklocka (time_entries).');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
