import { GCP_PROJECT_ID } from '../config';

const LOCATION = 'europe-west1';
/** 768-dim — matchar livskompassen-kv-index (west1). */
const EMBEDDING_MODEL = 'text-embedding-004';

/** Genererar Vertex embedding för RAG-indexering (768 dim). */
export async function generateEmbeddingInternal(text: string): Promise<number[]> {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${EMBEDDING_MODEL}:predict`;
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [{ content: trimmed.slice(0, 8000) }],
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Embedding API ${EMBEDDING_MODEL} status ${resp.status}: ${body.slice(0, 200)}`);
  }

  const json = (await resp.json()) as {
    predictions?: { embeddings?: { values?: number[] } }[];
  };
  const values = json.predictions?.[0]?.embeddings?.values ?? [];
  if (values.length === 0) {
    throw new Error(`Embedding API ${EMBEDDING_MODEL} returnerade tom vektor`);
  }
  return values;
}
