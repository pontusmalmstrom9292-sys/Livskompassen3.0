/**
 * Verify: Kunskapsvalvet profil-seed — 5 RAG testfrågor
 * Usage: node scripts/verify_kampspar_profile.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

const TEST_PROMPTS = [
  'Vilka diagnoser har jag?',
  'Hur ska jag kommunicera med soc?',
  'Vad vet vi om Kasper i skolan?',
  'Vilken andningsmetod rekommenderas?',
  'Vad hände i februari 2026?',
];

function loadEnv() {
  if (!existsSync(envPath)) throw new Error('Saknar .env');
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

async function main() {
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
  const query = httpsCallable(functions, 'knowledgeVaultQuery');

  console.log('[verify] Anonymous sign-in (samma uid krävs som seed om ej email satt)…');
  const cred = await signInAnonymously(auth);
  console.log('[verify] uid:', cred.user.uid);
  console.warn('[verify] OBS: Om seed kördes med annan uid — sätt SEED_FIREBASE_EMAIL/PASSWORD och kör om seed.\n');

  const results = [];

  for (const prompt of TEST_PROMPTS) {
    console.log(`--- Q: ${prompt}`);
    try {
      const res = await query({ prompt });
      const rag = res.data;
      const citations = rag?.citations?.length ?? 0;
      const profileHits = (rag?.citations ?? []).filter(
        (c) => c.title && !String(c.title).startsWith('Smoke-test')
      ).length;
      console.log(`A (${rag?.answer?.length ?? 0} tecken, ${citations} citations, ${profileHits} profil-träffar):`);
      console.log(rag?.answer?.slice(0, 300) ?? '(tomt)');
      if (rag?.citations?.length) {
        console.log('Citations:', rag.citations.map((c) => c.title).join(' | '));
      }
      results.push({ prompt, ok: Boolean(rag?.answer), citations, profileHits });
    } catch (err) {
      console.error('FAIL:', err.message || err);
      results.push({ prompt, ok: false, citations: 0, profileHits: 0 });
    }
    console.log('');
  }

  const passed = results.filter((r) => r.ok && r.citations > 0).length;
  console.log(`[verify] ${passed}/${TEST_PROMPTS.length} frågor med svar + citations`);
  process.exit(passed >= 3 ? 0 : 1);
}

main().catch((err) => {
  console.error('[verify] FAIL —', err.message || err);
  process.exit(1);
});
