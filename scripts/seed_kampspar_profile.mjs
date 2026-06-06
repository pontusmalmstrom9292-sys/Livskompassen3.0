/**
 * Seed: Kunskapsvalvet — batch ingest from Kampspar-PROFIL-SEED.json
 * Usage:
 *   node scripts/seed_kampspar_profile.mjs --dry-run
 *   node scripts/seed_kampspar_profile.mjs
 *   node scripts/seed_kampspar_profile.mjs --skip-existing
 *   node scripts/seed_kampspar_profile.mjs --category=diagnos
 *   node scripts/seed_kampspar_profile.mjs --manifest=barn-referens
 *   node scripts/seed_kampspar_profile.mjs --anonymous
 *   node scripts/seed_kampspar_profile.mjs --verify
 *
 * Requires: .env with VITE_FIREBASE_*
 * Owner (rekommenderat — Google-konto utan lösenord):
 *   SEED_FIREBASE_EMAIL=pontus.malmstrom9292@gmail.com
 *   eller SEED_OWNER_UID=<firebase uid>
 *   + gcloud auth application-default login (eller GOOGLE_APPLICATION_CREDENTIALS)
 * Legacy: SEED_FIREBASE_EMAIL + SEED_FIREBASE_PASSWORD + --email-auth
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  initFirebaseAdmin,
  resolveSeedOwnerUid,
  ingestKampsparForOwner,
  fetchExistingTitlesAdmin,
  trySignInWithCustomToken,
  ensureFunctionsBuilt,
} from './lib/seedAdmin.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');
const MANIFESTS = {
  profil: resolve(root, 'docs/specs/modules/Kampspar-PROFIL-SEED.json'),
  'barn-referens': resolve(root, 'docs/specs/modules/Kampspar-BARN-REFERENS-SEED.json'),
  'kunskap-facts': resolve(root, 'docs/specs/modules/Kunskap-CONTENT-SEED.json'),
};

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

const VERIFY_PROMPTS = [
  'Vilka diagnoser har jag?',
  'Hur ska jag kommunicera med soc?',
  'Vad vet vi om Kasper i skolan?',
  'Vilken andningsmetod rekommenderas?',
  'Vad hände i februari 2026?',
];

function parseArgs(argv) {
  const args = {
    dryRun: false,
    skipExisting: false,
    category: null,
    manifest: 'profil',
    anonymous: false,
    emailAuth: false,
    verify: false,
  };
  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--skip-existing') args.skipExisting = true;
    else if (arg === '--anonymous') args.anonymous = true;
    else if (arg === '--email-auth') args.emailAuth = true;
    else if (arg === '--verify') args.verify = true;
    else if (arg.startsWith('--category=')) args.category = arg.slice('--category='.length);
    else if (arg.startsWith('--manifest=')) args.manifest = arg.slice('--manifest='.length);
  }
  return args;
}

async function runVerify(functions) {
  const query = httpsCallable(functions, 'knowledgeVaultQuery');
  let pass = 0;
  console.log('\n[seed] RAG-verifiering (5 frågor)…');
  for (const prompt of VERIFY_PROMPTS) {
    const res = await query({ prompt });
    const rag = res.data;
    const n = rag?.citations?.length ?? 0;
    const ok = n > 0 && !String(rag?.answer ?? '').includes('Inga poster');
    if (ok) pass++;
    console.log(`  Q: ${prompt}`);
    console.log(`     citations=${n} | ${(rag?.answer ?? '').slice(0, 100)}…`);
    if (n > 0) console.log(`     → ${rag.citations.map((c) => c.title).join('; ')}`);
  }
  console.log(`[seed] RAG: ${pass}/${VERIFY_PROMPTS.length} med profil-citations`);
  return pass;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveManifestPath(key) {
  const path = MANIFESTS[key];
  if (!path) {
    throw new Error(`Okänt manifest "${key}". Tillgängliga: ${Object.keys(MANIFESTS).join(', ')}`);
  }
  if (!existsSync(path)) {
    throw new Error(`Saknar manifest: ${path}`);
  }
  return path;
}

function loadManifest(key) {
  const path = resolveManifestPath(key);
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(raw.entries)) {
    throw new Error('Manifest saknar entries-array');
  }
  return raw;
}

async function fetchExistingTitles(db, uid) {
  const ref = collection(db, 'kampspar');
  const q = query(ref, where('ownerId', '==', uid));
  const snap = await getDocs(q);
  const titles = new Set();
  for (const doc of snap.docs) {
    const data = doc.data();
    if (typeof data.title === 'string') {
      titles.add(data.title);
    }
  }
  return titles;
}

/**
 * @returns {{ mode: 'admin' | 'client', uid: string, admin?: import('firebase-admin') }}
 */
