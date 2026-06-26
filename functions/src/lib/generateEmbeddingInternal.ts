import { createGenAI } from './genaiClient';

/** 768-dim — matchar Firestore vector index (text-embedding-004). */
const EMBEDDING_MODEL = 'text-embedding-004';

/** Genererar embedding för RAG-indexering via @google/genai (GEMINI_API_KEY). */
export async function generateEmbeddingInternal(text: string): Promise<number[]> {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const ai = createGenAI();
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: trimmed.slice(0, 8000),
  });

  const values = response.embeddings?.[0]?.values ?? [];
  if (values.length === 0) {
    throw new Error(`Embedding API ${EMBEDDING_MODEL} returnerade tom vektor`);
  }
  return values;
}
