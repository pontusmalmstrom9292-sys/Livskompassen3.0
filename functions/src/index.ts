import { onCall, HttpsError } from "firebase-functions/v2/https";
import { askMabraCoach, askSpeglingsCoach } from "./agents/vertexAgent";
import { askKnowledgeVaultWithRag } from "./agents/knowledgeVaultAgent";
import { geminiApiKey } from "./lib/geminiSecret";
import { generateEmbeddingInternal } from "./lib/generateEmbeddingInternal";
import { upsertKampsparVector } from "./lib/vectorSearchClient";
import { askValvChat } from "./agents/valvChatAgent";
import { weaveJournalEntry as runWeaver } from "./agents/weaverAgent";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { KompisSupervisor } from './agents/kompis-supervisor';
import { adkOrchestrator, listAgentCards, applyParalysBreak } from './adk';
import { emitSynapse } from './adk/synapses/synapseBus';
import { generateDossierInternal } from './lib/generateDossierInternal';
import {
  MABRA_SPEGLAR_REDIRECT_MESSAGE,
  shouldRedirectMabraCoachToSpeglar,
} from './lib/mabraCoachGuard';

admin.initializeApp();
const supervisor = new KompisSupervisor();

/** Speglings-Coachen: max 2–4 meningar (server-side guard). */
function trimSpeglingsMirror(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const parts = trimmed.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) ?? [trimmed];
  if (parts.length <= 4) return trimmed;
  return parts.slice(0, 4).join(' ').trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 1: generateEmbedding
