import { onCall, HttpsError } from "firebase-functions/v2/https";
import { askMabraCoach, askSpeglingsCoach } from "./agents/vertexAgent";
import { askKnowledgeVaultWithRag } from "./agents/knowledgeVaultAgent";
import { geminiApiKey } from "./lib/geminiSecret";
import { generateEmbeddingInternal } from "./lib/generateEmbeddingInternal";
import { upsertKampsparVector } from "./lib/vectorSearchClient";
import { askValvChat } from "./agents/valvChatAgent";
import { askChildrenLogsQuery } from "./agents/childrenLogsAgent";
import { weaveJournalEntry as runWeaver } from "./agents/weaverAgent";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { KompisSupervisor } from './agents/kompis-supervisor';
import { adkOrchestrator, listAgentCards, applyParalysBreak } from './adk';
import { emitSynapse } from './adk/synapses/synapseBus';
import { generateDossierInternal } from './lib/generateDossierInternal';
import {
  generatePayslipInternal,
  generatePayslipsForAllProfiles,
} from './economy/generatePayslipInternal';
import {
  MABRA_SPEGLAR_REDIRECT_MESSAGE,
  shouldRedirectMabraCoachToSpeglar,
} from './lib/mabraCoachGuard';
import {
  BARNEN_MODULE_REDIRECT_MESSAGE,
  BARNEN_MODULE_ROUTE,
  shouldRouteKompisToBarnen,
} from './lib/barnenModuleRouteGuard';
import { loadEntityProfileBundle } from './lib/entityProfileStore';
import { classifyInboxDocument } from './lib/inboxClassifier';
import {
  confirmInboxQueueItem,
  dismissInboxQueueItem,
  listPendingInboxQueue,
} from './lib/inboxPersist';
import { listRegistryEntriesForUser } from './lib/contextCacheRegistry';
import { fetchKampsparRagBackgroundDocuments } from './lib/kampsparQueryRag';

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

  if (data.ragContext !== undefined) {
    console.warn(
      `[analyzeMessage] Client ragContext ignoreras (P0) — uid=${context.auth.uid}`
    );
  }

  if (!message || typeof message !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Fältet "message" (string) krävs.');
  }

  if (message.length > 5000) {
    throw new functions.https.HttpsError('invalid-argument', 'Meddelandet får vara max 5000 tecken.');
  }

  const preferGransArkitekten =
    data.module === 'safe_harbor' || data.preferGransArkitekten === true;

  const ragContext = await fetchKampsparRagBackgroundDocuments(context.auth.uid, message, 8);

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

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 3: invalidateSession
// Kill Switch — rensar Vertex AI Context Cache och sessionsdata vid utloggning.
// Uppfyller "Zero Footprint"-kravet i system_plan.md.
// ─────────────────────────────────────────────────────────────────────────────
export const invalidateSession = functions.region('europe-west1').https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  await supervisor.invalidateUserSession(context.auth.uid);
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
    const { default: runRetention } = await import('./jobs/retentionJob');
    if (typeof runRetention === 'function') {
      await runRetention();
    }
    console.log('[scheduledRetentionJob] Klar.');
  });

