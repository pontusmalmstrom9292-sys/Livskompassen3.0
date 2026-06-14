import { initFirebaseAdmin, resolveSeedOwnerUid } from './lib/seedAdmin.mjs';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function loadEnv() {
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

async function run() {
  const env = loadEnv();
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const admin = await initFirebaseAdmin(projectId);
  const uid = await resolveSeedOwnerUid(admin, env);
  
  const db = admin.firestore();
  const snap = await db.collection('evolution_ledger')
                       .where('userId', '==', uid)
                       .orderBy('createdAt', 'desc')
                       .limit(1)
                       .get();
  
  if (snap.empty) {
    console.log("No ledger entries found.");
  } else {
    snap.forEach(doc => {
      console.log("Ledger entry:", doc.id, "=>", doc.data());
    });
  }
}
run().catch(console.error);
