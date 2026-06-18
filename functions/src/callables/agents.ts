import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
// firebase-functions v1 behålls enbart för schedulers och onRequest (notifyNewFile, scheduledRetentionJob,
// scheduledGeneratePayslip) — dessa är ej callables och v2-scheduler-API skiljer sig åt.
import * as functions from 'firebase-functions';
import {
  askMabraCoach,
  askVitChatCoach,
  askKbtTransformator,
  askSpeglingsCoach,
  askDagbokSnabbCoach,
  askUppgiftsKrossaren,
} from '../agents/vertexAgent';
import { weaveJournalEntry as runWeaver } from '../agents/weaverAgent';
import { approveWeaverPending, rejectWeaverPending } from '../lib/weaverPending';
import { adkOrchestrator, listAgentCards } from '../adk';
import type { MicroStep } from '../adk/types';
import { emitSynapse } from '../adk/synapses/synapseBus';
import {
  generatePayslipInternal,
  generatePayslipsForAllProfiles,
} from '../economy/generatePayslipInternal';
import {
  MABRA_SPEGLAR_REDIRECT_MESSAGE,
  shouldRedirectMabraCoachToSpeglar,
} from '../lib/mabraCoachGuard';
import { analyzeWidgetRecording } from '../lib/widgetRecordingAnalyze';
import { revokeVaultSession } from '../lib/vaultSessionGate';
import {
  claimBarnportenPairingForUser,
  createBarnportenPairingForUser,
} from '../lib/barnportenPairing';
import { assertVaultSession } from '../lib/vaultSessionGate';
import { supervisor, trimSpeglingsMirror } from './shared';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import {
  fetchUserCapacityScore,
  parafraseCoachFromBankWithCapacity,
  toCapacityBand,
} from '../lib/mabraCapacityParafras';
import {
  getMabraCoachBankEntry,
  parafraseGoalAssist,
  parafraseRsdErrorFromBank,
  resolveBankParafrasBankId,
  resolveCoachBankId,
  resolveGoalAssistBankId,
  resolveRsdErrorBankId,
  resolveVitChatBankId,
  type MabraCoachExercise,
  type MabraCoachHub,
} from '../lib/mabraContentBank';

function invalidBankIdError(message: string): HttpsError {
  return new HttpsError('invalid-argument', message);
}

export const analyzeMessage = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'analyzeMessage', 30);

    const message = request.data.message;
    const ragContext: string[] = request.data.ragContext ?? [];

    if (!message || typeof message !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "message" (string) krävs.');
    }

    if (message.length > 5000) {
      throw new HttpsError('invalid-argument', 'Meddelandet får vara max 5000 tecken.');
    }

    const preferGransArkitekten =
      request.data.module === 'safe_harbor' || request.data.preferGransArkitekten === true;

    try {
      const result = await supervisor.handleUserRequest(message, uid, ragContext, {
        preferGransArkitekten,
      });
      console.log(
        `[analyzeMessage] agent=${result.agentId} DCAP riskScore=${result.dcap?.riskScore} för uid=${uid}`
      );
      return result;
    } catch (error) {
      console.error('[analyzeMessage] Fel:', error);
      throw new HttpsError('internal', 'Analys misslyckades. Försök igen.');
    }
  }
);

/** Zero Footprint: rensa JWT vault-claims så cachad ID-token inte läser reality_vault efter logout/idle. */
async function clearVaultJwtClaims(uid: string): Promise<void> {
  const userRecord = await admin.auth().getUser(uid);
  const currentClaims = userRecord.customClaims ?? {};
  await admin.auth().setCustomUserClaims(uid, {
    ...currentClaims,
    vaultUnlocked: false,
    vaultExpiresAt: 0,
  });
}

export const invalidateSession = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'invalidateSession', 30);

    await supervisor.invalidateUserSession(uid);
    await revokeVaultSession(uid);
    await clearVaultJwtClaims(uid);
    adkOrchestrator.clearContext(uid);
    console.log(`[invalidateSession] Session + vault JWT + ADK context rensad för uid=${uid}`);
    return { success: true };
  }
);

