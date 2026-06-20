/**
 * Smoke: Måbra — mabra_sessions WORM + mabraCoach callable.
 * Usage: npm run smoke:mabra
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log('[smoke] MB-PLAY-54321 wizard wiring…');
  const hubRegistry = readFileSync(resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/mabraHubRegistry.ts'), 'utf8');
  const microPlay = readFileSync(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/components/tools/MabraMicroPlayTool.tsx'),
    'utf8',
  );
  const playBank = readFileSync(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/content/grounding54321Play.ts'),
    'utf8',
  );
  assert(hubRegistry.includes("playBankId: 'MB-PLAY-54321'"), 'hub registry saknar play-54321-wizard');
  assert(microPlay.includes('MabraGrounding54321Wizard'), 'micro_play saknar 54321 wizard route');
  assert(playBank.includes('sense: \'Höra\'') && playBank.includes('count: 4'), '54321 bank stegordning fel (4=höra)');
  assert(playBank.includes('sense: \'Känna\'') && playBank.includes('count: 3'), '54321 bank stegordning fel (3=känna)');
  console.log('[smoke] MB-PLAY-54321 wiring OK');

  const agentsSrc = readFileSync(resolve(root, 'functions/src/callables/agents.ts'), 'utf8');
  const bankSrc = readFileSync(resolve(root, 'functions/src/lib/mabraContentBank.ts'), 'utf8');
  assert(agentsSrc.includes("mode === 'bank_parafras'"), 'agents saknar bank_parafras');
  assert(agentsSrc.includes('parafraseCoachFromBank'), 'agents saknar parafraseCoachFromBank');
  assert(agentsSrc.includes("parafrasTier === 'deterministic'"), 'agents saknar parafrasTier');
  assert(bankSrc.includes('resolveBankParafrasBankId'), 'mabraContentBank saknar resolveBankParafrasBankId');
  assert(
    readFileSync(resolve(root, 'functions/src/lib/mabraCapacityParafras.ts'), 'utf8').includes(
      'parafraseCoachFromBankWithCapacity',
    ),
    'mabraCapacityParafras saknar parafraseCoachFromBankWithCapacity',
  );
  assert(
    readFileSync(resolve(root, 'functions/src/lib/mabraCapacityParafras.ts'), 'utf8').includes(
      'coachTone: CoachTone',
    ),
    'mabraCapacityParafras saknar coachTone (L3a)',
  );
  assert(
    agentsSrc.includes('resolveCoachToneForUser'),
    'agents saknar resolveCoachToneForUser (L3a)',
  );
  assert(agentsSrc.includes('fetchUserCapacityScore'), 'agents saknar fetchUserCapacityScore');
  assert(agentsSrc.includes('capacityBand'), 'agents saknar capacityBand');
  console.log('[smoke] P4 bank_parafras + capacity static guards OK');

  const nutritionService = readFileSync(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/api/mabraNutritionLogService.ts'),
    'utf8',
  );
  const rulesSrc = readFileSync(resolve(root, 'firestore.rules'), 'utf8');
  assert(nutritionService.includes('mabra_nutrition_log'), 'nutrition service saknar collection');
  assert(rulesSrc.includes('match /mabra_nutrition_log/{uid}/days/{dateKey}'), 'rules saknar mabra_nutrition_log');

  const quickLog = readFileSync(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/components/MabraNutritionQuickLog.tsx'),
    'utf8',
  );
  const nudges = readFileSync(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/lib/mabraNutritionNudges.ts'),
    'utf8',
  );
  const nutritionSpec = readFileSync(
    resolve(root, 'docs/specs/modules/NARING-INTAG-SPEC.md'),
    'utf8',
  );
  assert(quickLog.includes('MabraNutritionQuickLog'), 'quick log komponent saknas');
  assert(quickLog.includes('appendNutritionEntry'), 'quick log saknar append');
  assert(nudges.includes('computeNutritionNudges'), 'nudges saknar compute');
  assert(nutritionSpec.includes('LÅST UX'), 'NARING-INTAG-SPEC saknar lås');
  const rhythm = readFileSync(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/lib/mabraNutritionRhythmAnalysis.ts'),
    'utf8',
  );
  assert(rhythm.includes('computeNutritionRhythmInsights'), 'rhythm analysis saknas');
  const macroTotals = readFileSync(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/lib/mabraNutritionMacroTotals.ts'),
    'utf8',
  );
  const macroPanel = readFileSync(
    resolve(root, 'src/modules/features/dailyLife/wellbeing/mabra/components/MabraNutritionMacroPanel.tsx'),
    'utf8',
  );
  assert(macroTotals.includes('computeDailyMacroTotals'), 'macro totals saknas');
  assert(macroPanel.includes('MabraNutritionMacroPanel'), 'macro panel saknas');
  assert(quickLog.includes('macroTracking'), 'quick log saknar macroTracking prop');
  console.log('[smoke] N2 makron P/F/K static guards OK');
  console.log('[smoke] M3.0-C+ diskret näringsintag static guards OK');
  console.log('[smoke] M3.0-C Phase 2 nutrition static guards OK');

  const env = loadEnv();
  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  const debugToken = env.VITE_APP_CHECK_DEBUG_TOKEN;
  const appId = env.VITE_FIREBASE_APP_ID;
  const projectNumber = env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  if (debugToken && appId && projectNumber) {
    const apiKey = env.VITE_FIREBASE_API_KEY;
    const exchangeUrl = `https://firebaseappcheck.googleapis.com/v1/projects/${projectNumber}/apps/${appId}:exchangeDebugToken?key=${encodeURIComponent(apiKey)}`;
    initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: async () => {
          const res = await fetch(exchangeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Firebase-AppCheck': debugToken },
            body: JSON.stringify({ debugToken, limitedUse: false }),
          });
          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`App Check exchangeDebugToken ${res.status}: ${errText}`);
          }
          const data = await res.json();
          return {
            token: data.token,
            expireTimeMillis: data.ttl
              ? Date.now() + Number.parseInt(String(data.ttl).replace('s', ''), 10) * 1000
              : Date.now() + 3_600_000,
          };
        },
      }),
      isTokenAutoRefreshEnabled: true,
    });
    console.log('[smoke] App Check (debug token) initierad');
  }

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, 'europe-west1');

  let user;
  if (env.SEED_FIREBASE_EMAIL && env.SEED_FIREBASE_PASSWORD) {
    console.log('[smoke] Email sign-in (krävs för vit_hub WORM)…');
    const cred = await signInWithEmailAndPassword(auth, env.SEED_FIREBASE_EMAIL, env.SEED_FIREBASE_PASSWORD);
    await cred.user.getIdToken(true);
    user = cred.user;
  } else {
    console.log('[smoke] Anonymous sign-in…');
    const cred = await signInAnonymously(auth);
    await cred.user.getIdToken(true);
    user = cred.user;
  }
  const uid = user.uid;

  console.log('[smoke] mabra_sessions WORM create…');
  const sessionRef = await addDoc(collection(db, 'mabra_sessions'), {
    userId: uid,
    ownerId: uid,
    exerciseType: 'breathing',
    hubSymptom: 'panic_rsd',
    durationSeconds: 60,
    createdAt: serverTimestamp(),
  });
  assert(sessionRef.id, 'mabra_sessions saknar id');
  console.log('[smoke] session OK —', sessionRef.id);

  console.log('[smoke] mabra_sessions movement_micro WORM create…');
  const movementRef = await addDoc(collection(db, 'mabra_sessions'), {
    userId: uid,
    ownerId: uid,
    exerciseType: 'movement_micro',
    durationSeconds: 120,
    playBankId: 'MB-PLAY-03',
    createdAt: serverTimestamp(),
  });
  assert(movementRef.id, 'movement_micro session saknar id');
  console.log('[smoke] movement_micro OK —', movementRef.id);

  const coachFn = httpsCallable(functions, 'mabraCoach');

  console.log('[smoke] mabraCoach guardrail (ex-text)…');
  const guardResult = await coachFn({
    hubSymptom: 'panic_rsd',
    exerciseType: 'breathing',
    optionalNote: 'Fick sms från ex om vårdnad och konflikt',
  });
  assert(guardResult.data?.redirectToSpeglar === true, 'guardrail ska sätta redirectToSpeglar');
  console.log('[smoke] guardrail OK');

  console.log('[smoke] mabraCoach…');
  const result = await coachFn({
    hubSymptom: 'panic_rsd',
    exerciseType: 'breathing',
  });
  const coach = result.data?.coach;
  assert(typeof coach === 'string' && coach.trim().length > 0, 'saknar coach (string)');
  assert(result.data?.bankId === 'MB-REF-03', `coach bankId ska vara MB-REF-03, fick ${result.data?.bankId}`);
  console.log('[smoke] coach bankId OK —', result.data.bankId);
  console.log('[smoke] coach excerpt:', coach.slice(0, 180));

  console.log('[smoke] mabraCoach bank_parafras (P4)…');
  const parafrasResult = await coachFn({
    mode: 'bank_parafras',
    bankId: 'MB-REF-03',
  });
  assert(parafrasResult.data?.bankId === 'MB-REF-03', 'bank_parafras bankId fel');
  assert(
    typeof parafrasResult.data?.coach === 'string' && parafrasResult.data.coach.trim().length > 0,
    'bank_parafras saknar coach',
  );
  assert(parafrasResult.data?.redirectToSpeglar !== true, 'bank_parafras ska inte redirecta neutral');
  console.log('[smoke] bank_parafras OK —', parafrasResult.data.coach.slice(0, 100));

  console.log('[smoke] mabraCoach bank_parafras guard…');
  const parafrasGuard = await coachFn({
    mode: 'bank_parafras',
    bankId: 'MB-REF-03',
    optionalNote: 'Fick sms från ex om vårdnad och konflikt',
  });
  assert(parafrasGuard.data?.redirectToSpeglar === true, 'bank_parafras guard ska redirecta');
  console.log('[smoke] bank_parafras guard OK');

  console.log('[smoke] mabraCoach transformator…');
  const transformResult = await coachFn({
    mode: 'transformator',
    thought: 'Jag är värdelös och kommer aldrig klara föräldraskapet.',
  });
  const transform = transformResult.data?.transform;
  assert(transform?.distortion && transform.clinicalFact && transform.compassionateRewrite, 'saknar 3-korts transform');
  assert(transformResult.data?.redirectToSpeglar !== true, 'transformator ska inte redirecta neutral tanke');
  console.log('[smoke] transformator OK —', transform.compassionateRewrite.slice(0, 80));

  console.log('[smoke] vit_hub ensure…');
  await setDoc(
    doc(db, 'vit_hub', uid),
    {
      userId: uid,
      ownerId: uid,
      activeProjectIds: ['self_esteem'],
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  console.log('[smoke] vit_hub OK');

  console.log('[smoke] vit_entries WORM create…');
  const vitEntryRef = await addDoc(collection(db, 'vit_entries'), {
    userId: uid,
    ownerId: uid,
    projectId: 'self_esteem',
    kind: 'card',
    bankId: 'C-se-01',
    content_class: 'REFLECTION',
    responseText: 'smoke vit entry',
    cardDateKey: '2026-06-06',
    createdAt: serverTimestamp(),
  });
  assert(vitEntryRef.id, 'vit_entries saknar id');
  console.log('[smoke] vit_entries OK —', vitEntryRef.id);

  console.log('[smoke] mabraCoach vit_chat…');
  const vitChatResult = await coachFn({
    mode: 'vit_chat',
    projectId: 'learn_together',
    vitMessage: 'Jag vill utforska vad som känns meningsfullt idag utan prestation.',
    seedPrompt: 'Ett värde som är viktigt idag — ett ord.',
  });
  const vitCoach = vitChatResult.data?.coach;
  assert(typeof vitCoach === 'string' && vitCoach.trim().length > 0, 'vit_chat saknar coach');
  assert(vitChatResult.data?.redirectToSpeglar !== true, 'vit_chat ska inte redirecta neutral input');
  assert(
    vitChatResult.data?.bankId === 'MB-REF-ACT-01',
    `vit_chat bankId ska vara MB-REF-ACT-01, fick ${vitChatResult.data?.bankId}`,
  );
  console.log('[smoke] vit_chat bankId OK —', vitChatResult.data.bankId);
  console.log('[smoke] vit_chat OK —', vitCoach.slice(0, 100));

  console.log('[smoke] mabraCoach vit_chat who_am_i (JOY-17)…');
  const whoAmIResult = await coachFn({
    mode: 'vit_chat',
    projectId: 'who_am_i',
    vitMessage: 'Jag vill utforska vad som känns meningsfullt för mig utan prestation.',
    seedPrompt: 'Ett intresse eller tema som känns mitt — inte någons förväntan. Ett ord räcker.',
    bankId: 'MB-REF-JOY-01',
  });
  assert(typeof whoAmIResult.data?.coach === 'string' && whoAmIResult.data.coach.trim().length > 0, 'who_am_i vit_chat saknar coach');
  assert(whoAmIResult.data?.bankId === 'MB-REF-JOY-01', `who_am_i bankId ska vara MB-REF-JOY-01, fick ${whoAmIResult.data?.bankId}`);
  console.log('[smoke] who_am_i vit_chat OK —', whoAmIResult.data.bankId);

  console.log('[smoke] vit_entries who_am_i WORM create…');
  const whoAmIEntryRef = await addDoc(collection(db, 'vit_entries'), {
    userId: uid,
    ownerId: uid,
    projectId: 'who_am_i',
    kind: 'card',
    bankId: 'MB-REF-JOY-01',
    content_class: 'REFLECTION',
    responseText: 'smoke who_am_i joy entry',
    cardDateKey: '2026-06-15',
    createdAt: serverTimestamp(),
  });
  assert(whoAmIEntryRef.id, 'who_am_i vit_entries saknar id');
  console.log('[smoke] who_am_i vit_entries OK —', whoAmIEntryRef.id);

  console.log('[smoke] mabraCoach vit_chat guard…');
  const vitGuardResult = await coachFn({
    mode: 'vit_chat',
    projectId: 'learn_together',
    vitMessage: 'Hon skrev ett sms och jag undrar om det är gaslighting.',
  });
  assert(vitGuardResult.data?.redirectToSpeglar === true, 'vit_chat ska redirecta ex/gaslighting');
  console.log('[smoke] vit_chat guard OK');

  console.log('\n[smoke] PASS — Måbra backend.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[smoke] FAIL —', err.message || err);
  if (err.code) console.error('[smoke] code:', err.code);
  if (err.details) console.error('[smoke] details:', err.details);
  process.exit(1);
});