async function resolveSeedAuth(auth, env, args, projectId) {
  if (args.anonymous) {
    console.log('[seed] Anonymous sign-in (--anonymous)…');
    const cred = await signInAnonymously(auth);
    return { mode: 'client', uid: cred.user.uid };
  }

  const email = env.SEED_FIREBASE_EMAIL?.trim();
  const password = env.SEED_FIREBASE_PASSWORD?.trim();
  const hasAdminTarget = Boolean(env.SEED_OWNER_UID?.trim() || email);

  if (args.emailAuth && email && password) {
    console.log('[seed] Email/password sign-in (--email-auth)…');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { mode: 'client', uid: cred.user.uid };
  }

  if (hasAdminTarget) {
    ensureFunctionsBuilt();
    console.log('[seed] Admin SDK (Google/e-post-konto — ingen lösenords-Auth)…');
    const admin = await initFirebaseAdmin(projectId);
    const uid = await resolveSeedOwnerUid(admin, env);
    if (!uid) {
      throw new Error('Kunde inte lösa uid — sätt SEED_FIREBASE_EMAIL eller SEED_OWNER_UID.');
    }
    return { mode: 'admin', uid, admin };
  }

  if (email && password) {
    console.warn('[seed] SEED_FIREBASE_PASSWORD ignoreras — använd Admin SDK via SEED_FIREBASE_EMAIL.');
    console.warn('[seed] (Legacy email/password: lägg till --email-auth om kontot har Email-provider.)');
  } else if (email || password) {
    console.warn('[seed] Ofullständig seed-konfig — behöver SEED_FIREBASE_EMAIL eller SEED_OWNER_UID.');
  } else {
    console.warn('[seed] Ingen seed-owner — anonymous uid (data syns inte i appen).');
    console.warn('[seed] Sätt SEED_FIREBASE_EMAIL i .env + gcloud auth application-default login.');
  }

  console.log('[seed] Anonymous sign-in…');
  const cred = await signInAnonymously(auth);
  return { mode: 'client', uid: cred.user.uid };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = loadEnv();
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) {
    throw new Error('VITE_FIREBASE_API_KEY och VITE_FIREBASE_PROJECT_ID krävs i .env');
  }

  const manifest = loadManifest(args.manifest);
  let entries = manifest.entries;
  const defaultSource = manifest.default_source || 'profile_seed';

  if (args.category) {
    entries = entries.filter((e) => e.category === args.category);
    console.log(`[seed] Filtrerar category=${args.category} → ${entries.length} poster`);
  }

  console.log(
    `[seed] Manifest=${args.manifest} v${manifest.version} — ${entries.length} poster (${args.dryRun ? 'DRY-RUN' : 'LIVE'})`,
  );

  if (args.dryRun) {
    for (const [i, e] of entries.entries()) {
      console.log(`  [${i + 1}/${entries.length}] ${e.category ?? '?'} | ${e.title}`);
    }
    console.log('\n[seed] DRY-RUN klar — inget skrivet.');
    process.exit(0);
  }

  const app = initializeApp({
    apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, 'europe-west1');
  const ingest = httpsCallable(functions, 'ingestKampsparEntry');

  const seedAuth = await resolveSeedAuth(auth, env, args, projectId);
  const { mode, uid } = seedAuth;
  console.log('[seed] uid:', uid, `(${mode})`);

  let existingTitles = new Set();
  if (args.skipExisting) {
    if (mode === 'admin') {
      existingTitles = await fetchExistingTitlesAdmin(seedAuth.admin, uid);
    } else {
      existingTitles = await fetchExistingTitles(db, uid);
    }
    console.log(`[seed] --skip-existing: ${existingTitles.size} befintliga titlar`);
  }

  const results = { ok: 0, skip: 0, fail: 0 };
  const docIds = [];

  for (const [i, entry] of entries.entries()) {
    const label = `[${i + 1}/${entries.length}] ${entry.title}`;

    if (args.skipExisting && existingTitles.has(entry.title)) {
      console.log(`${label} — SKIP (finns)`);
      results.skip++;
      continue;
    }

    if (!entry.title || !entry.content) {
      console.error(`${label} — FAIL (saknar title/content)`);
      results.fail++;
      continue;
    }

    try {
      const payload = {
        title: entry.title,
        content: entry.content,
        category: entry.category || undefined,
        source: entry.source || defaultSource,
      };
      if (entry.eventDate) payload.eventDate = entry.eventDate;

      let data;
      if (mode === 'admin') {
        data = await ingestKampsparForOwner(uid, payload);
      } else {
        const result = await ingest(payload);
        data = result.data;
      }
      docIds.push(data?.docId);
      console.log(`${label} — OK docId=${data?.docId} embeddingDim=${data?.embeddingDim ?? 'null'}`);
      results.ok++;
    } catch (err) {
      console.error(`${label} — FAIL:`, err.message || err);
      results.fail++;
    }

    await sleep(500);
  }

  console.log('\n[seed] Resultat:', results);
  if (docIds.length > 0) {
    console.log('[seed] Senaste docId:', docIds[docIds.length - 1]);
  }

  if (results.fail > 0) {
    process.exit(1);
  }

  if (args.verify) {
    if (mode === 'admin' && seedAuth.admin) {
      const signedIn = await trySignInWithCustomToken(auth, seedAuth.admin, uid);
      if (!signedIn) {
        console.warn('[seed] --verify hoppad — ingest klar, testa Kunskap i appen.');
      } else {
        const pass = await runVerify(functions);
        if (pass < 3) {
          console.error('[seed] RAG-verifiering under tröskel (3/5).');
          process.exit(1);
        }
      }
    } else {
      const pass = await runVerify(functions);
      if (pass < 3) {
        console.error('[seed] RAG-verifiering under tröskel (3/5).');
        process.exit(1);
      }
    }
  }

  console.log('[seed] PASS — profil-seed klar.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[seed] FAIL —', err.message || err);
  process.exit(1);
});