export const scheduledRetentionJob = functions
  .region('europe-west1')
  .pubsub.schedule('0 3 * * *')
  .timeZone('Europe/Stockholm')
  .onRun(async (_context) => {
    console.log('[scheduledRetentionJob] Startar GDPR-rensning...');
    const { default: runRetention } = await import('../jobs/retentionJob');
    if (typeof runRetention === 'function') {
      await runRetention();
    }
    console.log('[scheduledRetentionJob] Klar.');
  });

export const notifyNewFile = functions
  .region('europe-west1')
  .runWith({
    secrets: ['NOTIFY_WEBHOOK_SECRET'],
    timeoutSeconds: 300,
    memory: '512MB',
  })
  .https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const isProduction = process.env.FUNCTIONS_EMULATOR !== 'true';
    const webhookSecret = process.env.NOTIFY_WEBHOOK_SECRET;

    if (isProduction && !webhookSecret) {
      console.error('[notifyNewFile] NOTIFY_WEBHOOK_SECRET saknas — endpoint stängd (fail-closed)');
      res.status(503).send('Service Unavailable');
      return;
    }

    if (webhookSecret) {
      const provided = req.get('X-Livskompassen-Webhook-Secret');
      if (provided !== webhookSecret) {
        res.status(401).send('Unauthorized');
        return;
      }
    }

    const { fileId, fileName, mimeType } = req.body;
    const ownerId =
      typeof req.body.ownerId === 'string' && req.body.ownerId.trim()
        ? req.body.ownerId.trim()
        : typeof req.body.ownerUid === 'string' && req.body.ownerUid.trim()
          ? req.body.ownerUid.trim()
          : undefined;
    const optInTrauma = req.body.optInTrauma === true;

    if (!fileId || !fileName || !mimeType) {
      res.status(400).send('Missing fileId, fileName or mimeType');
      return;
    }

    try {
      await emitSynapse(adkOrchestrator, {
        trigger: 'drive_file_ingested',
        payload: { fileId, fileName, mimeType, ownerId, optInTrauma },
      });

      res.status(200).send({ status: 'Processing complete', fileId });
    } catch (error) {
      console.error(`[notifyNewFile] Pipeline fel fileId=${fileId} fileName=${fileName}:`, error);
      res.status(500).send('Pipeline failed');
    }
  });

export const weaveJournalEntry = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'weaveJournalEntry', 15);
    await assertVaultSession(uid, request.data);

    const { journalEntryId, mood, text } = request.data;
    if (!journalEntryId || !mood || !text) {
      throw new HttpsError('invalid-argument', 'journalEntryId, mood och text krävs.');
    }

    return runWeaver(uid, journalEntryId, mood, text);
  }
);

export const approveWeaverMetadata = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'approveWeaverMetadata', 20);
    await assertVaultSession(uid, request.data);
    const pendingId = typeof request.data?.pendingId === 'string' ? request.data.pendingId.trim() : '';
    if (!pendingId) {
      throw new HttpsError('invalid-argument', 'pendingId krävs.');
    }
    try {
      return await approveWeaverPending(uid, pendingId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Godkännande misslyckades.';
      throw new HttpsError('failed-precondition', msg);
    }
  }
);

export const rejectWeaverMetadata = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'rejectWeaverMetadata', 20);
    await assertVaultSession(uid, request.data);
    const pendingId = typeof request.data?.pendingId === 'string' ? request.data.pendingId.trim() : '';
    if (!pendingId) {
      throw new HttpsError('invalid-argument', 'pendingId krävs.');
    }
    try {
      await rejectWeaverPending(uid, pendingId);
      return { status: 'dismissed' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Avvisning misslyckades.';
      throw new HttpsError('failed-precondition', msg);
    }
  }
);

export const journalWovenToKampspar = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'journalWovenToKampspar', 10);

    if (request.data?.optIn !== true) {
      throw new HttpsError(
        'invalid-argument',
        'optIn: true krävs — journal_woven körs endast med explicit samtycke.'
      );
    }

    const journalEntryId = typeof request.data.journalEntryId === 'string' ? request.data.journalEntryId.trim() : '';
    const mood = typeof request.data.mood === 'string' ? request.data.mood.trim() : '';
    const text = typeof request.data.text === 'string' ? request.data.text : '';

    if (!journalEntryId || !mood) {
      throw new HttpsError('invalid-argument', 'journalEntryId och mood krävs.');
    }

    const result = await emitSynapse(adkOrchestrator, {
      trigger: 'journal_woven',
      contextId: uid,
      payload: {
        ownerId: uid,
        journalEntryId,
        mood,
        text,
        optIn: true,
      },
    });

    return result;
  }
);