// ─────────────────────────────────────────────────────────────────────────────
// Ekonomi Fas 2: generatePayslip (schemalagd 16:e kl 08:00 + manuell callable)
// WORM payslip_snapshots — ingen LLM.
// ─────────────────────────────────────────────────────────────────────────────
export const scheduledGeneratePayslip = functions
  .region('europe-west1')
  .pubsub.schedule('0 8 16 * *')
  .timeZone('Europe/Stockholm')
  .onRun(async () => {
    console.log('[scheduledGeneratePayslip] Startar…');
    const count = await generatePayslipsForAllProfiles();
    console.log(`[scheduledGeneratePayslip] Klar. ${count} lönespec(er).`);
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

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 5: notifyNewFile
// Anropas av Google Apps Script när en fil flyttats till Kunskapsvalvet.
// ─────────────────────────────────────────────────────────────────────────────
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
    // P0: ownerId binds to server secret only — body ownerId/ownerUid is ignored (spoof-resistant).
    const driveIngestOwnerUid = process.env.DRIVE_INGEST_OWNER_UID?.trim();
    const ownerId = driveIngestOwnerUid || undefined;
    if (
      isProduction &&
      (req.body.ownerId || req.body.ownerUid) &&
      !driveIngestOwnerUid
    ) {
      console.warn(
        '[notifyNewFile] Body ownerId/ownerUid ignored — set DRIVE_INGEST_OWNER_UID secret'
      );
    }
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

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6: knowledgeVaultQuery
// Skapar en säker bro (endpoint) för appen (Android/Webb)
// ─────────────────────────────────────────────────────────────────────────────
export const knowledgeVaultQuery = onCall(
  { region: 'europe-west1', memory: '512MiB', secrets: [geminiApiKey] },
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

    const trimmedPrompt = prompt.trim();
    if (shouldRouteKompisToBarnen(trimmedPrompt)) {
      console.log(`[knowledgeVaultQuery] U5.5 barnen moduleRoute uid=${request.auth.uid}`);
      return {
        answer: BARNEN_MODULE_REDIRECT_MESSAGE,
        citations: [],
        moduleRoute: BARNEN_MODULE_ROUTE,
      };
    }

    const result = await askKnowledgeVaultWithRag(
      request.auth.uid,
      trimmedPrompt,
      geminiApiKey.value()
    );
    return result;
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6c: childrenLogsQuery (G8)
// Familjen-RAG — ENDAST children_logs. MUST NOT route via valvChatQuery.
// ─────────────────────────────────────────────────────────────────────────────
export const childrenLogsQuery = onCall(
  { region: 'europe-west1', memory: '512MiB', secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Autentisering krävs för Familjen-frågor.');
    }

    const question = request.data?.question;
    if (!question || typeof question !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "question" (string) krävs.');
    }

    if (question.length > 2000) {
      throw new HttpsError('invalid-argument', 'Frågan får vara max 2000 tecken.');
    }

    const childAlias =
      typeof request.data?.childAlias === 'string' && request.data.childAlias.trim()
        ? request.data.childAlias.trim()
        : undefined;

    const result = await askChildrenLogsQuery(
      request.auth.uid,
      question.trim(),
      childAlias,
      geminiApiKey.value()
    );
    return result;
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6d: getEntityProfileRegistry (G9)
// KEY_ENTITIES + SystemSynapse grounding — metadata only, NOT cross-RAG.
// ─────────────────────────────────────────────────────────────────────────────
export const getEntityProfileRegistry = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för aktörskartan.');
  }

  const bundle = await loadEntityProfileBundle(request.auth.uid);
  return {
    profiles: bundle.profiles.map((p) => ({
      entityKey: p.entityKey,
      role: p.role,
      displayName: p.displayName,
      aliases: p.aliases,
      category: p.category ?? null,
      isKeyEntity: p.isKeyEntity,
    })),
    synapses: bundle.synapses.map((s) => ({
      title: s.title,
      category: s.category,
      analysis: s.analysis,
      groundingPoints: s.groundingPoints,
      hallucinationRisk: s.hallucinationRisk,
      relatedEntityKeys: s.relatedEntityKeys ?? [],
    })),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6e: getInboxQueue (G10)
// HITL-kö — poster som kräver manuell silo-bekräftelse.
// ─────────────────────────────────────────────────────────────────────────────
export const getInboxQueue = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för inkorgen.');
  }

  const items = await listPendingInboxQueue(request.auth.uid);
  return { items };
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6f: confirmInboxItem (G10)
// Bekräfta routing → WORM i rätt silo (bevis|kunskap|barnen).
// ─────────────────────────────────────────────────────────────────────────────
export const confirmInboxItem = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const queueId = request.data?.queueId;
  const routing = request.data?.routing;
  if (!queueId || typeof queueId !== 'string') {
    throw new HttpsError('invalid-argument', 'queueId krävs.');
  }
  if (routing !== 'kunskap' && routing !== 'bevis' && routing !== 'barnen') {
    throw new HttpsError('invalid-argument', 'routing måste vara kunskap, bevis eller barnen.');
  }

  const childAlias =
    typeof request.data?.childAlias === 'string' && request.data.childAlias.trim()
      ? request.data.childAlias.trim()
      : undefined;

  try {
    return await confirmInboxQueueItem({
      uid: request.auth.uid,
      queueId,
      routing,
      childAlias,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bekräftelse misslyckades.';
    throw new HttpsError('failed-precondition', message);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6g: dismissInboxItem (G10)
// ─────────────────────────────────────────────────────────────────────────────
export const dismissInboxItem = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const queueId = request.data?.queueId;
  if (!queueId || typeof queueId !== 'string') {
    throw new HttpsError('invalid-argument', 'queueId krävs.');
  }

  try {
    await dismissInboxQueueItem(request.auth.uid, queueId);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Avvisning misslyckades.';
    throw new HttpsError('failed-precondition', message);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6h: previewInboxClassification (G10 smoke / dev)
// ─────────────────────────────────────────────────────────────────────────────
export const previewInboxClassification = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Autentisering krävs.');
    }

    const text = request.data?.text;
    const fileName =
      typeof request.data?.fileName === 'string' && request.data.fileName.trim()
        ? request.data.fileName.trim()
        : 'dokument.txt';

    if (!text || typeof text !== 'string') {
      throw new HttpsError('invalid-argument', 'text (string) krävs.');
    }
    if (text.length > 12000) {
      throw new HttpsError('invalid-argument', 'text max 12000 tecken.');
    }

    const classification = await classifyInboxDocument(
      text,
      fileName,
      geminiApiKey.value()
    );
    return { classification };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 6i: getContextCacheStatus (G12)
// Read-only registry-status för Zero Footprint / smoke.
// ─────────────────────────────────────────────────────────────────────────────
export const getContextCacheStatus = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const entries = await listRegistryEntriesForUser(request.auth.uid);
  return {
    registry: 'firestore',
    collection: 'context_cache_registry',
    ttlSeconds: 3600,
    count: entries.length,
    entries,
  };
});

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
  const entryType = typeof data.entryType === 'string' ? data.entryType.trim() : undefined;
  const source = typeof data.source === 'string' ? data.source.trim() : 'manual';
  const eventDate = typeof data.eventDate === 'string' ? data.eventDate.trim() : undefined;

  let tags: string[] | undefined;
  if (Array.isArray(data.tags)) {
    const parsed = (data.tags as unknown[])
      .filter((t: unknown): t is string => typeof t === 'string')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)
      .slice(0, 12)
      .map((t) => t.slice(0, 40));
    tags = parsed.length > 0 ? parsed : undefined;
  }

  if (!title || title.length > 200) {
    throw new functions.https.HttpsError('invalid-argument', 'title krävs (max 200 tecken).');
  }
  if (!content || content.length > 8000) {
    throw new functions.https.HttpsError('invalid-argument', 'content krävs (max 8000 tecken).');
  }

  let embeddingDim: number | null = null;
  let embedding: number[] = [];
  try {
    embedding = await generateEmbeddingInternal(
      [title, entryType, category, tags?.join(' '), content].filter(Boolean).join('\n')
    );
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
    entryType: entryType || null,
    tags: tags ?? null,
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
export const valvChatQuery = onCall({ region: 'europe-west1', memory: '512MiB' }, async (request) => {
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
// Funktion 7b: journalWovenToKampspar
// G7 — opt-in synaps dagbok → kampspar (MUST NOT auto-ingest).
// ─────────────────────────────────────────────────────────────────────────────
export const journalWovenToKampspar = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 60 })
  .https.onCall(async (data, context) => {
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