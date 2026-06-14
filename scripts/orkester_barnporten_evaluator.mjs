/**
 * Orkester: Barnporten Evaluator
 * Utvärderar WORM-historik i children_logs och låser upp nästa nivå i evolution_hub.
 * 
 * Usage:
 *   node scripts/orkester_barnporten_evaluator.mjs
 *   node scripts/orkester_barnporten_evaluator.mjs --child=arvid
 *   node scripts/orkester_barnporten_evaluator.mjs --uid=some-uid --child=kasper
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initFirebaseAdmin, resolveSeedOwnerUid } from './lib/seedAdmin.mjs';

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

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    child: 'kasper',
    uid: null,
  };
  for (const arg of args) {
    if (arg.startsWith('--child=')) {
      params.child = arg.split('=')[1].trim().toLowerCase();
    }
    if (arg.startsWith('--uid=')) {
      params.uid = arg.split('=')[1].trim();
    }
  }
  return params;
}

async function evaluateBiologicalAges(uid, admin) {
  const db = admin.firestore();
  console.log(`\n[Orkester] Startar biologisk åldersutvärdering för uid: ${uid}`);

  const hubRef = db.collection('evolution_hub').doc(uid);
  const hubSnap = await hubRef.get();
  
  if (!hubSnap.exists) {
    console.log(`[Orkester] Ingen evolution_hub hittades för användaren.`);
    return false;
  }
  
  const hubData = hubSnap.data();
  const childrenAgeState = hubData.childrenAgeState || {};
  const childKeys = Object.keys(childrenAgeState);
  
  if (childKeys.length === 0) {
    console.log(`[Orkester] Inga barn hittades i childrenAgeState.`);
    return false;
  }

  let highestLevel = 1;
  const updatedChildrenState = {};
  const currentDate = new Date();

  console.log(`\n[Orkester] --- Utvärderar biologisk ålder ---`);

  for (const childAlias of childKeys) {
    const childData = childrenAgeState[childAlias];
    const birthDateStr = childData.birthDate;
    
    if (!birthDateStr) {
      console.log(`[Orkester] Barn ${childAlias} saknar birthDate, hoppar över.`);
      updatedChildrenState[childAlias] = childData;
      continue;
    }

    const birthDate = new Date(birthDateStr);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    let bracket = 'toddler_preschool';
    let level = 1;

    if (age >= 13) {
      bracket = 'teen';
      level = 4;
    } else if (age >= 10) {
      bracket = 'pre_teen';
      level = 3;
    } else if (age >= 6) {
      bracket = 'early_school';
      level = 2;
    } else {
      bracket = 'toddler_preschool';
      level = 1;
    }

    console.log(`[Orkester] ${childAlias}: Född ${birthDateStr}, Ålder ${age} år -> Bracket: ${bracket}, Nivå: ${level}`);

    updatedChildrenState[childAlias] = {
      ...childData,
      ageYears: age,
      currentBracket: bracket,
      barnportenLevel: level,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };

    if (level > highestLevel) {
      highestLevel = level;
    }
  }

  console.log(`\n[Orkester] Högsta barnportenLevel bland alla barn är: ${highestLevel}`);

  const batch = db.batch();
  
  const unlockedPacks = Array.isArray(hubData.unlockedPacks) ? [...hubData.unlockedPacks] : [];
  if (highestLevel >= 2 && !unlockedPacks.includes('foralder_trygg')) {
    unlockedPacks.push('foralder_trygg');
    console.log(`[Orkester] Högsta nivå >= 2, lägger till pack 'foralder_trygg'`);
  }

  const hubUpdatePayload = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    childrenAgeState: updatedChildrenState,
    barnportenLevel: highestLevel,
    unlockedPacks: unlockedPacks,
  };

  const ledgerRef = db.collection('evolution_ledger').doc();
  batch.set(ledgerRef, {
    userId: uid,
    ownerId: uid,
    target: 'barnporten',
    targetId: 'all_children',
    event: 'AGE_EVALUATION',
    newLevel: highestLevel,
    unlockedBy: 'BIOLOGICAL_AGE',
    rationale: `Utvärderade biologisk ålder för barn och satte global barnportenLevel till ${highestLevel}.`,
    metadata: {
      childrenState: updatedChildrenState
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.set(hubRef, hubUpdatePayload, { merge: true });

  await batch.commit();
  console.log(`[Orkester] BATCH SKRIVNING LYCKADES! Evolution hub uppdaterad med biologiska åldrar.`);
  return true;
}

async function main() {
  const env = loadEnv();
  const args = parseArgs();

  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('VITE_FIREBASE_PROJECT_ID saknas i .env');
  }

  const admin = await initFirebaseAdmin(projectId);
  const uid = args.uid || await resolveSeedOwnerUid(admin, env);

  if (!uid) {
    throw new Error('Kunde inte identifiera användarens UID. Sätt SEED_OWNER_UID eller SEED_FIREBASE_EMAIL i .env');
  }

  const result = await evaluateBiologicalAges(uid, admin);
  console.log(`\n[Orkester] Utvärdering klar. Framgång: ${result}`);
  process.exit(0);
}

main().catch(err => {
  console.error('\n[Orkester] FEL i utvärderingsskript:', err.message || err);
  process.exit(1);
});
