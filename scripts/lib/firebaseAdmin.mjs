/**
 * Resolves firebase-admin from functions/node_modules (not root package).
 */
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const require = createRequire(import.meta.url);

const ADMIN_PATH = resolve(root, 'functions/node_modules/firebase-admin');

export function loadFirebaseAdmin(projectId = 'gen-lang-client-0481875058') {
  if (!existsSync(ADMIN_PATH)) {
    throw new Error(
      'firebase-admin saknas — kör: cd functions && npm install',
    );
  }
  const admin = require(ADMIN_PATH);
  if (admin.apps.length === 0) {
    admin.initializeApp({ projectId });
  }
  return admin;
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
