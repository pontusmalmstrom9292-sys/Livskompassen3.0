import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

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
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('VITE_FIREBASE_PROJECT_ID saknas i .env');

  console.log(`[setup] Initierar Admin SDK för projekt: ${projectId}…`);
  admin.initializeApp({ projectId });

  const email = 'smoke-test@livskompassen.se';
  const password = 'SmokeTestUser123!';

  try {
    const existing = await admin.auth().getUserByEmail(email);
    console.log(`[setup] Användare ${email} finns redan (uid: ${existing.uid}). Updaterar lösenord och emailVerified...`);
    await admin.auth().updateUser(existing.uid, {
      password,
      emailVerified: true,
    });
    console.log(`[setup] Användare uppdaterad.`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.log(`[setup] Skapar ny användare ${email}…`);
      const user = await admin.auth().createUser({
        email,
        password,
        emailVerified: true,
        displayName: 'Smoke Test User',
      });
      console.log(`[setup] Skapad uid: ${user.uid}`);
    } else {
      throw err;
    }
  }

  console.log('\n======================================================');
  console.log('Testanvändare redo! För att fixa smoke-testerna, lägg till detta i din .env:');
  console.log(`SEED_FIREBASE_EMAIL=${email}`);
  console.log(`SEED_FIREBASE_PASSWORD=${password}`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('[setup] Fel:', err);
  process.exit(1);
});