// Genererar en textembedding (textembedding-gecko) för ett Minne-dokument.
// Anropas av frontend för att indexera ny data i Vector Search.
// ─────────────────────────────────────────────────────────────────────────────
export const generateEmbedding = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Endast inloggade användare får generera inbäddningar för Minne.'
    );
  }

  const text: string = data.text;
  if (!text || typeof text !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'En textsträng krävs.');
  }

  try {
    const embedding = await generateEmbeddingInternal(text);
    console.log(`[generateEmbedding] OK för uid=${context.auth.uid}, dims=${embedding.length}`);
    return { embedding };
  } catch (error) {
    console.error('[generateEmbedding] Fel:', error);
    throw new functions.https.HttpsError('internal', 'Kunde inte generera inbäddning via Vertex AI.');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 2: analyzeMessage
// Kör DCAP + Kompis Supervisor på ett givet meddelande.
// Frontend anropar denna för att analysera t.ex. ett mottaget SMS.
// Returnerar DCAP-resultat, riskScore och ett Grey Rock-svar om relevant.
// ─────────────────────────────────────────────────────────────────────────────
export const analyzeMessage = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const message = data.message;
  const ragContext: string[] = data.ragContext ?? []; // RAG-data hämtas av frontend via Vector Search

  if (!message || typeof message !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Fältet "message" (string) krävs.');
  }

  if (message.length > 5000) {
    throw new functions.https.HttpsError('invalid-argument', 'Meddelandet får vara max 5000 tecken.');
  }

  try {
    const result = await supervisor.handleUserRequest(message, context.auth.uid, ragContext);
    console.log(`[analyzeMessage] DCAP riskScore=${result.dcap?.riskScore} för uid=${context.auth.uid}`);
    return result;
  } catch (error) {
    console.error('[analyzeMessage] Fel:', error);
    throw new functions.https.HttpsError('internal', 'Analys misslyckades. Försök igen.');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 3: invalidateSession
// Kill Switch — rensar Vertex AI Context Cache och sessionsdata vid utloggning.
// Uppfyller "Zero Footprint"-kravet i system_plan.md.
// ─────────────────────────────────────────────────────────────────────────────
export const invalidateSession = functions.region('europe-west1').https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  supervisor.invalidateUserSession(context.auth.uid);
  console.log(`[invalidateSession] Session rensad för uid=${context.auth.uid}`);
  return { success: true };
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 4: scheduledRetentionJob
// Schemalagd GDPR-rensning. Körs dagligen kl 03:00 (europe-west1).
// Motsvarar Cloud Scheduler YAML-konfigurationen i scripts/scheduler/.
// ─────────────────────────────────────────────────────────────────────────────
export const scheduledRetentionJob = functions
  .region('europe-west1')
  .pubsub.schedule('0 3 * * *') // Cron: varje natt kl 03:00
  .timeZone('Europe/Stockholm')
  .onRun(async (_context) => {
    console.log('[scheduledRetentionJob] Startar GDPR-rensning...');
    // Importera och kör retention-jobbet inline
    const { default: runRetention } = await import('./jobs/retentionJob');
    if (typeof runRetention === 'function') {
      await runRetention();
    }
    console.log('[scheduledRetentionJob] Klar.');
  });

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 5: notifyNewFile
// Anropas av Google Apps Script när en fil flyttats till Kunskapsvalvet.
// ─────────────────────────────────────────────────────────────────────────────
export const notifyNewFile = functions
  .region('europe-west1')
  .runWith({ secrets: ['NOTIFY_WEBHOOK_SECRET'] })
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

    if (!fileId || !fileName || !mimeType) {
      res.status(400).send('Missing fileId, fileName or mimeType');
      return;
    }

    try {
      emitSynapse(adkOrchestrator, {
        trigger: 'drive_file_ingested',
        payload: { fileId, fileName, mimeType, ownerId: req.body.ownerId },
      }).catch((err) => {
        console.error(`[Background Pipeline Error] fileId=${fileId} fileName=${fileName}:`, err);
      });

      res.status(200).send({ status: 'Processing started', fileId });
    } catch (error) {
      console.error(`[notifyNewFile] Fel fileId=${fileId}:`, error);
      res.status(500).send('Internal Server Error');
    }
  });

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6: knowledgeVaultQuery
// Skapar en säker bro (endpoint) för appen (Android/Webb)
// ─────────────────────────────────────────────────────────────────────────────
export const knowledgeVaultQuery = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Autentisering krävs för Kunskapsvalvet.');
    }

    const prompt = request.data?.prompt;
    if (!prompt || typeof prompt !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "prompt" (string) krävs.');
    }

    if (prompt.length > 8000) {
      throw new HttpsError('invalid-argument', 'Prompten får vara max 8000 tecken.');
    }

    const result = await askKnowledgeVaultWithRag(
      request.auth.uid,
      prompt.trim(),
      geminiApiKey.value()
    );
    return result;
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6a: ingestKampsparEntry
// WORM create för manuella Minne-poster + valfri embedding-dimension.
// ─────────────────────────────────────────────────────────────────────────────
export const ingestKampsparEntry = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 60 })
  .https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const content = typeof data.content === 'string' ? data.content.trim() : '';
  const category = typeof data.category === 'string' ? data.category.trim() : undefined;
  const source = typeof data.source === 'string' ? data.source.trim() : 'manual';
  const eventDate = typeof data.eventDate === 'string' ? data.eventDate.trim() : undefined;

  if (!title || title.length > 200) {
    throw new functions.https.HttpsError('invalid-argument', 'title krävs (max 200 tecken).');
  }
  if (!content || content.length > 8000) {
    throw new functions.https.HttpsError('invalid-argument', 'content krävs (max 8000 tecken).');
  }

  let embeddingDim: number | null = null;
  let embedding: number[] = [];
  try {
    embedding = await generateEmbeddingInternal(`${title}\n${content}`);
    embeddingDim = embedding.length > 0 ? embedding.length : null;
  } catch (err) {
    console.warn('[ingestKampsparEntry] Embedding misslyckades — sparar utan index:', err);
  }

  const uid = context.auth.uid;
  const docRef = await admin.firestore().collection('kampspar').add({
    userId: uid,
    ownerId: uid,
    title,
    content,
    category: category || null,
    source,
    eventDate: eventDate || null,
    embeddingDim,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (embedding.length > 0) {
    await upsertKampsparVector(docRef.id, embedding);
  }

  return { docId: docRef.id, embeddingDim };
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6b: valvChatQuery
// Forensisk fråga/svar mot reality_vault (WORM) — skild från knowledgeVaultQuery.
// ─────────────────────────────────────────────────────────────────────────────
export const valvChatQuery = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för Valv-Chat.');
  }

  const question = request.data?.question;
  if (!question || typeof question !== 'string') {
    throw new HttpsError('invalid-argument', 'Fältet "question" (string) krävs.');
  }

  if (question.length > 2000) {
    throw new HttpsError('invalid-argument', 'Frågan får vara max 2000 tecken.');
  }

  const result = await askValvChat(request.auth.uid, question.trim());
  return result;
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 7: weaveJournalEntry
// Vävaren — async RAG-tagging av dagboksposter till WORM reality_vault.
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 8: getAgentRegistry
// A2A AgentCard-registret — maskinläsbara capabilities för frontend/verktyg.
// ─────────────────────────────────────────────────────────────────────────────
export const getAgentRegistry = functions.region('europe-west1').https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  return { agents: listAgentCards() };
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 9: breakDownResponse
// Paralys-Brytaren — sub-synaps som atomiserar tunga svar till 30s-mikrosteg.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Funktion 10: speglingsMirror
// Speglings-Coachen — ACT-spegling max 2–4 meningar, fallback i frontend.
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 10b: mabraCoach
// Måbra-Coachen — kort opt-in stöd efter övning (ingen RAG, ingen JADE).
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 11: generateDossier
// Sacred Feature — WORM aggregation, canonical hash, backend PDF, dossier_snapshots.
// ─────────────────────────────────────────────────────────────────────────────
export const generateDossier = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  try {
    return await generateDossierInternal(context.auth.uid, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generering misslyckades.';
    if (
      message.includes('Ogiltigt') ||
      message.includes('Minst ett') ||
      message.includes('Max ') ||
      message.includes('dateFrom') ||
      message.includes('saknas eller')
    ) {
      throw new functions.https.HttpsError('invalid-argument', message);
    }
    console.error('[generateDossier] Fel:', error);
    throw new functions.https.HttpsError('internal', message);
  }
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