export const getAgentRegistry = onCall(
  { region: 'europe-west1' },
  async (request) => {
    await guardSensitiveCallableV2(request, 'getAgentRegistry', 30);
    return { agents: listAgentCards() };
  }
);

export const speglingsMirror = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    await guardSensitiveCallableV2(request, 'speglingsMirror', 30);

    const reflection = request.data.reflection;
    const mood = typeof request.data.mood === 'string' ? request.data.mood : undefined;

    if (!reflection || typeof reflection !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "reflection" (string) krävs.');
    }

    if (reflection.length > 4000) {
      throw new HttpsError('invalid-argument', 'Reflection får vara max 4000 tecken.');
    }

    const rawMirror = await askSpeglingsCoach(reflection, mood, process.env.GEMINI_API_KEY);
    const mirror = trimSpeglingsMirror(rawMirror);
    return { mirror };
  }
);

export const journalQuickMirror = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    await guardSensitiveCallableV2(request, 'journalQuickMirror', 30);

    const mood = request.data.mood;
    if (!mood || typeof mood !== 'string' || mood.length > 80) {
      throw new HttpsError('invalid-argument', 'Fältet "mood" (string, max 80) krävs.');
    }

    const tags = Array.isArray(request.data.tags)
      ? request.data.tags.filter((t: unknown) => typeof t === 'string').slice(0, 10)
      : [];

    const optionalText = typeof request.data.optionalText === 'string' ? request.data.optionalText : undefined;
    if (optionalText && optionalText.length > 500) {
      throw new HttpsError('invalid-argument', 'optionalText max 500 tecken.');
    }

    const result = await askDagbokSnabbCoach(mood, tags, optionalText, process.env.GEMINI_API_KEY);
    return result;
  }
);

