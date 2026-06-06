import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as functions from 'firebase-functions';
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
import { KNOWLEDGE_UPLOAD_MIMES } from './shared';

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

    const uid = context.auth.uid;
    return ingestKampsparForUser(uid, {
      title,
      content,
      category,
      entryType,
      tags,
      source,
      eventDate,
    });
  });

export const ingestKnowledgeDocument = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 120, secrets: ['GEMINI_API_KEY'] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
    }

    const fileName = typeof data.fileName === 'string' ? data.fileName.trim() : '';
    const mimeType = typeof data.mimeType === 'string' ? data.mimeType.trim() : '';
    const base64 = typeof data.base64 === 'string' ? data.base64.trim() : '';
    const sourceLabel =
      typeof data.sourceLabel === 'string' ? data.sourceLabel.trim() : 'kunskap_upload';

    if (!fileName || fileName.length > 200) {
      throw new functions.https.HttpsError('invalid-argument', 'fileName krävs (max 200 tecken).');
    }
    if (!mimeType || !KNOWLEDGE_UPLOAD_MIMES.has(mimeType)) {
      throw new functions.https.HttpsError('invalid-argument', 'mimeType stöds inte för kunskaps-index.');
    }
    if (!base64 || base64.length < 16) {
      throw new functions.https.HttpsError('invalid-argument', 'base64 saknas.');
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64, 'base64');
    } catch {
      throw new functions.https.HttpsError('invalid-argument', 'Ogiltig base64.');
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
        throw new functions.https.HttpsError('invalid-argument', 'Textfilen är tom eller för kort.');
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

    const uid = context.auth.uid;
    const result = await ingestKampsparForUser(uid, {
      title,
      content: content.slice(0, 48_000),
      category: 'dokument',
      entryType: 'fakta',
      source: 'kunskap_fil',
      tags: ['kunskap_upload', sourceLabel, ...(tags ?? [])],
    });

    return { ...result, fileName, mimeType, analyzed: !isPlainText };
  });
