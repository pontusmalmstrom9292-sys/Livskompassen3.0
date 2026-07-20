import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { admin } from '../lib/firebaseAdmin';
import { askKnowledgeVaultWithRag } from '../agents/knowledgeVaultAgent';
import { askChildrenLogsQuery } from '../agents/childrenLogsAgent';
import { geminiApiKey } from '../lib/geminiSecret';
import { generateEmbeddingInternal } from '../lib/generateEmbeddingInternal';
import { listRegistryEntriesForUser } from '../lib/contextCacheRegistry';
import { analyzeUploadForKnowledge } from '../lib/analyzeUploadForKnowledge';
import { ingestKampsparForUser } from '../lib/ingestKampsparInternal';
import {
  BARNEN_MODULE_REDIRECT_MESSAGE,
  BARNEN_MODULE_ROUTE,
  shouldRouteKompisToBarnen,
} from '../lib/barnenModuleRouteGuard';
import { KNOWLEDGE_UPLOAD_MIMES, MAX_KNOWLEDGE_UPLOAD_BASE64_CHARS } from './shared';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { createSiloGuard, Silo } from '../lib/siloEnforcer';

const kunskapGuard = createSiloGuard('knowledgeVaultQuery', Silo.KUNSKAP);
const barnenGuard = createSiloGuard('childrenLogsQuery', Silo.BARNEN);
const contextCacheGuard = createSiloGuard('getContextCacheStatus', Silo.KUNSKAP);
const ingestKampsparGuard = createSiloGuard('ingestKampsparEntry', Silo.KUNSKAP);
const promoteKbGuard = createSiloGuard('promoteKbDocToKampspar', Silo.KUNSKAP);
const ingestDocGuard = createSiloGuard('ingestKnowledgeDocument', Silo.KUNSKAP);

export const generateEmbedding = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'generateEmbedding', 60);

    const text: string = request.data.text;
    if (!text || typeof text !== 'string') {
      throw new HttpsError('invalid-argument', 'En textsträng krävs.');
    }

    try {
      const embedding = await generateEmbeddingInternal(text);
      console.log(`[generateEmbedding] OK för uid=${uid}, dims=${embedding.length}`);
      return { embedding };
    } catch (error) {
      console.error('[generateEmbedding] Fel:', error);
      throw new HttpsError('internal', 'Kunde inte generera inbäddning via Google AI.');
    }
  }
);

export const knowledgeVaultQuery = onCall(
  { region: 'europe-west1', memory: '512MiB', secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'knowledgeVaultQuery', 30);

    const prompt = request.data?.prompt;
    if (!prompt || typeof prompt !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "prompt" (string) krävs.');
    }

    if (prompt.length > 8000) {
      throw new HttpsError('invalid-argument', 'Prompten får vara max 8000 tecken.');
    }

    const trimmedPrompt = prompt.trim();
    if (shouldRouteKompisToBarnen(trimmedPrompt)) {
      console.log(`[knowledgeVaultQuery] U5.5 barnen moduleRoute uid=${uid}`);
      return {
        answer: BARNEN_MODULE_REDIRECT_MESSAGE,
        citations: [],
        moduleRoute: BARNEN_MODULE_ROUTE,
      };
    }

    kunskapGuard.assertCollections(['kampspar', 'kb_docs', 'entity_profiles']);
    const result = await askKnowledgeVaultWithRag(
      uid,
      trimmedPrompt,
      geminiApiKey.value()
    );
    return result;
  }
);

export const childrenLogsQuery = onCall(
  { region: 'europe-west1', memory: '512MiB', secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'childrenLogsQuery', 30);

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

    barnenGuard.assertCollections(['children_logs', 'entity_profiles']);
    const result = await askChildrenLogsQuery(
      uid,
      question.trim(),
      childAlias,
      geminiApiKey.value()
    );
    return result;
  }
);

export const getContextCacheStatus = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'getContextCacheStatus', 30);

  contextCacheGuard.assertCollections(['context_cache_registry']);
  const entries = await listRegistryEntriesForUser(uid);
  return {
    registry: 'firestore',
    collection: 'context_cache_registry',
    ttlSeconds: 3600,
    count: entries.length,
    entries,
  };
});

export const ingestKampsparEntry = onCall(
  { region: 'europe-west1', memory: '512MiB', timeoutSeconds: 60, secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'ingestKampsparEntry', 10);
    const data = request.data;

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
      throw new HttpsError('invalid-argument', 'title krävs (max 200 tecken).');
    }
    if (!content || content.length > 8000) {
      throw new HttpsError('invalid-argument', 'content krävs (max 8000 tecken).');
    }

    ingestKampsparGuard.assertCollections(['kampspar']);
    return ingestKampsparForUser(uid, {
      title,
      content,
      category,
      entryType,
      tags,
      source,
      eventDate,
    });
  }
);

