/**
 * Vertex AI Context Cache Manager
 * Livskompassen v2 - Fas 3, Steg 3.2
 *
 * Hanterar "Context Caching" för att reducera token-kostnader vid tunga
 * DCAP-analyser och Kompis-konversationer som kräver ett stort, stabilt
 * systemkontext (t.ex. systemprompten + RAG-hämtad bakgrundshistorik).
 *
 * Cachetid: Max 24h (raderas automatiskt) för att uppfylla GDPR-kravet på
 * dataminimering. Se .context/architecture.md.
 */

import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';


import { GCP_PROJECT_ID, GCP_REGION } from '../config';

const PROJECT_ID = GCP_PROJECT_ID;
const LOCATION = GCP_REGION;
const MODEL_ID = 'gemini-1.5-pro-001'; // Pro för djupa DCAP-analyser

// TTL: Context caches lever max 1h som standard; Vertex AI raderar dem automatiskt
const CACHE_TTL_SECONDS = 3600;

export interface ContextCacheOptions {
  systemInstruction: string;
  backgroundDocuments: string[]; // T.ex. RAG-hämtade Minne-textblock
  ttlSeconds?: number;
}

export interface CachedContext {
  cacheId: string;
  expiresAt: Date;
}

// --- Cache Registry (In-Memory, per Cloud Run-instans) ---
// I produktion kan detta ersättas med Firestore för att dela cache mellan instanser.
const cacheRegistry = new Map<string, CachedContext>();

/**
 * Skapar eller återanvänder ett cachat kontext för Vertex AI.
 * @param cacheKey Unik nyckel för att identifiera kontexten (t.ex. `dcap_${userId}`)
 * @param options Kontextinnehåll och konfiguration.
 */
export async function getOrCreateCache(
  cacheKey: string,
  options: ContextCacheOptions
): Promise<CachedContext> {
  // Kontrollera om en giltig cache redan finns
  const existing = cacheRegistry.get(cacheKey);
  if (existing && existing.expiresAt > new Date()) {
    console.log(`[VertexCache] Cache HIT för nyckel: ${cacheKey}`);
    return existing;
  }

  console.log(`[VertexCache] Cache MISS för nyckel: ${cacheKey}. Skapar ny cache...`);

  const vertexai = new VertexAI({ project: PROJECT_ID, location: LOCATION });

  // Kombinera alla bakgrundsdokument till en enda stor kontext-blob
  const contextContent = options.backgroundDocuments.join('\n\n---\n\n');

  // Skapa cache via Vertex AI Preview API
  // Notera: cachedContents API är en preview-feature
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
    ttl: { seconds: options.ttlSeconds ?? CACHE_TTL_SECONDS },
  });

  const cacheId: string = cache?.name ?? '';
  const expiresAt = new Date(Date.now() + (options.ttlSeconds ?? CACHE_TTL_SECONDS) * 1000);

  const cachedContext: CachedContext = { cacheId, expiresAt };
  cacheRegistry.set(cacheKey, cachedContext);

  console.log(`[VertexCache] Cache skapad. ID: ${cacheId}. Giltig till: ${expiresAt.toISOString()}`);
  return cachedContext;
}

/**
 * Genererar ett AI-svar med ett cachat kontext (sparar tokens).
 * @param cachedContext Cachat kontext från getOrCreateCache.
 * @param userMessage Användarens aktuella meddelande.
 */
export async function generateWithCache(
  cachedContext: CachedContext,
  userMessage: string
): Promise<string> {
  const vertexai = new VertexAI({ project: PROJECT_ID, location: LOCATION });
  const model = vertexai.preview.getGenerativeModel({ model: MODEL_ID });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    // Referera till det cachade kontextet
    cachedContent: cachedContext.cacheId,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.2, // Låg temperatur för deterministiska, stabila svar
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
    ],
  });

  return result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Explicit borttagning av en cache-entry (t.ex. vid utloggning / Kill Switch).
 */
export function invalidateCache(cacheKey: string): void {
  cacheRegistry.delete(cacheKey);
  console.log(`[VertexCache] Cache ogiltigförklarad för nyckel: ${cacheKey}`);
}

