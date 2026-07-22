/**
 * Resolves firebase-admin from functions/node_modules (not root package).
 * firebase-admin v14+ is modular — package root no longer has `.apps` / `.auth()`.
 * This module exposes a small namespaced facade so smoke/seed scripts keep working.
 */
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const functionsPkg = resolve(root, 'functions/package.json');
const ADMIN_PATH = resolve(root, 'functions/node_modules/firebase-admin');

/** Require as if we were inside functions/ so subpath exports resolve. */
const requireFromFunctions = createRequire(functionsPkg);

function assertAdminInstalled() {
  if (!existsSync(ADMIN_PATH) || !existsSync(functionsPkg)) {
    throw new Error('firebase-admin saknas — kör: cd functions && npm install');
  }
}

/**
 * @param {string} [projectId]
 * @returns {{
 *   auth: () => import('firebase-admin/auth').Auth,
 *   firestore: () => import('firebase-admin/firestore').Firestore,
 *   storage: () => import('firebase-admin/storage').Storage,
 *   app: import('firebase-admin/app').App,
 * }}
 */
export function loadFirebaseAdmin(projectId = 'gen-lang-client-0481875058') {
  assertAdminInstalled();
  const { initializeApp, getApps, getApp } = requireFromFunctions('firebase-admin/app');
  const { getAuth } = requireFromFunctions('firebase-admin/auth');
  const { getFirestore, FieldValue, Timestamp } = requireFromFunctions('firebase-admin/firestore');
  const { getStorage } = requireFromFunctions('firebase-admin/storage');

  const app = getApps().length > 0 ? getApp() : initializeApp({ projectId });

  /** Namespaced-compat: `admin.firestore.FieldValue` (modular v14+ has no default export). */
  const firestore = Object.assign(() => getFirestore(app), { FieldValue, Timestamp });

  return {
    app,
    auth: () => getAuth(app),
    firestore,
    storage: () => getStorage(app),
  };
}

/** Seed vaultUnlocked custom claims for client WORM smokes (rules require isVaultUnlocked). */
export async function seedSmokeVaultClaims(uid, projectId = 'gen-lang-client-0481875058') {
  const admin = loadFirebaseAdmin(projectId);
  const userRecord = await admin.auth().getUser(uid);
  const currentClaims = userRecord.customClaims || {};
  const expiresAt = Date.now() + 60 * 60 * 1000;
  await admin.auth().setCustomUserClaims(uid, {
    ...currentClaims,
    vaultUnlocked: true,
    vaultExpiresAt: expiresAt,
  });
  return expiresAt;
}