/** HITL: promote kb_docs → kort kampspar-livsminne (en bekräftelse). */
export const promoteKbDocToKampspar = onCall(
  { region: 'europe-west1', memory: '512MiB', timeoutSeconds: 60, secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'promoteKbDocToKampspar', 10);
    const kbDocId = typeof request.data?.kbDocId === 'string' ? request.data.kbDocId.trim() : '';
    if (!kbDocId) {
      throw new HttpsError('invalid-argument', 'kbDocId krävs.');
    }

    promoteKbGuard.assertCollections(['kb_docs', 'kampspar']);
    const snap = await admin.firestore().collection('kb_docs').doc(kbDocId).get();
    if (!snap.exists) {
      throw new HttpsError('not-found', 'kb_docs-post saknas.');
    }
    const data = snap.data()!;
    if (data.ownerId !== uid && data.userId !== uid) {
      throw new HttpsError('permission-denied', 'Åtkomst nekad.');
    }

    const title = String(data.title ?? 'Livsminne').slice(0, 200);
    const content = String(data.content ?? '').slice(0, 8000);
    if (content.length < 12) {
      throw new HttpsError('failed-precondition', 'Dokumentet saknar innehåll att promota.');
    }

    const result = await ingestKampsparForUser(uid, {
      title,
      content,
      category: 'livsminne',
      entryType: 'promoted',
      source: 'kb_docs_promote',
      tags: ['hitl-promote', 'manuell'],
      promotedFromKbDocId: kbDocId,
    });

    return {
      ...result,
      kbDocId,
      toast: 'Sparat i Minne',
    };
  }
);

export const ingestKnowledgeDocument = onCall(
  { region: 'europe-west1', memory: '1GiB', timeoutSeconds: 120, secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'ingestKnowledgeDocument', 10);
    const data = request.data;

    const fileName = typeof data.fileName === 'string' ? data.fileName.trim() : '';
    const mimeType = typeof data.mimeType === 'string' ? data.mimeType.trim() : '';
    const base64 = typeof data.base64 === 'string' ? data.base64.trim() : '';
    const sourceLabel =
      typeof data.sourceLabel === 'string' ? data.sourceLabel.trim() : 'kunskap_upload';

    if (!fileName || fileName.length > 200) {
      throw new HttpsError('invalid-argument', 'fileName krävs (max 200 tecken).');
    }
    if (!mimeType || !KNOWLEDGE_UPLOAD_MIMES.has(mimeType)) {
      throw new HttpsError('invalid-argument', 'mimeType stöds inte för kunskaps-index.');
    }
    if (!base64 || base64.length < 16) {
      throw new HttpsError('invalid-argument', 'base64 saknas.');
    }
    if (base64.length > MAX_KNOWLEDGE_UPLOAD_BASE64_CHARS) {
      throw new HttpsError(
        'invalid-argument',
        'Uppladdningen är för stor (max ~8 MB).',
      );
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64, 'base64');
    } catch {
      throw new HttpsError('invalid-argument', 'Ogiltig base64.');
    }

    let title = fileName;
    let content: string;

    const isPlainText =
      mimeType.startsWith('text/') ||
      mimeType === 'application/json' ||
      /\.(txt|md|csv|json)$/i.test(fileName);

    if (isPlainText) {
      content = buffer.toString('utf8').trim();
      if (content.length < 12) {
        throw new HttpsError('invalid-argument', 'Textfilen är tom eller för kort.');
      }
    } else {
      const extracted = await analyzeUploadForKnowledge(buffer, mimeType, fileName);
      title = extracted.title;
      content = extracted.content;
    }

    let tags: string[] | undefined;
    if (Array.isArray(data.tags)) {
      const parsed = (data.tags as unknown[])
        .filter((t: unknown): t is string => typeof t === 'string')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0)
        .slice(0, 12);
      tags = parsed.length > 0 ? parsed : undefined;
    }

    ingestDocGuard.assertCollections(['kampspar']);
    const result = await ingestKampsparForUser(uid, {
      title,
      content: content.slice(0, 48_000),
      category: 'dokument',
      entryType: 'fakta',
      source: 'kunskap_fil',
      tags: ['kunskap_upload', sourceLabel, ...(tags ?? [])],
    });

    return { ...result, fileName, mimeType, analyzed: !isPlainText };
  }
);
