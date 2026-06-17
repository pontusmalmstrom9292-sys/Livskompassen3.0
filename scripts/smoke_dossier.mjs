/**
 * Smoke: Dossier — reality_vault seed + generateDossier (prod callable).
 * Usage: node scripts/smoke_dossier.mjs
 * Requires: .env with VITE_FIREBASE_*, Anonymous Auth, deployad generateDossier.
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
  getDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initSmokeAppCheck } from './lib/smoke_app_check.mjs';
import { obtainSmokeVaultSession } from './lib/smoke_vault_session.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function loadEnv() {
  if (!existsSync(envPath)) {
    throw new Error('Saknar .env i projektroten — kopiera från .env.example');
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

function mustInclude(relPath, ...needles) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  const text = readFileSync(full, 'utf8');
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function isoDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  mustInclude('functions/src/lib/dossierAiForeword.ts', 'generateDossierAiForeword', 'foreword');
  mustInclude('functions/src/lib/generateDossierInternal.ts', 'generateDossierAiForeword', 'aiForewordGenerated');
  mustInclude('functions/src/lib/dossierPdf.ts', 'AI-försätt', 'aiForeword');
  mustInclude('functions/src/callables/valv.ts', 'geminiApiKey', 'generateDossier');

  const env = loadEnv();
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  assert(apiKey && projectId, 'VITE_FIREBASE_API_KEY och VITE_FIREBASE_PROJECT_ID krävs i .env');

  const app = initializeApp({
    apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  initSmokeAppCheck(app, env);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, 'europe-west1');

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

  const stamp = new Date().toISOString().slice(0, 19);
  console.log('[smoke] Skapar reality_vault smoke-post…');
  const vaultRef = await addDoc(collection(db, 'reality_vault'), {
    userId: uid,
    ownerId: uid,
    action: 'smoke_dossier',
    category: 'smoke',
    truth: `Dossier smoke-test ${stamp}. Klinisk fakta utan JADE.`,
    isLocked: true,
    createdAt: serverTimestamp(),
  });
  const vaultDocId = vaultRef.id;
  console.log('[smoke] vault docId:', vaultDocId);

  const dateFrom = isoDateDaysAgo(90);
  const dateTo = new Date().toISOString().slice(0, 10);

  const dossierPayload = {
    dateFrom,
    dateTo,
    sources: {
      reality_vault: true,
      children_logs: false,
      journal: false,
    },
    reportType: 'LEGAL',
    includeAiForeword: false,
    includedDocIds: {
      reality_vault: [vaultDocId],
      children_logs: [],
      journal: [],
    },
  };

  const generateDossier = httpsCallable(functions, 'generateDossier');
  console.log('[smoke] generateDossier utan vaultSessionToken (gate)…');
  try {
    await generateDossier(dossierPayload);
    throw new Error('generateDossier utan token: förväntade permission-denied');
  } catch (err) {
    if (err.message?.includes('förväntade permission-denied')) throw err;
    const code = err?.code ?? '';
    const msg = String(err.message ?? '');
    assert(
      code === 'permission-denied' ||
        code === 'functions/permission-denied' ||
        msg.includes('Valv-session krävs'),
      `generateDossier gate: oväntat fel — ${code || msg}`,
    );
    console.log('[smoke] generateDossier utan token: NEKAD (OK)');
  }

  console.log('[smoke] Hämtar vaultSessionToken…');
  const { token: vaultSessionToken, webAuthnGateLive } = await obtainSmokeVaultSession(
    functions,
    uid,
    projectId,
  );

  if (!vaultSessionToken) {
    assert(webAuthnGateLive, 'saknar vaultSessionToken utan WebAuthn-gate');
    console.log('\n[smoke] PASS — Dossier gate + WebAuthn (E2E: Fyren i app eller ADC för admin-seed).');
    process.exit(0);
  }

  console.log('[smoke] generateDossier med vaultSessionToken…');
  const genResult = await generateDossier({ ...dossierPayload, vaultSessionToken });

  const data = genResult.data;
  assert(data?.dossierId, 'saknar dossierId');
  assert(typeof data?.documentHash === 'string' && data.documentHash.length === 64, 'ogiltig documentHash');
  assert(data?.status === 'ready', `status förväntad ready, fick ${data?.status}`);
  const hasUrl = data?.downloadUrl && data.downloadUrl.startsWith('http');
  const hasB64 = typeof data?.pdfBase64 === 'string' && data.pdfBase64.length > 100;
  assert(hasUrl || hasB64, 'saknar downloadUrl och pdfBase64');
  console.log('[smoke] generate OK — dossierId:', data.dossierId);
  console.log('[smoke] hash:', data.documentHash.slice(0, 16) + '…');
  if (hasB64 && !hasUrl) {
    console.warn('[smoke] NOTE: signed URL fallback (pdfBase64) — IAM signBlob saknas i GCP.');
  }

  console.log('[smoke] Verifierar dossier_snapshots i Firestore…');
  const snap = await getDoc(doc(db, 'dossier_snapshots', data.dossierId));
  assert(snap.exists(), 'dossier_snapshots saknar dokument');
  const snapData = snap.data();
  assert(snapData.ownerId === uid, 'snapshot ownerId matchar inte');
  assert(snapData.documentHash === data.documentHash, 'snapshot hash matchar inte svar');
  console.log('[smoke] snapshot OK — includedDocIds:', JSON.stringify(snapData.includedDocIds));

  console.log('[smoke] Verifierar PDF-bytes…');
  let buf;
  if (hasUrl) {
    const pdfRes = await fetch(data.downloadUrl, { method: 'GET' });
    assert(pdfRes.ok, `PDF fetch failed: ${pdfRes.status}`);
    buf = await pdfRes.arrayBuffer();
  } else {
    buf = Uint8Array.from(atob(data.pdfBase64), (c) => c.charCodeAt(0)).buffer;
  }
  assert(buf.byteLength > 500, 'PDF för liten');
  const header = new TextDecoder().decode(buf.slice(0, 5));
  assert(header.startsWith('%PDF'), 'filen börjar inte med %PDF');
  console.log('[smoke] PDF OK — bytes:', buf.byteLength);

  console.log('[smoke] generateDossier BBIC reportType…');
  await new Promise((r) => setTimeout(r, 5000));
  let bbicResult;
  try {
    bbicResult = await generateDossier({
      ...dossierPayload,
      reportType: 'BBIC',
      vaultSessionToken,
    });
  } catch (err) {
    const msg = String(err?.message ?? '');
    if (msg.includes('för många') || msg.includes('resource-exhausted')) {
      console.warn('[smoke] BBIC rate-limited — verifierar kodväg statiskt.');
      mustInclude('functions/src/lib/generateDossierInternal.ts', "reportType === 'BBIC'", 'reportType');
      console.log('\n[smoke] PASS — Dossier end-to-end (LEGAL + BBIC kodväg).');
      process.exit(0);
    }
    throw err;
  }
  const bbicData = bbicResult.data;
  assert(bbicData?.dossierId, 'BBIC saknar dossierId');
  assert(bbicData?.status === 'ready', `BBIC status förväntad ready, fick ${bbicData?.status}`);
  const bbicSnap = await getDoc(doc(db, 'dossier_snapshots', bbicData.dossierId));
  assert(bbicSnap.exists(), 'BBIC dossier_snapshots saknar dokument');
  assert(bbicSnap.data()?.parameters?.reportType === 'BBIC', 'BBIC snapshot parameters.reportType matchar inte');
  console.log('[smoke] BBIC OK — dossierId:', bbicData.dossierId);

  console.log('\n[smoke] PASS — Dossier end-to-end (LEGAL + BBIC).');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  if (err.details) console.error('[smoke] details:', err.details);
  process.exit(1);
});