export const mabraCoach = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'mabraCoach', 30);

    const hubSymptom = request.data.hubSymptom;
    const exerciseType = request.data.exerciseType;
    const optionalNote = typeof request.data.optionalNote === 'string' ? request.data.optionalNote : undefined;
    const mode = typeof request.data.mode === 'string' ? request.data.mode : 'coach';
    const thought = typeof request.data.thought === 'string' ? request.data.thought.trim() : '';

    if (mode === 'rsd_error') {
      const requestedBankId =
        typeof request.data.bankId === 'string' ? request.data.bankId.trim() : undefined;
      let bankId: string;
      try {
        bankId = resolveRsdErrorBankId(requestedBankId);
      } catch {
        throw invalidBankIdError('Ogiltig bankId för rsd_error.');
      }
      const bankEntry = getMabraCoachBankEntry(bankId);
      if (!bankEntry) {
        throw invalidBankIdError('Bankrad saknas för rsd_error.');
      }
      const coach = parafraseRsdErrorFromBank(bankEntry);
      return { coach, redirectToSpeglar: false, bankId };
    }

    if (mode === 'bank_parafras') {
      const requestedBankId =
        typeof request.data.bankId === 'string' ? request.data.bankId.trim() : '';
      if (!requestedBankId) {
        throw new HttpsError('invalid-argument', 'Fältet "bankId" krävs för bank_parafras.');
      }
      let bankId: string;
      try {
        bankId = resolveBankParafrasBankId(requestedBankId);
      } catch {
        throw invalidBankIdError('Ogiltig bankId för bank_parafras.');
      }
      const bankNote =
        typeof request.data.optionalNote === 'string' ? request.data.optionalNote : undefined;
      if (bankNote && bankNote.length > 500) {
        throw new HttpsError('invalid-argument', 'optionalNote max 500 tecken.');
      }
      if (shouldRedirectMabraCoachToSpeglar(bankNote)) {
        return {
          coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
          redirectToSpeglar: true,
        };
      }
      const bankEntry = getMabraCoachBankEntry(bankId);
      if (!bankEntry) {
        throw invalidBankIdError('Bankrad saknas för bank_parafras.');
      }
      const validHubs = ['panic_rsd', 'self_critical', 'find_self'] as const;
      const validExercises = ['breathing', 'grounding', 'reframing'] as const;
      const hubRaw = request.data.hubSymptom;
      const exerciseRaw = request.data.exerciseType;
      const hubCtx =
        typeof hubRaw === 'string' && (validHubs as readonly string[]).includes(hubRaw)
          ? (hubRaw as MabraCoachHub)
          : undefined;
      const exerciseCtx =
        typeof exerciseRaw === 'string' && (validExercises as readonly string[]).includes(exerciseRaw)
          ? (exerciseRaw as MabraCoachExercise)
          : undefined;
      const capacityScore = await fetchUserCapacityScore(uid);
      const capacityBand = toCapacityBand(capacityScore);
      const capacityCoach = parafraseCoachFromBankWithCapacity(
        bankEntry,
        capacityBand,
        hubCtx,
        exerciseCtx,
      );
      return {
        coach: capacityCoach.coach,
        redirectToSpeglar: false,
        bankId,
        capacityBand: capacityCoach.capacityBand,
        ...(capacityCoach.microSteps ? { microSteps: capacityCoach.microSteps } : {}),
      };
    }

    if (mode === 'transformator') {
      if (!thought || thought.length > 500) {
        throw new HttpsError(
          'invalid-argument',
          'Fältet "thought" krävs (max 500 tecken) för transformator-läge.',
        );
      }
      if (shouldRedirectMabraCoachToSpeglar(thought)) {
        return {
          redirectToSpeglar: true,
          coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
        };
      }
      const transform = await askKbtTransformator(thought, process.env.GEMINI_API_KEY);
      return { transform, redirectToSpeglar: false };
    }

    if (mode === 'goal_assist') {
      const draftGoal =
        typeof request.data.draftGoal === 'string' ? request.data.draftGoal.trim() : undefined;
      if (draftGoal && draftGoal.length > 500) {
        throw new HttpsError('invalid-argument', 'draftGoal max 500 tecken.');
      }
      if (draftGoal && shouldRedirectMabraCoachToSpeglar(draftGoal)) {
        return {
          coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
          redirectToSpeglar: true,
        };
      }
      const requestedBankId =
        typeof request.data.bankId === 'string' ? request.data.bankId.trim() : undefined;
      let bankId: string;
      try {
        bankId = resolveGoalAssistBankId(draftGoal, requestedBankId);
      } catch {
        throw invalidBankIdError('Ogiltig bankId för goal_assist.');
      }
      const bankEntry = getMabraCoachBankEntry(bankId);
      if (!bankEntry) {
        throw invalidBankIdError('Bankrad saknas för goal_assist.');
      }
      const coach = parafraseGoalAssist(bankEntry, draftGoal);
      return { coach, redirectToSpeglar: false, bankId };
    }

    if (mode === 'vit_chat') {
      const projectId = typeof request.data.projectId === 'string' ? request.data.projectId.trim() : '';
      const vitMessage = typeof request.data.vitMessage === 'string' ? request.data.vitMessage.trim() : '';
      const seedPrompt = typeof request.data.seedPrompt === 'string' ? request.data.seedPrompt.trim() : undefined;
      const validProjects = ['self_esteem', 'emotional_memory', 'learn_together', 'who_am_i'];

      if (!projectId || !validProjects.includes(projectId)) {
        throw new HttpsError(
          'invalid-argument',
          'Fältet "projectId" krävs (self_esteem | emotional_memory | learn_together | who_am_i).',
        );
      }
      if (!vitMessage || vitMessage.length > 500) {
        throw new HttpsError(
          'invalid-argument',
          'Fältet "vitMessage" krävs (max 500 tecken) för vit_chat.',
        );
      }
      if (shouldRedirectMabraCoachToSpeglar(vitMessage)) {
        return {
          coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
          redirectToSpeglar: true,
        };
      }
      const vitBankId =
        typeof request.data.bankId === 'string' ? request.data.bankId.trim() : undefined;
      let resolvedVitBankId: string | undefined;
      try {
        resolvedVitBankId = resolveVitChatBankId(seedPrompt, vitBankId);
      } catch {
        throw invalidBankIdError('Ogiltig bankId för vit_chat.');
      }
      const vitBankEntry = resolvedVitBankId
        ? getMabraCoachBankEntry(resolvedVitBankId)
        : undefined;
      const coach = await askVitChatCoach(
        projectId,
        vitMessage,
        vitBankEntry,
        process.env.GEMINI_API_KEY,
      );
      return {
        coach,
        redirectToSpeglar: false,
        ...(resolvedVitBankId ? { bankId: resolvedVitBankId } : {}),
      };
    }

    if (mode === 'nutrition_coach') {
      const { askMabraNutritionCoach } = await import('../agents/vertexAgent');
      const coach = await askMabraNutritionCoach(optionalNote || 'Jag vill ha ett näringstillägg', process.env.GEMINI_API_KEY);
      
      await admin.firestore().collection('mabra_sessions').add({
        ownerId: uid,
        exerciseType: 'nutrition_coach',
        durationSeconds: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        coachConversation: {
          note: String(optionalNote || '').slice(0, 2000),
          coachReply: String(coach || '').slice(0, 8000),
        },
      });

      return { coach, redirectToSpeglar: false };
    }

    if (mode === 'movement_coach') {
      const { askMabraMovementCoach } = await import('../agents/vertexAgent');
      const coach = await askMabraMovementCoach(optionalNote || 'Jag vill röra på mig i 2 minuter', process.env.GEMINI_API_KEY);
      
      await admin.firestore().collection('mabra_sessions').add({
        ownerId: uid,
        exerciseType: 'movement_coach',
        durationSeconds: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        coachConversation: {
          note: String(optionalNote || '').slice(0, 2000),
          coachReply: String(coach || '').slice(0, 8000),
        },
      });

      return { coach, redirectToSpeglar: false };
    }

    const validHubs = ['panic_rsd', 'self_critical', 'find_self'];
    const validExercises = ['breathing', 'grounding', 'reframing'];

    if (!hubSymptom || typeof hubSymptom !== 'string' || !validHubs.includes(hubSymptom)) {
      throw new HttpsError(
        'invalid-argument',
        'Fältet "hubSymptom" krävs (panic_rsd | self_critical | find_self).',
      );
    }

    if (!exerciseType || typeof exerciseType !== 'string' || !validExercises.includes(exerciseType)) {
      throw new HttpsError(
        'invalid-argument',
        'Fältet "exerciseType" krävs (breathing | grounding | reframing).',
      );
    }

    if (optionalNote && optionalNote.length > 500) {
      throw new HttpsError('invalid-argument', 'optionalNote får vara max 500 tecken.');
    }

    if (shouldRedirectMabraCoachToSpeglar(optionalNote)) {
      return {
        coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
        redirectToSpeglar: true,
      };
    }

    const requestedBankId =
      typeof request.data.bankId === 'string' ? request.data.bankId.trim() : undefined;
    let bankId: string;
    try {
      bankId = resolveCoachBankId(
        hubSymptom as MabraCoachHub,
        exerciseType as MabraCoachExercise,
        requestedBankId,
      );
    } catch {
      throw invalidBankIdError('Ogiltig bankId för coach-läge.');
    }
    const bankEntry = getMabraCoachBankEntry(bankId);
    if (!bankEntry) {
      throw invalidBankIdError('Bankrad saknas för coach-läge.');
    }

    const parafrasTier = request.data.parafrasTier === 'deterministic' ? 'deterministic' : 'llm';
    if (parafrasTier === 'deterministic') {
      const capacityScore = await fetchUserCapacityScore(uid);
      const capacityBand = toCapacityBand(capacityScore);
      const capacityCoach = parafraseCoachFromBankWithCapacity(
        bankEntry,
        capacityBand,
        hubSymptom as MabraCoachHub,
        exerciseType as MabraCoachExercise,
      );
      return {
        coach: capacityCoach.coach,
        redirectToSpeglar: false,
        bankId,
        capacityBand: capacityCoach.capacityBand,
        ...(capacityCoach.microSteps ? { microSteps: capacityCoach.microSteps } : {}),
      };
    }

    const coach = await askMabraCoach(
      hubSymptom as MabraCoachHub,
      exerciseType as MabraCoachExercise,
      bankEntry,
      optionalNote,
      process.env.GEMINI_API_KEY,
    );
    return { coach, redirectToSpeglar: false, bankId };
  }
);

