/**
 * Vertex AI Context Cache Manager (G12 — Firestore-backed shared registry)
 *
 * Delad registry mellan Cloud Run-instanser via `context_cache_registry`.
 * TTL max 1h (GDPR dataminimering). Zero Footprint via invalidateCachesForUser.
 */

import * as admin from 'firebase-admin';
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import { GCP_PROJECT_ID, GCP_REGION } from '../config';
import {
  deleteRegistryEntriesForUser,
  deleteRegistryEntry,
  getRegistryEntry,
  hashCacheContent,
  resolveOwnerIdFromCacheKey,
  setRegistryEntry,
} from './contextCacheRegistry';

const PROJECT_ID = GCP_PROJECT_ID;
const LOCATION = GCP_REGION;
const MODEL_ID = 'gemini-1.5-pro-001';

/** TTL: 1h standard — Vertex raderar cached content automatiskt efter TTL. */
const CACHE_TTL_SECONDS = 3600;

export interface ContextCacheOptions {
  systemInstruction: string;
  backgroundDocuments: string[];
  ttlSeconds?: number;
}

export interface CachedContext {
  cacheId: string;
  expiresAt: Date;
}

/**
 * Skapar eller återanvänder cachat Vertex-kontext (Firestore registry = source of truth).
 */
export async function getOrCreateCache(
  cacheKey: string,
  options: ContextCacheOptions
): Promise<CachedContext | null> {
  const contentHash = hashCacheContent(options.systemInstruction, options.backgroundDocuments);
  const ttl = options.ttlSeconds ?? CACHE_TTL_SECONDS;

  const existing = await getRegistryEntry(cacheKey, contentHash);
  if (existing) {
    console.log(`[VertexCache] Registry HIT: ${cacheKey}`);
    return { cacheId: existing.cacheId, expiresAt: existing.expiresAt };
  }

  if (!options.backgroundDocuments.length) {
    console.log(`[VertexCache] Skip cache create (empty RAG) key=${cacheKey}`);
    return null;
  }

  console.log(`[VertexCache] Registry MISS: ${cacheKey} — creating Vertex cache…`);

  try {
    const vertexai = new VertexAI({ project: PROJECT_ID, location: LOCATION });
    const contextContent = options.backgroundDocuments.join('\n\n---\n\n');

    const cache = await (vertexai as any).preview.createCachedContent({
      model: `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}`,
      systemInstruction: {
        role: 'system',
        parts: [{ text: options.systemInstruction }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: `BAKGRUNDSKONTEXT (Minne & historik):\n\n${contextContent}` }],
        },
      ],
      ttl: { seconds: ttl },
    });

    const cacheId: string = cache?.name ?? '';
    if (!cacheId) {
      console.warn(`[VertexCache] Vertex returnerade tom cacheId för ${cacheKey}`);
      return null;
    }

    const expiresAt = new Date(Date.now() + ttl * 1000);
    const ownerId = resolveOwnerIdFromCacheKey(cacheKey);

    await setRegistryEntry({
      cacheKey,
      ownerId,
      cacheId,
      contentHash,
      expiresAt,
    });

    console.log(`[VertexCache] Cache skapad ${cacheId} till ${expiresAt.toISOString()}`);
    return { cacheId, expiresAt };
  } catch (error) {
    console.warn(`[VertexCache] Kunde inte skapa cache för ${cacheKey}:`, error);
    return null;
  }
}

/**
 * Genererar svar med cachat kontext. Fallback till null om cache saknas.
 */
export async function generateWithCache(
  cachedContext: CachedContext,
  userMessage: string
): Promise<string> {
  const vertexai = new VertexAI({ project: PROJECT_ID, location: LOCATION });
  const model = vertexai.preview.getGenerativeModel({ model: MODEL_ID });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    cachedContent: cachedContext.cacheId,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.2,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
  });

  return result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/** Ogiltigförklara en nyckel (Firestore + best-effort Vertex delete). */
export async function invalidateCache(cacheKey: string): Promise<void> {
  const snap = await admin.firestore().collection('context_cache_registry').doc(cacheKey).get();
  const cacheId = snap.exists ? String(snap.data()?.cacheId ?? '') : '';

  await deleteRegistryEntry(cacheKey);

  if (cacheId) {
    try {
      const vertexai = new VertexAI({ project: PROJECT_ID, location: LOCATION });
      await (vertexai as any).preview.cachedContents?.delete?.({ name: cacheId });
    } catch {
      /* Vertex TTL rensar ändå */
    }
  }

  console.log(`[VertexCache] Cache ogiltigförklarad: ${cacheKey}`);
}

/** Kill Switch — alla registry-poster för uid. */
export async function invalidateCachesForUser(ownerId: string): Promise<number> {
  const count = await deleteRegistryEntriesForUser(ownerId);
  console.log(`[VertexCache] Zero Footprint: ${count} registry-poster borta för uid=${ownerId}`);
  return count;
}
