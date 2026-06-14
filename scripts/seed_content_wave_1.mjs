import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initFirebaseAdmin, resolveSeedOwnerUid } from './lib/seedAdmin.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

function loadEnv() {
  if (!existsSync(envPath)) return process.env;
  const env = { ...process.env };
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  
  if (!projectId) {
    console.error("Missing VITE_FIREBASE_PROJECT_ID in .env");
    process.exit(1);
  }

  const admin = await initFirebaseAdmin(projectId);
  const uid = await resolveSeedOwnerUid(admin, env);
  
  if (!uid) {
    console.error("No UID resolved. Ensure SEED_OWNER_UID or SEED_FIREBASE_EMAIL is set in .env");
    process.exit(1);
  }

  const db = admin.firestore();
  const docRef = db.collection('kb_docs').doc();
  
  const payload = {
    ownerId: uid,
    title: "Fas 2: Från överlevnad till arkitektur",
    category: "föräldraskap",
    content: "När barnet når skolåldern skiftar vårt uppdrag. Vi går från att vara brandsläckare till att bli arkitekter. Det handlar inte längre bara om sömn och mat, utan om att bygga ställningar (scaffolding) så att barnet kan klättra själv...",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  console.log(`Writing new document to kb_docs for user ${uid}...`);
  await docRef.set(payload);
  console.log(`Successfully written new knowledge base seed document with ID: ${docRef.id}`);
  
  process.exit(0);
}

main().catch(console.error);
