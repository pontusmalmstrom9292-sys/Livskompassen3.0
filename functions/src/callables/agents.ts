import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as functions from 'firebase-functions';
import {
  askMabraCoach,
  askVitChatCoach,
  askKbtTransformator,
  askSpeglingsCoach,
  askDagbokSnabbCoach,
} from '../agents/vertexAgent';
import { weaveJournalEntry as runWeaver } from '../agents/weaverAgent';
import { approveWeaverPending, rejectWeaverPending } from '../lib/weaverPending';
import { adkOrchestrator, listAgentCards, applyParalysBreak } from '../adk';
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

export const analyzeMessage = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const message = data.message;
  const ragContext: string[] = data.ragContext ?? [];

  if (!message || typeof message !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Fältet "message" (string) krävs.');
  }

  if (message.length > 5000) {
    throw new functions.https.HttpsError('invalid-argument', 'Meddelandet får vara max 5000 tecken.');
  }

  const preferGransArkitekten =
    data.module === 'safe_harbor' || data.preferGransArkitekten === true;

  try {
    const result = await supervisor.handleUserRequest(message, context.auth.uid, ragContext, {
      preferGransArkitekten,
    });
    console.log(
      `[analyzeMessage] agent=${result.agentId} DCAP riskScore=${result.dcap?.riskScore} för uid=${context.auth.uid}`
    );
    return result;
  } catch (error) {
    console.error('[analyzeMessage] Fel:', error);
    throw new functions.https.HttpsError('internal', 'Analys misslyckades. Försök igen.');
  }
});

export const invalidateSession = functions.region('europe-west1').https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  await supervisor.invalidateUserSession(context.auth.uid);
  await revokeVaultSession(context.auth.uid);
  console.log(`[invalidateSession] Session rensad för uid=${context.auth.uid}`);
  return { success: true };
});

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

export const weaveJournalEntry = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const { journalEntryId, mood, text } = data;
  if (!journalEntryId || !mood || !text) {
    throw new functions.https.HttpsError('invalid-argument', 'journalEntryId, mood och text krävs.');
  }

  return runWeaver(context.auth.uid, journalEntryId, mood, text);
});

export const approveWeaverMetadata = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  await assertVaultSession(context.auth.uid, data);
  const pendingId = typeof data?.pendingId === 'string' ? data.pendingId.trim() : '';
  if (!pendingId) {
    throw new functions.https.HttpsError('invalid-argument', 'pendingId krävs.');
  }
  try {
    return await approveWeaverPending(context.auth.uid, pendingId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Godkännande misslyckades.';
    throw new functions.https.HttpsError('failed-precondition', msg);
  }
});

export const rejectWeaverMetadata = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  const pendingId = typeof data?.pendingId === 'string' ? data.pendingId.trim() : '';
  if (!pendingId) {
    throw new functions.https.HttpsError('invalid-argument', 'pendingId krävs.');
  }
  try {
    await rejectWeaverPending(context.auth.uid, pendingId);
    return { status: 'dismissed' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Avvisning misslyckades.';
    throw new functions.https.HttpsError('failed-precondition', msg);
  }
});

export const journalWovenToKampspar = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  if (data?.optIn !== true) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'optIn: true krävs — journal_woven körs endast med explicit samtycke.'
    );
  }

  const journalEntryId = typeof data.journalEntryId === 'string' ? data.journalEntryId.trim() : '';
  const mood = typeof data.mood === 'string' ? data.mood.trim() : '';
  const text = typeof data.text === 'string' ? data.text : '';

  if (!journalEntryId || !mood) {
    throw new functions.https.HttpsError('invalid-argument', 'journalEntryId och mood krävs.');
  }

  const result = await emitSynapse(adkOrchestrator, {
    trigger: 'journal_woven',
    contextId: context.auth.uid,
    payload: {
      ownerId: context.auth.uid,
      journalEntryId,
      mood,
      text,
      optIn: true,
    },
  });

  return result;
});

export const getAgentRegistry = functions.region('europe-west1').https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  return { agents: listAgentCards() };
});

export const speglingsMirror = functions
  .region('europe-west1')
  .runWith({ secrets: ['GEMINI_API_KEY'] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
    }

    const reflection = data.reflection;
    const mood = typeof data.mood === 'string' ? data.mood : undefined;

    if (!reflection || typeof reflection !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'Fältet "reflection" (string) krävs.');
    }

    if (reflection.length > 4000) {
      throw new functions.https.HttpsError('invalid-argument', 'Reflection får vara max 4000 tecken.');
    }

    const rawMirror = await askSpeglingsCoach(reflection, mood, process.env.GEMINI_API_KEY);
    const mirror = trimSpeglingsMirror(rawMirror);
    return { mirror };
  });

