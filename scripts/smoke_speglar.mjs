/**
 * Smoke: Speglar — speglingsMirror (prod callable).
 * Usage: node scripts/smoke_speglar.mjs
 * Requires: .env with VITE_FIREBASE_* and Anonymous Auth enabled in Console.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initSmokeAppCheck } from './lib/smoke_app_check.mjs';

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

async function main() {
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
  const functions = getFunctions(app, 'europe-west1');

  console.log('[smoke] Anonymous sign-in…');
  const cred = await signInAnonymously(auth);
  console.log('[smoke] uid:', cred.user.uid);

  const mirror = httpsCallable(functions, 'speglingsMirror');
  const reflection =
    'Jag känner mig osäker efter sms:et — som att min version av händelsen inte räknas.';
  const mood = 'Spänd';

  console.log('[smoke] speglingsMirror…');
  const result = await mirror({ reflection, mood });
  const text = result.data?.mirror;
  assert(typeof text === 'string' && text.trim().length > 0, 'saknar mirror (string)');

  const degraded =
    text ===
    `Det du beskriver — "${reflection.slice(0, 120)}${reflection.length > 120 ? '…' : ''}" — är en begriplig reaktion. Jag fixar inget här; jag speglar bara. Nästa steg är att skilja känsla från fakta (VIVIR).`;
  console.log('[smoke] mirror length:', text.length);
  console.log('[smoke] excerpt:', text.slice(0, 220));
  if (degraded) {
    console.warn('[smoke] NOTE: degraded fallback (Vertex/Gemini ej tillgänglig).');
    console.warn('[smoke] UI har samma fallback — callable svarar ändå OK.');
  } else {
    console.log('[smoke] AI mirror OK');
  }

  console.log('\n[smoke] PASS — speglingsMirror svarar.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
