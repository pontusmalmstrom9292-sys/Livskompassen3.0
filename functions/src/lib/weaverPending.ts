import * as admin from 'firebase-admin';
import type { WeaverResult } from '../agents/weaverAgent';
import { assertServerWormPayload, REALITY_VAULT_ALLOWED_KEYS } from './wormPayload';

export const WEAVER_PENDING_COLLECTION = 'weaver_pending';

export type WeaverPendingDoc = {
  userId: string;
  ownerId: string;
  journalEntryId: string;
  sourceMood: string;
  sourceTextPreview: string;
  truth: string;
  weaverTags: WeaverResult & { model: 'gemini-1.5-pro'; journalEntryId: string };
  status: 'pending';
  createdAt: FirebaseFirestore.FieldValue;
};

export async function createWeaverPending(input: {
  uid: string;
  journalEntryId: string;
  sourceMood: string;
  sourceText: string;
  tags: WeaverResult;
}): Promise<{ pendingId: string }> {
  const summary = `Taggar: ${input.tags.emotions.join(', ')} | aktörer: ${input.tags.actors.join(', ')} | hot: ${input.tags.threatLevel}`;
  const preview = input.sourceText.trim().slice(0, 160);

  const docRef = await admin.firestore().collection(WEAVER_PENDING_COLLECTION).add({
    userId: input.uid,
    ownerId: input.uid,
    journalEntryId: input.journalEntryId,
    sourceMood: input.sourceMood,
    sourceTextPreview: preview,
    truth: summary,
    weaverTags: {
      ...input.tags,
      model: 'gemini-1.5-pro',
      journalEntryId: input.journalEntryId,
    },
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  } satisfies Omit<WeaverPendingDoc, 'createdAt'> & { createdAt: FirebaseFirestore.FieldValue });

  return { pendingId: docRef.id };
}

async function assertPendingOwner(uid: string, pendingId: string) {
  const ref = admin.firestore().collection(WEAVER_PENDING_COLLECTION).doc(pendingId);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new Error('Vävaren-förslaget hittades inte.');
  }
  const data = snap.data()!;
  if (data.ownerId !== uid || data.status !== 'pending') {
    throw new Error('Otillåten åtgärd.');
  }
  return { ref, data };
}

export async function approveWeaverPending(
  uid: string,
  pendingId: string,
): Promise<{ vaultMetadataId: string }> {
  const { ref, data } = await assertPendingOwner(uid, pendingId);

  const vaultPayload: Record<string, unknown> = {
    userId: uid,
    ownerId: uid,
    category: 'vävaren_metadata',
    action: 'journal_tagging',
    truth: data.truth,
    journalEntryId: data.journalEntryId,
    sourceMood: data.sourceMood,
    weaverTags: data.weaverTags,
    isLocked: true,
  };

  assertServerWormPayload(vaultPayload, 'weaverPending.approve', REALITY_VAULT_ALLOWED_KEYS);

  const vaultRef = await admin.firestore().collection('reality_vault').add({
    ...vaultPayload,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await ref.delete();
  return { vaultMetadataId: vaultRef.id };
}

export async function rejectWeaverPending(uid: string, pendingId: string): Promise<void> {
  const { ref } = await assertPendingOwner(uid, pendingId);
  await ref.delete();
}

export async function listPendingWeaverForUser(uid: string, limit = 20) {
  const snap = await admin
    .firestore()
    .collection(WEAVER_PENDING_COLLECTION)
    .where('ownerId', '==', uid)
    .where('status', '==', 'pending')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
