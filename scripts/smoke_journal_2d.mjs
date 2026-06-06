#!/usr/bin/env node
/**
 * Smoke #2d — Dagbok bilaga → Storage journal_memories + journal attachment field.
 * Usage: npm run smoke:journal-2d
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

/** Minimal valid PNG (1×1). */
const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function journalMemoryStoragePath(userId, entryId, fileName) {
  const safe = fileName.replace(/[^\w.-]+/g, '_').slice(0, 80) || 'minne';
  return `users/${userId}/journal_memories/${entryId}/${safe}`;
}

async function signIn(auth) {
  console.log('[smoke:journal-2d] Anonym inloggning…');
  const { user } = await signInAnonymously(auth);
  return user;
}

async function main() {
  const env = loadEnv();
  assert(env.VITE_FIREBASE_STORAGE_BUCKET, 'Saknar VITE_FIREBASE_STORAGE_BUCKET');

  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const user = await signIn(auth);
  await user.getIdToken(true);
  const uid = user.uid;

  const entryId = doc(collection(db, 'journal')).id;
  const fileName = 'smoke-2d.png';
  const storagePath = journalMemoryStoragePath(uid, entryId, fileName);

  console.log('[smoke:journal-2d] Upload → journal_memories…');
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, TINY_PNG, { contentType: 'image/png' });
  const url = await getDownloadURL(storageRef);
  assert(url.startsWith('http'), 'download URL saknas');

  const attachment = {
    url,
    storagePath,
    name: fileName,
    mimeType: 'image/png',
    size: TINY_PNG.length,
  };

  console.log('[smoke:journal-2d] Spara journal med attachment…');
  await setDoc(doc(db, 'journal', entryId), {
    userId: uid,
    ownerId: uid,
    mood: 'neutral',
    text: 'Smoke #2d — bilaga test',
    category: 'reflektion',
    attachment,
    createdAt: serverTimestamp(),
  });

  const saved = await getDoc(doc(db, 'journal', entryId));
  assert(saved.exists(), 'journal-post saknas');
  const data = saved.data();
  assert(data.attachment?.storagePath === storagePath, 'attachment.storagePath fel');
  assert(data.attachment?.mimeType === 'image/png', 'attachment.mimeType fel');

  console.log('[smoke:journal-2d] PASS — bilaga + journal OK —', entryId);
  process.exit(0);
}

main().catch((err) => {
  console.error('[smoke:journal-2d] FAIL —', err.message ?? err);
  process.exit(1);
});
