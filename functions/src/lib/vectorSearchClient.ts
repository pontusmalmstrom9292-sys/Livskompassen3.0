import { GCP_PROJECT_ID } from '../config';

const LOCATION = 'europe-west1';

/** Canonical west1 STREAM index — see Arkiv-GAP G2. */
export const DEFAULT_VECTOR_SEARCH_INDEX_ID = '2686894156982255616';
export const DEFAULT_VECTOR_SEARCH_ENDPOINT_ID = '4956462078572363776';

export function kampsparDatapointId(docId: string): string {
  return `kampspar:${docId}`;
}

export function parseKampsparDatapointId(datapointId: string): string | null {
  if (!datapointId.startsWith('kampspar:')) return null;
  return datapointId.slice('kampspar:'.length);
}

export function kbDatapointId(docId: string): string {
  return `kb:${docId}`;
}

export function parseKbDatapointId(datapointId: string): string | null {
  if (!datapointId.startsWith('kb:')) return null;
  return datapointId.slice('kb:'.length);
}

export function vaultDatapointId(docId: string): string {
  return `vault:${docId}`;
}

export function parseVaultDatapointId(datapointId: string): string | null {
  if (!datapointId.startsWith('vault:')) return null;
  return datapointId.slice('vault:'.length);
}

function getIndexId(): string {
  return process.env.VECTOR_SEARCH_INDEX_ID?.trim() || DEFAULT_VECTOR_SEARCH_INDEX_ID;
}

function getAnnConfig(): {
  indexId: string;
  endpointId: string;
  deployedIndexId: string;
} | null {
  const endpointId =
    process.env.VECTOR_SEARCH_ENDPOINT_ID?.trim() || DEFAULT_VECTOR_SEARCH_ENDPOINT_ID;
  const deployedIndexId =
    process.env.VECTOR_SEARCH_DEPLOYED_INDEX_ID?.trim() ?? 'livskompassen_kv_deployed_v1';
  return { indexId: getIndexId(), endpointId, deployedIndexId };
}

export function isVectorSearchConfigured(): boolean {
  return getAnnConfig() !== null;
}

export interface VectorNeighbor {
  docId: string;
  collection: 'kampspar' | 'kb_docs';
}

/** ANN query — returns kampspar and kb_docs neighbors. Empty if endpoint ej live. */
export async function queryKampsparVectorNeighbors(
  embedding: number[],
  neighborCount = 12
): Promise<VectorNeighbor[]> {
  const cfg = getAnnConfig();
  if (!cfg || embedding.length === 0) return [];

  try {
    const { MatchServiceClient } = await import('@google-cloud/aiplatform');
    const client = new MatchServiceClient({
      apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
    });

    const indexEndpoint = `projects/${GCP_PROJECT_ID}/locations/${LOCATION}/indexEndpoints/${cfg.endpointId}`;

    const [response] = await client.findNeighbors({
      indexEndpoint,
      deployedIndexId: cfg.deployedIndexId,
      queries: [
        {
          datapoint: {
            datapointId: `query-${Date.now()}`,
            featureVector: embedding,
          },
          neighborCount,
        },
      ],
    });

    const neighbors = response.nearestNeighbors?.[0]?.neighbors ?? [];
    const docIds: VectorNeighbor[] = [];
    for (const n of neighbors) {
      const id = n.datapoint?.datapointId;
      if (!id) continue;
      const kampsparId = parseKampsparDatapointId(id);
      if (kampsparId) {
        docIds.push({ docId: kampsparId, collection: 'kampspar' });
        continue;
      }
      const kbId = parseKbDatapointId(id);
      if (kbId) {
        docIds.push({ docId: kbId, collection: 'kb_docs' });
        continue;
      }
    }
    return docIds;
  } catch (err) {
    console.warn('[vectorSearch] ANN findNeighbors misslyckades — Firestore-fallback:', err);
    return [];
  }
}

/** ANN query — returns reality_vault docIds. Empty if endpoint ej live. */
export async function queryVaultVectorNeighbors(
  embedding: number[],
  neighborCount = 20
): Promise<string[]> {
  const cfg = getAnnConfig();
  if (!cfg || embedding.length === 0) return [];

  try {
    const { MatchServiceClient } = await import('@google-cloud/aiplatform');
    const client = new MatchServiceClient({
      apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
    });

    const indexEndpoint = `projects/${GCP_PROJECT_ID}/locations/${LOCATION}/indexEndpoints/${cfg.endpointId}`;

    const [response] = await client.findNeighbors({
      indexEndpoint,
      deployedIndexId: cfg.deployedIndexId,
      queries: [
        {
          datapoint: {
            datapointId: `query-${Date.now()}`,
            featureVector: embedding,
          },
          neighborCount, // fetch more because we mix namespaces
        },
      ],
    });

    const neighbors = response.nearestNeighbors?.[0]?.neighbors ?? [];
    const docIds: string[] = [];
    for (const n of neighbors) {
      const id = n.datapoint?.datapointId;
      if (!id) continue;
      const docId = parseVaultDatapointId(id);
      if (docId) docIds.push(docId);
    }
    return docIds;
  } catch (err) {
    console.warn('[vectorSearch] Vault ANN findNeighbors misslyckades:', err);
    return [];
  }
}

/** Upsert embedding till Vector Search index (STREAM index, west1). */
export async function upsertKampsparVector(docId: string, embedding: number[]): Promise<void> {
  if (embedding.length === 0) return;

  const indexId = getIndexId();

  try {
    const { IndexServiceClient } = await import('@google-cloud/aiplatform');
    const client = new IndexServiceClient({
      apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
    });

    const index = `projects/${GCP_PROJECT_ID}/locations/${LOCATION}/indexes/${indexId}`;
    await client.upsertDatapoints({
      index,
      datapoints: [
        {
          datapointId: kampsparDatapointId(docId),
          featureVector: embedding,
        },
      ],
    });
  } catch (err) {
    console.warn(`[vectorSearch] upsert misslyckades docId=${docId}:`, err);
  }
}

/** Upsert embedding till Vector Search index for reality_vault. */
export async function upsertVaultVector(docId: string, embedding: number[]): Promise<void> {
  if (embedding.length === 0) return;

  const indexId = getIndexId();

  try {
    const { IndexServiceClient } = await import('@google-cloud/aiplatform');
    const client = new IndexServiceClient({
      apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
    });

    const index = `projects/${GCP_PROJECT_ID}/locations/${LOCATION}/indexes/${indexId}`;
    await client.upsertDatapoints({
      index,
      datapoints: [
        {
          datapointId: vaultDatapointId(docId),
          featureVector: embedding,
        },
      ],
    });
  } catch (err) {
    console.warn(`[vectorSearch] upsert Vault misslyckades docId=${docId}:`, err);
  }
}

/** Upsert embedding till Vector Search index for kb_docs. */
export async function upsertKbVector(docId: string, embedding: number[]): Promise<void> {
  if (embedding.length === 0) return;

  const indexId = getIndexId();

  try {
    const { IndexServiceClient } = await import('@google-cloud/aiplatform');
    const client = new IndexServiceClient({
      apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
    });

    const index = `projects/${GCP_PROJECT_ID}/locations/${LOCATION}/indexes/${indexId}`;
    await client.upsertDatapoints({
      index,
      datapoints: [
        {
          datapointId: kbDatapointId(docId),
          featureVector: embedding,
        },
      ],
    });
  } catch (err) {
    console.warn(`[vectorSearch] upsert kb_docs misslyckades docId=${docId}:`, err);
  }
}
