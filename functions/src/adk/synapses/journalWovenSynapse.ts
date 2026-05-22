import * as admin from 'firebase-admin';
import { generateEmbeddingInternal } from '../../lib/generateEmbeddingInternal';
import { upsertKampsparVector } from '../../lib/vectorSearchClient';

export interface JournalWovenPayload {
  ownerId: string;
  journalEntryId: string;
  mood: string;
  text: string;
  /** MUST be true — G7 opt-in only; auto-ingest blockeras. */
  optIn: boolean;
}

export interface JournalWovenResult {
  kampsparDocId: string;
  embeddingDim: number | null;
}

/**
 * G7 — Opt-in dagbok → kampspar (Kunskap-silo).
 * MUST NOT köras utan explicit optIn === true.
 */
export async function handleJournalWoven(payload: JournalWovenPayload): Promise<JournalWovenResult> {
  if (payload.optIn !== true) {
    throw new Error('journal_woven: optIn === true krävs — ingen auto-ingest');
  }

  const { ownerId, journalEntryId, mood, text } = payload;
  if (!ownerId || !journalEntryId || !mood) {
    throw new Error('journal_woven: ownerId, journalEntryId och mood krävs');
  }

  const trimmed = text?.trim() ?? '';
  const summary =
    trimmed.length > 0
      ? trimmed.slice(0, 600)
      : `Humör: ${mood} (kort check-in utan fritext)`;

  const title = `Dagbok · ${mood}`.slice(0, 200);
  const content = summary.slice(0, 8000);

  let embeddingDim: number | null = null;
  let embedding: number[] = [];
  try {
    embedding = await generateEmbeddingInternal([title, mood, content].join('\n'));
    embeddingDim = embedding.length > 0 ? embedding.length : null;
  } catch (err) {
    console.warn('[Synapse:journal_woven] Embedding misslyckades — sparar utan index:', err);
  }

  const docRef = await admin.firestore().collection('kampspar').add({
    userId: ownerId,
    ownerId,
    title,
    content,
    category: 'reflektion',
    entryType: 'dagbok_opt_in',
    source: 'journal_woven',
    journalEntryId,
    mood,
    tags: ['dagbok', 'opt-in'],
    embeddingDim,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (embedding.length > 0) {
    await upsertKampsparVector(docRef.id, embedding);
  }

  console.log(
    `[Synapse:journal_woven] kampspar docId=${docRef.id} journalEntryId=${journalEntryId} uid=${ownerId}`
  );

  return { kampsparDocId: docRef.id, embeddingDim };
}
