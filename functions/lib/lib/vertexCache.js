"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCache = getOrCreateCache;
exports.generateWithCache = generateWithCache;
exports.invalidateCache = invalidateCache;
const vertexai_1 = require("@google-cloud/vertexai");
const PROJECT_ID = process.env.GCP_PROJECT_ID ?? 'livskompassen-v2';
const LOCATION = 'europe-west1';
const MODEL_ID = 'gemini-1.5-pro-001'; // Pro för djupa DCAP-analyser
// TTL: Context caches lever max 1h som standard; Vertex AI raderar dem automatiskt
const CACHE_TTL_SECONDS = 3600;
// --- Cache Registry (In-Memory, per Cloud Run-instans) ---
// I produktion kan detta ersättas med Firestore för att dela cache mellan instanser.
const cacheRegistry = new Map();
/**
 * Skapar eller återanvänder ett cachat kontext för Vertex AI.
 * @param cacheKey Unik nyckel för att identifiera kontexten (t.ex. `dcap_${userId}`)
 * @param options Kontextinnehåll och konfiguration.
 */
async function getOrCreateCache(cacheKey, options) {
    // Kontrollera om en giltig cache redan finns
    const existing = cacheRegistry.get(cacheKey);
    if (existing && existing.expiresAt > new Date()) {
        console.log(`[VertexCache] Cache HIT för nyckel: ${cacheKey}`);
        return existing;
    }
    console.log(`[VertexCache] Cache MISS för nyckel: ${cacheKey}. Skapar ny cache...`);
    const vertexai = new vertexai_1.VertexAI({ project: PROJECT_ID, location: LOCATION });
    // Kombinera alla bakgrundsdokument till en enda stor kontext-blob
    const contextContent = options.backgroundDocuments.join('\n\n---\n\n');
    // Skapa cache via Vertex AI Preview API
    // Notera: cachedContents API är en preview-feature
    const cache = await vertexai.preview.createCachedContent({
        model: `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}`,
        systemInstruction: {
            role: 'system',
            parts: [{ text: options.systemInstruction }],
        },
        contents: [
            {
                role: 'user',
                parts: [{ text: `BAKGRUNDSKONTEXT (Kampspår & historik):\n\n${contextContent}` }],
            },
        ],
        ttl: { seconds: options.ttlSeconds ?? CACHE_TTL_SECONDS },
    });
    const cacheId = cache?.name ?? '';
    const expiresAt = new Date(Date.now() + (options.ttlSeconds ?? CACHE_TTL_SECONDS) * 1000);
    const cachedContext = { cacheId, expiresAt };
    cacheRegistry.set(cacheKey, cachedContext);
    console.log(`[VertexCache] Cache skapad. ID: ${cacheId}. Giltig till: ${expiresAt.toISOString()}`);
    return cachedContext;
}
/**
 * Genererar ett AI-svar med ett cachat kontext (sparar tokens).
 * @param cachedContext Cachat kontext från getOrCreateCache.
 * @param userMessage Användarens aktuella meddelande.
 */
async function generateWithCache(cachedContext, userMessage) {
    const vertexai = new vertexai_1.VertexAI({ project: PROJECT_ID, location: LOCATION });
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
            { category: vertexai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: vertexai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
            { category: vertexai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: vertexai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        ],
    });
    return result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}
/**
 * Explicit borttagning av en cache-entry (t.ex. vid utloggning / Kill Switch).
 */
function invalidateCache(cacheKey) {
    cacheRegistry.delete(cacheKey);
    console.log(`[VertexCache] Cache ogiltigförklarad för nyckel: ${cacheKey}`);
}
//# sourceMappingURL=vertexCache.js.map