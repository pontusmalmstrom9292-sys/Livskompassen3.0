/**
 * Admin-baserad seed för kampspar — samma kodväg som ingestKampsparEntry (ingestKampsparForUser).
 * Kräver: gcloud auth application-default login ELLER GOOGLE_APPLICATION_CREDENTIALS
 * Target: SEED_FIREBASE_EMAIL (Google/e-post) eller SEED_OWNER_UID
 */
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const require = createRequire(import.meta.url);

const INGEST_MODULE_CANDIDATES = [
  resolve(root, 'functions/lib/lib/ingestKampsparInternal.js'),
  resolve(root, 'functions/lib/functions/src/lib/ingestKampsparInternal.js'),
];

function resolveIngestModule() {
  for (const candidate of INGEST_MODULE_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export function ensureFunctionsBuilt() {
  if (!resolveIngestModule()) {
    throw new Error(
      'functions/lib saknas — kör först: cd functions && npm run build',
    );
  }
}

export async function initFirebaseAdmin(projectId) {
  const { loadFirebaseAdmin } = await import('./firebaseAdmin.mjs');
  return loadFirebaseAdmin(projectId);
}

export async function resolveSeedOwnerUid(admin, env) {
  const explicit = env.SEED_OWNER_UID?.trim();
  if (explicit) {
    console.log('[seed] SEED_OWNER_UID:', explicit);
    return explicit;
  }

  const email = env.SEED_FIREBASE_EMAIL?.trim();
  if (!email) {
    return null;
  }

  console.log('[seed] Admin lookup:', email);
  const user = await admin.auth().getUserByEmail(email);
  const providers = user.providerData.map((p) => p.providerId).join(', ') || 'none';
  console.log('[seed] Resolved uid:', user.uid, `(${providers})`);
  return user.uid;
}

export function ensureGcpProjectEnv(projectId) {
  if (!process.env.GCP_PROJECT_ID && !process.env.GOOGLE_CLOUD_PROJECT) {
    process.env.GOOGLE_CLOUD_PROJECT = projectId;
  }
}

export async function ingestKampsparForOwner(uid, payload) {
  ensureFunctionsBuilt();
  ensureGcpProjectEnv(process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID);
  const ingestModule = resolveIngestModule();
  if (!ingestModule) {
    throw new Error('functions/lib saknas — kör först: cd functions && npm run build');
  }
  const { ingestKampsparForUser } = require(ingestModule);
  return ingestKampsparForUser(uid, payload);
}

export async function fetchExistingTitlesAdmin(admin, uid) {
  const snap = await admin
    .firestore()
    .collection('kampspar')
    .where('ownerId', '==', uid)
    .get();
  const titles = new Set();
  for (const doc of snap.docs) {
    const title = doc.data()?.title;
    if (typeof title === 'string') {
      titles.add(title);
    }
  }
  return titles;
}

/** Valfri client-sign-in för RAG-verify (--verify). Kräver ofta service account JSON. */
export async function trySignInWithCustomToken(auth, admin, uid) {
  try {
    const token = await admin.auth().createCustomToken(uid);
    const { signInWithCustomToken } = await import('firebase/auth');
    await signInWithCustomToken(auth, token);
    return true;
  } catch (err) {
    console.warn(
      '[seed] Custom token misslyckades — RAG --verify hoppas över.',
      err.message || err,
    );
    console.warn(
      '[seed] Sätt GOOGLE_APPLICATION_CREDENTIALS till Firebase service account JSON för verify.',
    );
    return false;
  }
}
