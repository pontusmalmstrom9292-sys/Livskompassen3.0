import { createHash } from 'node:crypto';

/** Stable content hash for Minne dedup / audit (sha256 hex, 64 chars). */
export function computeMinneContentHash(parts: Array<string | null | undefined>): string {
  const payload = parts
    .map((p) => String(p ?? '').trim())
    .filter((p) => p.length > 0)
    .join('\n');
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

export type EmbedStatus = 'ok' | 'pending' | 'fail';

export const MINNE_EMBEDDING_MODEL = 'text-embedding-004';
export const MINNE_EMBEDDING_DIM = 768;

export const MINNE_CONTENT_CLASS = {
  kampspar: 'FACT' as const,
  kb_docs: 'FACT' as const,
};
