import * as admin from 'firebase-admin';
import { requiresHumanReview, type InboxClassification } from './inboxClassifier';
import { persistKbDocFromDrive, type PersistKbDocInput } from './persistKbDoc';

const INBOX_QUEUE = 'inbox_queue';

export interface InboxQueueDoc {
  ownerId: string;
  userId: string;
  driveFileId: string;
  fileName: string;
  mimeType: string;
  proposedRouting: string;
  tags: string[];
  category: string;
  confidence: number;
  summary: string;
  traumaSensitive: boolean;
  rationale: string;
  analysisExcerpt: string;
  childAlias?: string | null;
  status: 'pending' | 'confirmed' | 'dismissed';
  persistedCollection?: string | null;
  persistedDocId?: string | null;
  createdAt?: FirebaseFirestore.Timestamp;
  reviewedAt?: FirebaseFirestore.Timestamp;
}

export async function persistInboxQueueItem(input: {
  ownerId: string;
  driveFileId: string;
  fileName: string;
  mimeType: string;
  classification: InboxClassification;
  analysisExcerpt: string;
  evidenceUrl?: string;
}): Promise<{ queueId: string; created: boolean }> {
  const db = admin.firestore();
  const existing = await db
    .collection(INBOX_QUEUE)
    .where('ownerId', '==', input.ownerId)
    .where('driveFileId', '==', input.driveFileId)
    .where('status', '==', 'pending')
    .limit(1)
    .get();

  if (!existing.empty) {
    return { queueId: existing.docs[0].id, created: false };
  }

  const docRef = await db.collection(INBOX_QUEUE).add({
    ownerId: input.ownerId,
    userId: input.ownerId,
    driveFileId: input.driveFileId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    proposedRouting: input.classification.routing,
    tags: input.classification.tags,
    category: input.classification.category,
    confidence: input.classification.confidence,
    summary: input.classification.summary,
    traumaSensitive: input.classification.traumaSensitive,
    rationale: input.classification.rationale,
    analysisExcerpt: input.analysisExcerpt.slice(0, 4000),
    childAlias: input.classification.childAlias ?? null,
    status: 'pending',
    persistedCollection: null,
    persistedDocId: null,
    evidenceUrl: input.evidenceUrl ?? null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { queueId: docRef.id, created: true };
}

export async function persistVaultFromInbox(input: {
  ownerId: string;
  fileName: string;
  driveFileId: string;
  mimeType: string;
  classification: InboxClassification;
  analysisText: string;
  evidenceUrl?: string;
}): Promise<{ docId: string; created: boolean }> {
  const db = admin.firestore();
  const existing = await db
    .collection('reality_vault')
    .where('ownerId', '==', input.ownerId)
    .where('driveFileId', '==', input.driveFileId)
    .limit(1)
    .get();

  if (!existing.empty) {
    return { docId: existing.docs[0].id, created: false };
  }

  const truth = [
    input.classification.summary,
    '',
    input.analysisText.slice(0, 8000),
  ]
    .join('\n')
    .trim();

  const docRef = await db.collection('reality_vault').add({
    userId: input.ownerId,
    ownerId: input.ownerId,
    category: input.classification.category,
    action: 'inbox_ingest',
    truth,
    driveFileId: input.driveFileId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    inboxTags: input.classification.tags,
    isLocked: true,
    ...(input.evidenceUrl ? { evidenceUrl: input.evidenceUrl } : {}),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { docId: docRef.id, created: true };
}

export async function persistChildrenLogFromInbox(input: {
  ownerId: string;
  driveFileId: string;
  fileName: string;
  classification: InboxClassification;
  analysisText: string;
}): Promise<{ docId: string; created: boolean } | null> {
  const childAlias = input.classification.childAlias;
  if (!childAlias) return null;

  const db = admin.firestore();
  const existing = await db
    .collection('children_logs')
    .where('ownerId', '==', input.ownerId)
    .where('driveFileId', '==', input.driveFileId)
    .limit(1)
    .get();

  if (!existing.empty) {
    return { docId: existing.docs[0].id, created: false };
  }

  const observation = input.classification.summary || input.analysisText.slice(0, 2000);
  const docRef = await db.collection('children_logs').add({
    userId: input.ownerId,
    ownerId: input.ownerId,
    childAlias,
    action: 'livslogg',
    observation,
    truth: observation,
    category: input.classification.category,
    driveFileId: input.driveFileId,
    source: 'inbox_ingest',
    inboxTags: input.classification.tags,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { docId: docRef.id, created: true };
}

export async function persistKunskapFromInbox(
  kbInput: PersistKbDocInput,
  classification: InboxClassification
): Promise<{ docId: string; created: boolean }> {
  return persistKbDocFromDrive({
    ...kbInput,
    inboxTags: classification.tags,
    inboxCategory: classification.category,
    proposedRouting: 'kunskap',
  });
}

export async function routeInboxToWorm(input: {
  ownerId: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  classification: InboxClassification;
  analysisText: string;
  optInTrauma?: boolean;
  evidenceUrl?: string;
}): Promise<{
  action: 'queued' | 'persisted';
  collection?: string;
  docId?: string;
  queueId?: string;
}> {
  const { classification, ownerId, fileId, fileName, mimeType, analysisText, optInTrauma, evidenceUrl } =
    input;

  // Manuellt val (tag: manuell) — requiresHumanReview returnerar false; routing följs direkt.
  if (requiresHumanReview(classification, optInTrauma)) {
    const queueClassification =
      classification.traumaSensitive && !optInTrauma
        ? { ...classification, routing: 'review' as const }
        : classification;
    const q = await persistInboxQueueItem({
      ownerId,
      driveFileId: fileId,
      fileName,
      mimeType,
      classification: queueClassification,
      analysisExcerpt: analysisText,
      evidenceUrl,
    });
    return { action: 'queued', queueId: q.queueId };
  }

  if (classification.routing === 'bevis') {
    const v = await persistVaultFromInbox({
      ownerId,
      fileName,
      driveFileId: fileId,
      mimeType,
      classification,
      analysisText,
      evidenceUrl,
    });
    return { action: 'persisted', collection: 'reality_vault', docId: v.docId };
  }

  if (classification.routing === 'barnen') {
    const child = await persistChildrenLogFromInbox({
      ownerId,
      driveFileId: fileId,
      fileName,
      classification,
      analysisText,
    });
    if (child) {
      return { action: 'persisted', collection: 'children_logs', docId: child.docId };
    }
    const q = await persistInboxQueueItem({
      ownerId,
      driveFileId: fileId,
      fileName,
      mimeType,
      classification: { ...classification, routing: 'review' },
      analysisExcerpt: analysisText,
      evidenceUrl,
    });
    return { action: 'queued', queueId: q.queueId };
  }

  let embeddingDim: number | undefined;
  try {
    const { generateEmbeddingInternal } = await import('./generateEmbeddingInternal');
    const embedding = await generateEmbeddingInternal(analysisText.slice(0, 4000));
    embeddingDim = embedding.length > 0 ? embedding.length : undefined;
  } catch {
    /* optional */
  }

  const k = await persistKunskapFromInbox(
    {
      ownerId,
      title: fileName,
      content: analysisText,
      driveFileId: fileId,
      mimeType,
      embeddingDim,
    },
    classification
  );
  return { action: 'persisted', collection: 'kb_docs', docId: k.docId };
}

export type InboxQueueItem = InboxQueueDoc & { id: string };

export async function listPendingInboxQueue(uid: string): Promise<InboxQueueItem[]> {
  const snap = await admin
    .firestore()
    .collection(INBOX_QUEUE)
    .where('ownerId', '==', uid)
    .where('status', '==', 'pending')
    .orderBy('createdAt', 'desc')
    .limit(30)
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ownerId: String(data.ownerId ?? ''),
      userId: String(data.userId ?? ''),
      driveFileId: String(data.driveFileId ?? ''),
      fileName: String(data.fileName ?? ''),
      mimeType: String(data.mimeType ?? ''),
      proposedRouting: String(data.proposedRouting ?? 'review'),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      category: String(data.category ?? ''),
      confidence: typeof data.confidence === 'number' ? data.confidence : 0,
      summary: String(data.summary ?? ''),
      traumaSensitive: data.traumaSensitive === true,
      rationale: String(data.rationale ?? ''),
      analysisExcerpt: String(data.analysisExcerpt ?? ''),
      childAlias: data.childAlias ? String(data.childAlias) : null,
      status: data.status as InboxQueueDoc['status'],
      persistedCollection: data.persistedCollection ?? null,
      persistedDocId: data.persistedDocId ?? null,
      createdAt: data.createdAt,
    };
  });
}

export async function confirmInboxQueueItem(input: {
  uid: string;
  queueId: string;
  routing: 'kunskap' | 'bevis' | 'barnen';
  childAlias?: string;
}): Promise<{ collection: string; docId: string }> {
  const ref = admin.firestore().collection(INBOX_QUEUE).doc(input.queueId);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new Error('Inbox-post saknas.');
  }
  const data = snap.data()!;
  if (data.ownerId !== input.uid) {
    throw new Error('Åtkomst nekad.');
  }
  if (data.status !== 'pending') {
    throw new Error('Posten är redan granskad.');
  }

  const classification: InboxClassification = {
    routing: input.routing,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: String(data.category ?? 'bekräftad'),
    confidence: 1,
    summary: String(data.summary ?? ''),
    traumaSensitive: false,
    childAlias: input.childAlias ?? (data.childAlias ? String(data.childAlias) : undefined),
    rationale: 'Bekräftad av användare (HITL).',
  };

  const analysisText = String(data.analysisExcerpt ?? data.summary ?? '');
  const routeResult = await routeInboxToWorm({
    ownerId: input.uid,
    fileId: String(data.driveFileId),
    fileName: String(data.fileName),
    mimeType: String(data.mimeType),
    classification,
    analysisText,
    optInTrauma: true,
  });

  if (routeResult.action !== 'persisted' || !routeResult.collection || !routeResult.docId) {
    throw new Error('Kunde inte persistera efter bekräftelse.');
  }

  await ref.update({
    status: 'confirmed',
    proposedRouting: input.routing,
    persistedCollection: routeResult.collection,
    persistedDocId: routeResult.docId,
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { collection: routeResult.collection, docId: routeResult.docId };
}

export async function dismissInboxQueueItem(uid: string, queueId: string): Promise<void> {
  const ref = admin.firestore().collection(INBOX_QUEUE).doc(queueId);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.ownerId !== uid) {
    throw new Error('Inbox-post saknas eller åtkomst nekad.');
  }
  await ref.update({
    status: 'dismissed',
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
