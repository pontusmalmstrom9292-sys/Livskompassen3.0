import { GCP_PROJECT_ID } from '../config';

/** Genererar textembedding-gecko vektor för RAG-indexering. */
export async function generateEmbeddingInternal(text: string): Promise<number[]> {
  const location = 'europe-west1';
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${location}/publishers/google/models/textembedding-gecko:predict`;
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
    body: JSON.stringify({ instances: [{ content: text }] }),
  });

  if (!resp.ok) {
    throw new Error(`Embedding API status ${resp.status}`);
  }

  const json = (await resp.json()) as { predictions?: { embeddings?: { values?: number[] } }[] };
  return json.predictions?.[0]?.embeddings?.values ?? [];
}
