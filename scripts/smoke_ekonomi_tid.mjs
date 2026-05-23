/**
 * Smoke: Ekonomi / stämpelklocka — time_entries in/ut, hoursWorked, cleanup.
 * Usage: npm run smoke:ekonomi
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
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

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

function parseClockOnDate(dateStr, clock) {
  const [h, min] = clock.split(':').map(Number);
  const [y, m, d] = dateStr.split('-').map(Number);
  const base = new Date(y, m - 1, d, h, min, 0, 0);
  return base;
}

function computeHoursWorked({ date, clockIn, clockOut, breakMinutes, scopePercent }) {
  const start = parseClockOnDate(date, clockIn);
  const end = parseClockOnDate(date, clockOut);
  if (end <= start) return 0;
  const rawHours = (end.getTime() - start.getTime()) / 3_600_000;
  const net = Math.max(0, rawHours - breakMinutes / 60);
  return Math.round(net * (scopePercent / 100) * 10) / 10;
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

  console.log('[smoke] Anonymous sign-in…');
  const { user } = await signInAnonymously(auth);
  const uid = user.uid;

  const start = new Date();
  const date = formatDateLocal(start);
  const clockIn = formatTimeLocal(start);
  const end = new Date(start.getTime() + 61 * 60 * 1000);
  const clockOut = formatTimeLocal(end);
  const breakMinutes = 0;
  const scopePercent = 100;
  const hoursWorked = computeHoursWorked({ date, clockIn, clockOut, breakMinutes, scopePercent });

  assert(hoursWorked > 0, `hoursWorked ska vara > 0, fick ${hoursWorked}`);

  console.log('[smoke] time_entries create (open pass)…');
  const createRef = await addDoc(collection(db, 'time_entries'), {
    userId: uid,
    ownerId: uid,
    date,
    clockIn,
    clockOut: null,
    category: 'Arbete',
    breakMinutes,
    scopePercent,
    hoursWorked: 0,
    isOpen: true,
    createdAt: serverTimestamp(),
  });
  assert(createRef.id, 'time_entry saknar id');

  const afterIn = await getDoc(doc(db, 'time_entries', createRef.id));
  assert(afterIn.exists(), 'time_entry saknas efter create');
  assert(afterIn.data().isOpen === true, 'isOpen ska vara true');
  assert(afterIn.data().ownerId === uid, 'ownerId fel efter create');

  console.log('[smoke] time_entries update (close pass)…');
  await updateDoc(doc(db, 'time_entries', createRef.id), {
    userId: uid,
    ownerId: uid,
    clockOut,
    hoursWorked,
    isOpen: false,
    updatedAt: serverTimestamp(),
  });

  const afterOut = await getDoc(doc(db, 'time_entries', createRef.id));
  assert(afterOut.data().isOpen === false, 'isOpen ska vara false');
  assert(afterOut.data().hoursWorked > 0, 'hoursWorked ska vara > 0 efter ut');
  assert(afterOut.data().ownerId === uid, 'ownerId fel efter update');
  console.log('[smoke] utstämpling OK —', afterOut.data().hoursWorked, 'h');

  console.log('[smoke] cleanup delete test document…');
  try {
    await deleteDoc(doc(db, 'time_entries', createRef.id));
    console.log('[smoke] cleanup OK');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn('[smoke] cleanup delete misslyckades (lämna test-rad i Console):', msg);
  }

  console.log('\n[smoke] PASS — Ekonomi / stämpelklocka (time_entries).');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
