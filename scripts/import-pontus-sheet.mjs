/**
 * Engångsimport från Google Kalkylark (PontusArbetsapp) → Firestore.
 *
 * Exportera i Sheets: Fil → Ladda ner → CSV, sedan:
 *
 *   node scripts/import-pontus-sheet.mjs --stamp-csv ~/Downloads/Stämpelklocka.csv --dry-run
 *   node scripts/import-pontus-sheet.mjs --stamp-csv ~/Downloads/Stämpelklocka.csv
 *   node scripts/import-pontus-sheet.mjs --ledger-csv ~/Downloads/FastaUtgifter-log.csv
 *
 * Kräver: .env med VITE_FIREBASE_*
 * Rekommenderas: SEED_FIREBASE_EMAIL + SEED_FIREBASE_PASSWORD (samma uid som appen)
 *
 * Collections: time_entries, economy_ledger (ej transactions WORM — använd ledger för utgift/inkomst)
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
  serverTimestamp,
} from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function loadEnv() {
  if (!existsSync(envPath)) throw new Error('Saknar .env i projektroten');
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

function parseArgs(argv) {
  const out = { dryRun: false, stampCsv: null, ledgerCsv: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') out.dryRun = true;
    else if (argv[i] === '--stamp-csv') out.stampCsv = argv[++i];
    else if (argv[i] === '--ledger-csv') out.ledgerCsv = argv[++i];
  }
  return out;
}

/** Minimal CSV row split (no embedded commas in quotes). */
function parseCsv(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/[,;]/).map((c) => c.trim().replace(/^"|"$/g, '')));
}

function normalizeDate(val) {
  const s = String(val || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return null;
}

function normalizeClock(clock) {
  const cleaned = String(clock || '00:00').trim().replace(/\./g, ':');
  const [hRaw, minRaw = '0'] = cleaned.split(':');
  const h = Number(hRaw);
  const min = Number(minRaw);
  if (Number.isNaN(h) || Number.isNaN(min)) return '00:00';
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function parseHoursWorked(date, clockIn, clockOut, breakMinutes, scopePercent) {
  if (!clockOut) return 0;
  const [y, m, d] = date.split('-').map(Number);
  const [hi, mi] = clockIn.split(':').map(Number);
  const [ho, mo] = clockOut.split(':').map(Number);
  const start = new Date(y, m - 1, d, hi, mi, 0);
  const end = new Date(y, m - 1, d, ho, mo, 0);
  if (end <= start) return 0;
  const raw = (end - start) / 3_600_000;
  const net = Math.max(0, raw - breakMinutes / 60);
  return Math.round(net * (scopePercent / 100) * 10) / 10;
}

function parseStampRows(rows) {
  const out = [];
  for (const row of rows) {
    if (row.length < 4) continue;
    const date = normalizeDate(row[0]);
    if (!date) continue;
    const clockIn = normalizeClock(row[2] ?? row[1] ?? '08:00');
    const clockOutRaw = row[3] ?? '';
    const clockOut = clockOutRaw ? normalizeClock(clockOutRaw) : null;
    const category = String(row[9] ?? row[4] ?? 'Arbete').trim() || 'Arbete';
    const breakMinutes = Number(row[10] ?? row[5] ?? 30) || 30;
    const scopeMatch = category.match(/\((\d+)%\)/);
    const scopePercent = scopeMatch ? Number(scopeMatch[1]) : 100;
    const hoursWorked =
      row[6] != null && String(row[6]).trim() !== ''
        ? Number(String(row[6]).replace(',', '.')) || 0
        : parseHoursWorked(date, clockIn, clockOut, breakMinutes, scopePercent);

    out.push({
      date,
      clockIn,
      clockOut,
      category,
      breakMinutes,
      scopePercent,
      hoursWorked,
      isOpen: !clockOut,
    });
  }
  return out;
}

function parseLedgerRows(rows) {
  const out = [];
  for (const row of rows) {
    if (row.length < 4) continue;
    const date = normalizeDate(row[0]);
    if (!date) continue;
    const category = String(row[1] ?? '').trim();
    const typeRaw = String(row[2] ?? 'utgift').toLowerCase();
    const type = typeRaw.includes('inkomst') ? 'inkomst' : 'utgift';
    const description = String(row[3] ?? row[2] ?? '').trim();
    const amountSek = Number(String(row[4] ?? row[8] ?? '0').replace(/\s/g, '').replace(',', '.'));
    if (!description || Number.isNaN(amountSek) || amountSek <= 0) continue;
    out.push({ date, category, description, amountSek, type });
  }
  return out;
}

async function authenticate(auth, env) {
  const email = env.SEED_FIREBASE_EMAIL;
  const password = env.SEED_FIREBASE_PASSWORD;
  if (email && password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user.uid;
  }
  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.stampCsv && !args.ledgerCsv) {
    console.error('Ange minst --stamp-csv eller --ledger-csv');
    process.exit(1);
  }

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
  const uid = await authenticate(auth, env);
  console.log('[import] uid:', uid, args.dryRun ? '(dry-run)' : '');

  if (args.stampCsv) {
    const text = readFileSync(resolve(args.stampCsv), 'utf8');
    const rows = parseCsv(text).slice(1);
    const entries = parseStampRows(rows);
    console.log('[import] time_entries:', entries.length);
    for (const e of entries) {
      if (args.dryRun) {
        console.log('  ', e.date, e.clockIn, e.clockOut ?? 'open', e.hoursWorked, e.category);
        continue;
      }
      await addDoc(collection(db, 'time_entries'), {
        userId: uid,
        ownerId: uid,
        ...e,
        createdAt: serverTimestamp(),
      });
    }
  }

  if (args.ledgerCsv) {
    const text = readFileSync(resolve(args.ledgerCsv), 'utf8');
    const rows = parseCsv(text);
    const entries = parseLedgerRows(rows);
    console.log('[import] economy_ledger:', entries.length);
    for (const e of entries) {
      if (args.dryRun) {
        console.log('  ', e.date, e.type, e.amountSek, e.description);
        continue;
      }
      await addDoc(collection(db, 'economy_ledger'), {
        userId: uid,
        ownerId: uid,
        ...e,
        createdAt: serverTimestamp(),
      });
    }
  }

  console.log('[import] klar.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