export const ingestWidgetRecording = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    await guardSensitiveCallableV2(request, 'ingestWidgetRecording', 20);

    const transcript = typeof request.data.transcript === 'string' ? request.data.transcript : '';
    const recordedAt =
      typeof request.data.recordedAt === 'string' ? request.data.recordedAt : new Date().toISOString();
    const durationSeconds =
      typeof request.data.durationSeconds === 'number' ? request.data.durationSeconds : undefined;

    if (transcript.length > 12000) {
      throw new HttpsError('invalid-argument', 'Transkript max 12000 tecken.');
    }

    const analysis = await analyzeWidgetRecording(
      transcript,
      recordedAt,
      durationSeconds,
      process.env.GEMINI_API_KEY,
    );
    return analysis;
  }
);

export const breakDownResponse = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'breakDownResponse', 30);

    const text = request.data.text;
    if (!text || typeof text !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "text" (string) krävs.');
    }

    if (text.length > 12000) {
      throw new HttpsError('invalid-argument', 'Text får vara max 12000 tecken.');
    }

    const result = (await emitSynapse(adkOrchestrator, {
      trigger: 'user_overwhelm',
      contextId: uid,
      payload: { text },
    })) as { microSteps: MicroStep[] };
    return { microSteps: result.microSteps };
  }
);