export const journalQuickMirror = functions
  .region('europe-west1')
  .runWith({ secrets: ['GEMINI_API_KEY'] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
    }

    const mood = data.mood;
    if (!mood || typeof mood !== 'string' || mood.length > 80) {
      throw new functions.https.HttpsError('invalid-argument', 'Fältet "mood" (string, max 80) krävs.');
    }

    const tags = Array.isArray(data.tags)
      ? data.tags.filter((t: unknown) => typeof t === 'string').slice(0, 10)
      : [];

    const optionalText = typeof data.optionalText === 'string' ? data.optionalText : undefined;
    if (optionalText && optionalText.length > 500) {
      throw new functions.https.HttpsError('invalid-argument', 'optionalText max 500 tecken.');
    }

    const result = await askDagbokSnabbCoach(mood, tags, optionalText, process.env.GEMINI_API_KEY);
    return result;
  });

export const mabraCoach = functions
  .region('europe-west1')
  .runWith({ secrets: ['GEMINI_API_KEY'] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
    }

    const hubSymptom = data.hubSymptom;
    const exerciseType = data.exerciseType;
    const optionalNote = typeof data.optionalNote === 'string' ? data.optionalNote : undefined;
    const mode = typeof data.mode === 'string' ? data.mode : 'coach';
    const thought = typeof data.thought === 'string' ? data.thought.trim() : '';

    if (mode === 'transformator') {
      if (!thought || thought.length > 500) {
        throw new functions.https.HttpsError(
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

    if (mode === 'vit_chat') {
      const projectId = typeof data.projectId === 'string' ? data.projectId.trim() : '';
      const vitMessage = typeof data.vitMessage === 'string' ? data.vitMessage.trim() : '';
      const seedPrompt = typeof data.seedPrompt === 'string' ? data.seedPrompt.trim() : undefined;
      const validProjects = ['self_esteem', 'emotional_memory', 'learn_together', 'who_am_i'];

      if (!projectId || !validProjects.includes(projectId)) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Fältet "projectId" krävs (self_esteem | emotional_memory | learn_together | who_am_i).',
        );
      }
      if (!vitMessage || vitMessage.length > 500) {
        throw new functions.https.HttpsError(
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
      const coach = await askVitChatCoach(projectId, vitMessage, seedPrompt, process.env.GEMINI_API_KEY);
      return { coach, redirectToSpeglar: false };
    }

    const validHubs = ['panic_rsd', 'self_critical', 'find_self'];
    const validExercises = ['breathing', 'grounding', 'reframing'];

    if (!hubSymptom || typeof hubSymptom !== 'string' || !validHubs.includes(hubSymptom)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Fältet "hubSymptom" krävs (panic_rsd | self_critical | find_self).',
      );
    }

    if (!exerciseType || typeof exerciseType !== 'string' || !validExercises.includes(exerciseType)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Fältet "exerciseType" krävs (breathing | grounding | reframing).',
      );
    }

    if (optionalNote && optionalNote.length > 500) {
      throw new functions.https.HttpsError('invalid-argument', 'optionalNote får vara max 500 tecken.');
    }

    if (shouldRedirectMabraCoachToSpeglar(optionalNote)) {
      return {
        coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
        redirectToSpeglar: true,
      };
    }

    const coach = await askMabraCoach(hubSymptom, exerciseType, optionalNote, process.env.GEMINI_API_KEY);
    return { coach, redirectToSpeglar: false };
  });

export const ingestWidgetRecording = functions
  .region('europe-west1')
  .runWith({ secrets: ['GEMINI_API_KEY'] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
    }

    const transcript = typeof data.transcript === 'string' ? data.transcript : '';
    const recordedAt =
      typeof data.recordedAt === 'string' ? data.recordedAt : new Date().toISOString();
    const durationSeconds =
      typeof data.durationSeconds === 'number' ? data.durationSeconds : undefined;

    if (transcript.length > 12000) {
      throw new functions.https.HttpsError('invalid-argument', 'Transkript max 12000 tecken.');
    }

    const analysis = await analyzeWidgetRecording(
      transcript,
      recordedAt,
      durationSeconds,
      process.env.GEMINI_API_KEY,
    );
    return analysis;
  });

export const breakDownResponse = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const text = data.text;
  if (!text || typeof text !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Fältet "text" (string) krävs.');
  }

  if (text.length > 12000) {
    throw new functions.https.HttpsError('invalid-argument', 'Text får vara max 12000 tecken.');
  }

  const microSteps = await applyParalysBreak(text);
  return { microSteps };
});

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
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  const origin =
    typeof request.data?.origin === 'string' && request.data.origin.startsWith('http')
      ? request.data.origin
      : 'https://gen-lang-client-0481875058.web.app';
  try {
    return await createBarnportenPairingForUser(
      request.auth.uid,
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
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Logga in (samma konto som pappa) för att koppla.');
  }
  try {
    return await claimBarnportenPairingForUser(
      request.auth.uid,
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

export const generatePayslip = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const period =
    data?.periodFrom && data?.periodTo
      ? { from: String(data.periodFrom), to: String(data.periodTo) }
      : undefined;

  try {
    return await generatePayslipInternal(context.auth.uid, { period });
  } catch (error) {
    console.error('[generatePayslip] Fel:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Lönespec misslyckades.',
    );
  }
});
