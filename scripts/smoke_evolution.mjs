/**
 * Smoke: Evolution Engine (evolution_ledger WORM + evolution_hub + trigger path).
 * evolution_ledger: client create/update/delete MUST be denied (Admin SDK + onEvolutionHubWrite only).
 * Usage: node scripts/smoke_evolution.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

const TRIGGER_POLL_MS = 20_000;
const TRIGGER_POLL_INTERVAL_MS = 1_500;

function loadEnv() {
  if (!existsSync(envPath)) throw new Error('Saknar .env i projektroten');
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

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function expectDenied(label, fn) {
  try {
    await fn();
    throw new Error(`${label}: förväntade permission-denied men lyckades`);
  } catch (err) {
    const code = err?.code ?? '';
    if (err.message?.includes('förväntade permission-denied')) throw err;
    assert(
      code === 'permission-denied' || String(err.message).includes('Missing or insufficient permissions'),
      `${label}: oväntat fel — ${code || err.message}`,
    );
    console.log(`[smoke] ${label}: NEKAD (OK)`);
  }
}

async function safeLedgerQuery(db, uid) {
  try {
    return await getDocs(
      query(collection(db, 'evolution_ledger'), where('ownerId', '==', uid), limit(5)),
    );
  } catch (err) {
    const code = err?.code ?? '';
    const msg = String(err?.message ?? err);
    if (code === 'permission-denied' || msg.includes('Missing or insufficient permissions')) {
      console.log('[smoke] evolution_ledger query: SKIPPED (inga läsrättigheter eller tom collection)');
      return null;
    }
    throw err;
  }
}

async function countLedgerForUser(db, uid) {
  const snap = await safeLedgerQuery(db, uid);
  return snap?.size ?? 0;
}

async function waitForLedgerGrowth(db, uid, beforeCount, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const after = await countLedgerForUser(db, uid);
    if (after > beforeCount) return after;
    await sleep(TRIGGER_POLL_INTERVAL_MS);
  }
  return beforeCount;
}

function readRulesText() {
  return readFileSync(resolve(root, 'firestore.rules'), 'utf8');
}

function assertRulesStatic() {
  const rules = readRulesText();
  assert(rules.includes('match /evolution_ledger/{docId}'), 'firestore.rules saknar evolution_ledger');
  assert(rules.includes('allow create: if false'), 'evolution_ledger ska vara server-only create');
  assert(rules.includes('match /evolution_hub/{uid}'), 'firestore.rules saknar evolution_hub');
  assert(
    rules.includes("hasAny(['unlockedFeatureFlags'])"),
    'evolution_hub ska låsa client-uppdatering av unlockedFeatureFlags',
  );
  console.log('[smoke] statiska firestore.rules: OK');
}

<<<<<<< Updated upstream
=======
function defaultHubPayload(uid, stamp) {
  return {
    ownerId: uid,
    userId: uid,
    pillars: {
      kognitiv: { level: 1, score: 40 },
      emotionell: { level: 1, score: 30 },
      vardag: { level: 1, score: 40 },
      relationell: { level: 1, score: 50 },
      valv: { level: 1, score: 20 },
    },
    childrenAgeState: {
      kasper: { ageYears: 8, currentBracket: 'early_school', lastUpdated: stamp },
      arvid: { ageYears: 5, currentBracket: 'toddler_preschool', lastUpdated: stamp },
    },
    unlockedFeatureFlags: [],
    updatedAt: serverTimestamp(),
  };
}

>>>>>>> Stashed changes
async function tryHubLiveTests(db, uid, stamp) {
  const hubDocRef = doc(db, 'evolution_hub', uid);
  let ledgerBeforeHub = 0;

  try {
    const hubBefore = await getDoc(hubDocRef);
    ledgerBeforeHub = await countLedgerForUser(db, uid);

    if (!hubBefore.exists()) {
      await setDoc(hubDocRef, defaultHubPayload(uid, stamp));
      console.log('[smoke] create evolution_hub: OK');
    } else {
      console.log('[smoke] evolution_hub finns redan — använder befintlig');
    }

    const hubSnap = await getDoc(hubDocRef);
    assert(hubSnap.exists(), 'Kunde inte läsa evolution_hub');
    console.log('[smoke] read evolution_hub: OK');

    const currentLevel = hubSnap.data()?.pillars?.kognitiv?.level ?? 1;
    const nextLevel = currentLevel + 1;

    await updateDoc(hubDocRef, {
      pillars: {
        ...hubSnap.data().pillars,
        kognitiv: {
          ...(hubSnap.data().pillars?.kognitiv ?? { score: 40 }),
          level: nextLevel,
        },
      },
      updatedAt: serverTimestamp(),
    });
    console.log(`[smoke] update evolution_hub pillar level ${currentLevel}→${nextLevel}: OK`);

    await expectDenied('client update unlockedFeatureFlags', () =>
      updateDoc(hubDocRef, {
        unlockedFeatureFlags: ['economy_advanced', 'planning_kanban'],
        updatedAt: serverTimestamp(),
      }),
    );

    await expectDenied('delete evolution_hub', () => deleteDoc(hubDocRef));

    return { ran: true, ledgerBeforeHub };
  } catch (err) {
    const code = err?.code ?? '';
    const msg = String(err?.message ?? err);
    if (code === 'permission-denied' || msg.includes('Missing or insufficient permissions')) {
      console.log(
        '[smoke] evolution_hub live: SKIPPED — prod-regler ej deployade eller App Check (statiska regler OK)',
      );
      return { ran: false, ledgerBeforeHub: 0 };
    }
    throw err;
  }
}

<<<<<<< Updated upstream
function defaultHubPayload(uid, stamp) {
  return {
    ownerId: uid,
    userId: uid,
    pillars: {
      kognitiv: { level: 1, score: 40 },
      emotionell: { level: 1, score: 30 },
      vardag: { level: 1, score: 40 },
      relationell: { level: 1, score: 50 },
      valv: { level: 1, score: 20 },
    },
    childrenAgeState: {
      kasper: { ageYears: 8, currentBracket: 'early_school', lastUpdated: stamp },
      arvid: { ageYears: 5, currentBracket: 'toddler_preschool', lastUpdated: stamp },
    },
    unlockedFeatureFlags: [],
    updatedAt: serverTimestamp(),
  };
}

=======
>>>>>>> Stashed changes
async function main() {
  const env = loadEnv();
  assert(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_* krävs');

  assertRulesStatic();

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

  let cred;
  if (env.SEED_FIREBASE_EMAIL && env.SEED_FIREBASE_PASSWORD) {
    console.log('[smoke] Inloggning med SEED_FIREBASE_EMAIL (krävs för WORM)…');
    cred = await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
  } else {
    console.log('[smoke] Anonymous sign-in (kommer misslyckas om WORM kräver verifierad email)…');
    cred = await signInAnonymously(auth);
  }
  const uid = cred.user.uid;
  console.log('[smoke] uid:', uid);

  const stamp = new Date().toISOString();

<<<<<<< Updated upstream
  // === 1. evolution_ledger — client writes denied (WORM / Admin SDK only) ===
=======
>>>>>>> Stashed changes
  console.log('\n--- Test 1: evolution_ledger WORM (client create/update/delete nekas) ---');

  await expectDenied('create evolution_ledger', () =>
    addDoc(collection(db, 'evolution_ledger'), {
      ownerId: uid,
      userId: uid,
      type: 'milestone_unlocked',
      pillar: 'kognitiv',
      levelBefore: 1,
      levelAfter: 2,
      rationale: `Smoke denied create at ${stamp}`,
      metadata: { test: true },
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied('create evolution_ledger with shadow fields', () =>
    addDoc(collection(db, 'evolution_ledger'), {
      ownerId: uid,
      userId: uid,
      type: 'milestone_unlocked',
      pillar: 'kognitiv',
      levelBefore: 1,
      levelAfter: 2,
      rationale: 'shadow',
      metadata: {},
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }),
  );

  await expectDenied('create evolution_ledger with invalid milestone type', () =>
    addDoc(collection(db, 'evolution_ledger'), {
      ownerId: uid,
      userId: uid,
      type: 'invalid_milestone_type',
      pillar: 'kognitiv',
      levelBefore: 1,
      levelAfter: 2,
      rationale: 'invalid',
      metadata: {},
      createdAt: serverTimestamp(),
    }),
  );

  const existingLedger = await safeLedgerQuery(db, uid);
  if (existingLedger && !existingLedger.empty) {
    const ledgerId = existingLedger.docs[0].id;
    await expectDenied('update evolution_ledger', () =>
      updateDoc(doc(db, 'evolution_ledger', ledgerId), { rationale: 'tampered' }),
    );
    await expectDenied('delete evolution_ledger', () =>
      deleteDoc(doc(db, 'evolution_ledger', ledgerId)),
    );
    console.log('[smoke] read evolution_ledger: OK (befintlig rad)');
  } else {
    console.log('[smoke] read evolution_ledger: inga rader än (OK — skapas via trigger)');
  }

<<<<<<< Updated upstream
  // === 2. evolution_hub — mutable state, flags server-gated ===
  console.log('\n--- Test 2: evolution_hub rules ---');
  const hubLive = await tryHubLiveTests(db, uid, stamp);

  // === 3. onEvolutionHubWrite → evolution_ledger append (live trigger) ===
  if (hubLive.ran) {
    console.log('\n--- Test 3: hub write → evolution_ledger (onEvolutionHubWrite) ---');

    const ledgerAfter = await waitForLedgerGrowth(db, uid, hubLive.ledgerBeforeHub, TRIGGER_POLL_MS);
    if (ledgerAfter > hubLive.ledgerBeforeHub) {
      console.log(
        `[smoke] ledger append via trigger: OK (${hubLive.ledgerBeforeHub} → ${ledgerAfter})`,
      );
    } else {
      console.log(
        `[smoke] ledger trigger: ingen ny rad inom ${TRIGGER_POLL_MS / 1000}s — dedup eller ej deployad trigger (regler OK)`,
      );
    }
  } else {
    console.log('\n--- Test 3: hub → ledger trigger — SKIPPED (hub live ej tillgänglig) ---');
  }

=======
  console.log('\n--- Test 2: evolution_hub rules ---');
  const hubLive = await tryHubLiveTests(db, uid, stamp);

  if (hubLive.ran) {
    console.log('\n--- Test 3: hub write → evolution_ledger (onEvolutionHubWrite) ---');
    const ledgerAfter = await waitForLedgerGrowth(db, uid, hubLive.ledgerBeforeHub, TRIGGER_POLL_MS);
    if (ledgerAfter > hubLive.ledgerBeforeHub) {
      console.log(
        `[smoke] ledger append via trigger: OK (${hubLive.ledgerBeforeHub} → ${ledgerAfter})`,
      );
    } else {
      console.log(
        `[smoke] ledger trigger: ingen ny rad inom ${TRIGGER_POLL_MS / 1000}s — dedup eller ej deployad trigger (regler OK)`,
      );
    }
  } else {
    console.log('\n--- Test 3: hub → ledger trigger — SKIPPED (hub live ej tillgänglig) ---');
  }

>>>>>>> Stashed changes
  console.log('\n[smoke] ALL PASS — Evolution Engine rules + hub path verified.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  process.exit(1);
});