export const crushTask = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    await guardSensitiveCallableV2(request, 'crushTask', 20);

    const task = request.data.task;
    if (!task || typeof task !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "task" (string) krävs.');
    }

    if (task.length > 1000) {
      throw new HttpsError('invalid-argument', 'Uppgiften får vara max 1000 tecken.');
    }

    const atoms = await askUppgiftsKrossaren(task, process.env.GEMINI_API_KEY);
    return { atoms };
  }
);

export const scheduledGeneratePayslip = functions
  .region('europe-west1')
  .pubsub.schedule('0 8 16 * *')
  .timeZone('Europe/Stockholm')
  .onRun(async () => {
    console.log('[scheduledGeneratePayslip] Startar…');
    const count = await generatePayslipsForAllProfiles();
    console.log(`[scheduledGeneratePayslip] Klar. ${count} lönespec(er).`);
  });

export const createBarnportenPairing = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'createBarnportenPairing', 10);
  const origin =
    typeof request.data?.origin === 'string' && request.data.origin.startsWith('http')
      ? request.data.origin
      : 'https://gen-lang-client-0481875058.web.app';
  try {
    return await createBarnportenPairingForUser(
      uid,
      request.data?.childAlias,
      origin,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Kunde inte skapa QR-kod.';
    throw new HttpsError(
      message.includes('Ogiltigt') ? 'invalid-argument' : 'internal',
      message,
    );
  }
});

export const claimBarnportenPairing = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'claimBarnportenPairing', 10);
  try {
    return await claimBarnportenPairingForUser(
      uid,
      request.data?.token,
      request.data?.deviceId,
      request.data?.deviceLabel,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Koppling misslyckades.';
    const code =
      message.includes('Ogiltig') ||
      message.includes('hittades') ||
      message.includes('använd') ||
      message.includes('gått ut') ||
      message.includes('samma konto')
        ? 'failed-precondition'
        : 'internal';
    throw new HttpsError(code, message);
  }
});

export const generatePayslip = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'generatePayslip', 5);

    const period =
      request.data?.periodFrom && request.data?.periodTo
        ? { from: String(request.data.periodFrom), to: String(request.data.periodTo) }
        : undefined;

    try {
      return await generatePayslipInternal(uid, { period });
    } catch (error) {
      console.error('[generatePayslip] Fel:', error);
      throw new HttpsError(
        'internal',
        error instanceof Error ? error.message : 'Lönespec misslyckades.',
      );
    }
  }
);
