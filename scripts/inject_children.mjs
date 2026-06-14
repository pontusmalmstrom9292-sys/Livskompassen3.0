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
  const hubRef = db.collection('evolution_hub').doc(uid);
  
  await hubRef.set({
    childrenAgeState: {
      kasper: { birthDate: "2018-08-19", currentBracket: "toddler_preschool", barnportenLevel: 1 },
      arvid: { birthDate: "2021-06-02", currentBracket: "toddler_preschool", barnportenLevel: 1 }
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  console.log("Injected Arvid & Kasper into evolution_hub");
}
run().catch(console.error);
