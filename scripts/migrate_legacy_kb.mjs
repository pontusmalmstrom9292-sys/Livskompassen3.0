/**
 * FAS4 steg 4 — migrera legacy KB-poster till kampspar (Kunskap-silo).
 * Manifest: docs/specs/modules/LEGACY-KB-MIGRATION-MANIFEST.json
 *
 * Usage:
 *   node scripts/migrate_legacy_kb.mjs --inventory-only
 *   node scripts/migrate_legacy_kb.mjs --dry-run
 *   node scripts/migrate_legacy_kb.mjs
 *
 * Kräver: .env med VITE_FIREBASE_*
 * Valfritt: SEED_FIREBASE_EMAIL + SEED_FIREBASE_PASSWORD (rekommenderas — inte anonymous)
 *
 * Scope: ingestKampsparEntry → kampspar only. kb_docs skrivs via G6 Drive (notifyNewFile).
 * MUST NOT: reality_vault, children_logs, journal, dossier_snapshots.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');
const manifestPath = resolve(root, 'docs/specs/modules/LEGACY-KB-MIGRATION-MANIFEST.json');

function loadEnv() {
  if (!existsSync(envPath)) {
    throw new Error('Saknar .env i projektroten');
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

function parseArgs(argv) {
  const args = { dryRun: false, inventoryOnly: false };
  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--inventory-only') args.inventoryOnly = true;
  }
  return args;
}

function loadManifest() {
  if (!existsSync(manifestPath)) {
    throw new Error(`Saknar manifest: ${manifestPath}`);
  }
  return JSON.parse(readFileSync(manifestPath, 'utf8'));
}

async function authenticate(auth, env) {
  const email = env.SEED_FIREBASE_EMAIL;
  const password = env.SEED_FIREBASE_PASSWORD;
  if (email && password) {
    console.log('[migrate] Email sign-in…');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user.uid;
  }
  console.warn('[migrate] SEED_FIREBASE_EMAIL/PASSWORD saknas — anonymous uid.');
  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = loadManifest();

  console.log('[migrate] Legacy KB manifest v' + (manifest.version ?? '?'));
  console.log('[migrate] Inventory:', JSON.stringify(manifest.inventory ?? {}, null, 2));

  if (args.inventoryOnly) {
    console.log('[migrate] entries:', manifest.entries?.length ?? 0);
    console.log('[migrate] INVENTORY-ONLY klar.');
    process.exit(0);
  }

  const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
  console.log('[migrate] Poster att migrera:', entries.length);

  if (entries.length === 0) {
    console.log('[migrate] Inget att migrera — steg 4 redan uppfyllt (tom legacy KB).');
    process.exit(0);
  }

  if (args.dryRun) {
    for (const [i, e] of entries.entries()) {
      console.log(`  [${i + 1}] ${e.title} (${e.category ?? 'legacy'})`);
    }
    console.log('[migrate] DRY-RUN klar.');
    process.exit(0);
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
  const functions = getFunctions(app, 'europe-west1');
  const uid = await authenticate(auth, env);
  console.log('[migrate] uid:', uid);

  const ingest = httpsCallable(functions, 'ingestKampsparEntry');
  let ok = 0;
  for (const e of entries) {
    if (e.collection && e.collection !== 'kampspar') {
      console.warn('[migrate] Hoppar över — endast kampspar via ingest:', e.title);
      continue;
    }
    const title = String(e.title ?? '').trim();
    const content = String(e.content ?? '').trim();
    if (!title || !content) {
      console.warn('[migrate] Ogiltig post, hoppar över');
      continue;
    }
    const res = await ingest({
      title,
      content,
      category: e.category,
      eventDate: e.eventDate,
      source: 'legacy_kb_migration',
      tags: e.tags,
    });
    ok++;
    console.log('[migrate] OK', title.slice(0, 50), '→', res.data?.docId);
  }
  console.log(`[migrate] Klart: ${ok}/${entries.length}`);
}

main().catch((err) => {
  console.error('[migrate] FAIL:', err.message);
  process.exit(1);
});
