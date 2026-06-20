import * as admin from 'firebase-admin';
import { requiresHumanReview, type InboxClassification } from './inboxClassifier';
import { formatChildObservation, inferEpistemicKind } from './childObservationEpistemics';
import { persistKbDocFromDrive, type PersistKbDocInput } from './persistKbDoc';
import { isKunskapFactApproved } from './kunskapContentBankGate';
import { assertServerWormPayload, CHILDREN_LOG_ALLOWED_KEYS, driveInboxSourceRef, REALITY_VAULT_ALLOWED_KEYS } from './wormPayload';

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
  sourceRef?: string;
  action?: string;
  category?: string;
  truthOverride?: string;
}): Promise<{ docId: string; created: boolean }> {
  const db = admin.firestore();
  const sourceRef = input.sourceRef ?? driveInboxSourceRef(input.driveFileId);
  const existing = await db
    .collection('reality_vault')
    .where('ownerId', '==', input.ownerId)
    .where('sourceRef', '==', sourceRef)
    .limit(1)
    .get();

  if (!existing.empty) {
    return { docId: existing.docs[0].id, created: false };
  }

  const truth =
    input.truthOverride?.trim() ||
    [
      input.classification.summary,
      input.fileName ? `[${input.fileName}]` : '',
      '',
      input.analysisText.slice(0, 8000),
    ]
      .join('\n')
      .trim();

  const vaultPayload: Record<string, unknown> = {
    userId: input.ownerId,
    ownerId: input.ownerId,
    category: input.category ?? input.classification.category,
    action: input.action ?? 'inbox_ingest',
    truth,
    sourceRef,
    isLocked: true,
    ...(input.evidenceUrl ? { evidenceUrl: input.evidenceUrl } : {}),
  };

  assertServerWormPayload(vaultPayload, 'inboxPersist.reality_vault', REALITY_VAULT_ALLOWED_KEYS);

  const docRef = await db.collection('reality_vault').add({
    ...vaultPayload,
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
  sourceRef?: string;
}): Promise<{ docId: string; created: boolean } | null> {
  const childAlias = input.classification.childAlias;
  if (!childAlias) return null;

  const db = admin.firestore();
  const sourceRef = input.sourceRef ?? driveInboxSourceRef(input.driveFileId);

  const existingLog = await db
    .collection('children_logs')
    .where('ownerId', '==', input.ownerId)
    .where('sourceRef', '==', sourceRef)
    .limit(1)
    .get();

  if (!existingLog.empty) {
    return { docId: existingLog.docs[0].id, created: false };
  }

  const existingQueue = await db
    .collection(INBOX_QUEUE)
    .where('ownerId', '==', input.ownerId)
    .where('driveFileId', '==', input.driveFileId)
    .where('persistedCollection', '==', 'children_logs')
    .limit(1)
    .get();

  if (!existingQueue.empty) {
    const priorId = existingQueue.docs[0].data()?.persistedDocId;
    if (typeof priorId === 'string' && priorId) {
      return { docId: priorId, created: false };
    }
  }

  const rawObservation = input.classification.summary || input.analysisText.slice(0, 2000);
  const epistemicKind = inferEpistemicKind({ channel: 'inbox_ingest', category: input.classification.category });
  const observation = formatChildObservation(rawObservation, epistemicKind);
  const childPayload: Record<string, unknown> = {
    userId: input.ownerId,
    ownerId: input.ownerId,
    childAlias,
    action: 'livslogg',
    observation,
    truth: observation,
    category: input.classification.category,
    channel: 'inbox_ingest',
    sourceRef,
  };

  assertServerWormPayload(childPayload, 'inboxPersist.children_logs', CHILDREN_LOG_ALLOWED_KEYS);

  const docRef = await db.collection('children_logs').add({
    ...childPayload,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { docId: docRef.id, created: true };
}

const JOURNAL_CATEGORY_IDS = new Set([
  'tacksamhet',
  'orostanke',
  'relationer',
  'kropp',
  'vardag',
  'insikt',
]);

function mapInkastCategoryToJournal(category: string, tags: string[]): string {
  const normalized = category.trim().toLowerCase().replace(/^#/, '');
  if (JOURNAL_CATEGORY_IDS.has(normalized)) return normalized;

  const tagSet = tags.map((t) => t.trim().toLowerCase().replace(/^#/, ''));
  if (tagSet.includes('tacksamhet')) return 'tacksamhet';
  if (tagSet.includes('insikt') || tagSet.includes('reflektion')) return 'insikt';
  if (tagSet.includes('aterhamtning') || tagSet.includes('återhämtning')) return 'kropp';
  if (tagSet.includes('logistik')) return 'vardag';
  return 'vardag';
}

export async function persistJournalFromInbox(input: {
  ownerId: string;
  classification: InboxClassification;
  analysisText: string;
}): Promise<{ docId: string; created: boolean }> {
  const db = admin.firestore();
  const text = input.analysisText.slice(0, 50_000);
  const category = mapInkastCategoryToJournal(
    input.classification.category,
    input.classification.tags
  );
  const tags = input.classification.tags
    .filter((t) => t !== 'manuell')
    .map((t) => t.trim().slice(0, 48))
    .filter(Boolean)
    .slice(0, 12);

  const docRef = await db.collection('journal').add({
    userId: input.ownerId,
    ownerId: input.ownerId,
    mood: 'neutral',
    text,
    category,
    ...(tags.length ? { tags } : {}),
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

export async function persistPlaneringFromInbox(input: {
  ownerId: string;
  classification: InboxClassification;
  analysisText: string;
}): Promise<{ docId: string; created: boolean }> {
  const db = admin.firestore();
  
  const titleRaw = input.classification.summary || input.analysisText;
  const title = titleRaw.slice(0, 200).replace(/\n/g, ' ').trim() || 'Ny uppgift';
  
  const docRef = await db.collection('planning_tasks').add({
    userId: input.ownerId,
    ownerId: input.ownerId,
    title,
    summary: input.analysisText.slice(0, 5000),
    status: 'todo',
    source: 'manual',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { docId: docRef.id, created: true };
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
  hasVaultSession: boolean;
  isVerified: boolean;
  /** Explicit HITL eller manuellt barnen-val — annars köas barnen-routing. */
  allowBarnenAutoPersist?: boolean;
  /** Icke-Drive provenance (widget, inkast_lite, …). */
  sourceRef?: string;
  vaultAction?: string;
  vaultCategory?: string;
  truthOverride?: string;
}): Promise<{
  action: 'queued' | 'persisted';
  collection?: string;
  docId?: string;
  queueId?: string;
}> {
  const { classification, ownerId, fileId, fileName, mimeType, analysisText, optInTrauma, evidenceUrl, hasVaultSession, isVerified } =
    input;

  const isSensitiveRouting = classification.routing === 'bevis' || classification.routing === 'barnen' || classification.routing === 'dagbok';
  const needsQueueForVerification = isSensitiveRouting && !isVerified;
  const needsQueueForVault = classification.routing === 'bevis' && !hasVaultSession;

  // Manuellt val (tag: manuell) — requiresHumanReview returnerar false; routing följs direkt.
  if (requiresHumanReview(classification, optInTrauma) || needsQueueForVerification || needsQueueForVault) {
    const queueClassification = { ...classification };
    
    if (classification.traumaSensitive && !optInTrauma) {
      queueClassification.routing = 'review';
    } else if (needsQueueForVault || needsQueueForVerification) {
      // Behåll classification.routing men pusha till kön för att invänta autentisering/upplåsning
    }
    
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
      sourceRef: input.sourceRef,
      action: input.vaultAction,
      category: input.vaultCategory,
      truthOverride: input.truthOverride,
    });
    return { action: 'persisted', collection: 'reality_vault', docId: v.docId };
  }

  if (classification.routing === 'planning') {
    const task = await persistPlaneringFromInbox({
      ownerId,
      classification,
      analysisText,
    });
    return { action: 'persisted', collection: 'planning_tasks', docId: task.docId };
  }

  if (classification.routing === 'barnen') {
    if (!input.allowBarnenAutoPersist) {
      const q = await persistInboxQueueItem({
        ownerId,
        driveFileId: fileId,
        fileName,
        mimeType,
        classification,
        analysisExcerpt: analysisText,
        evidenceUrl,
      });
      return { action: 'queued', queueId: q.queueId };
    }

    const child = await persistChildrenLogFromInbox({
      ownerId,
      driveFileId: fileId,
      fileName,
      classification,
      analysisText,
      sourceRef: input.sourceRef,
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

  if (classification.routing === 'dagbok') {
    const journal = await persistJournalFromInbox({
      ownerId,
      classification,
      analysisText,
    });
    return { action: 'persisted', collection: 'journal', docId: journal.docId };
  }

  // Explicit kunskap guard — MUST NOT be reached by new routing values added later.
  if (classification.routing !== 'kunskap') {
    const q = await persistInboxQueueItem({
      ownerId,
      driveFileId: fileId,
      fileName,
      mimeType,
      classification: { ...classification, routing: 'review' },
      analysisExcerpt: analysisText,
      evidenceUrl,
    });
    console.warn(
      `[inboxPersist] Unhandled routing='${classification.routing}' → inbox_queue (fail-closed).`
    );
    return { action: 'queued', queueId: q.queueId };
  }

  // U6 content-bank gate — okänd FACT → HITL (P1.2)
  if (!isKunskapFactApproved(classification)) {
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

  // Ingest våg 1 — G10 kunskap default → kb_docs (kanon: rå Drive/Inkast; kampspar via journal_woven / ingestKampsparEntry)
  const title = (classification.summary || fileName).slice(0, 200).trim() || fileName;
  const kb = await persistKunskapFromInbox(
    {
      ownerId,
      title,
      content: analysisText.slice(0, 12_000),
      driveFileId: fileId,
      mimeType,
    },
    classification,
  );
  return { action: 'persisted', collection: 'kb_docs', docId: kb.docId };
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
  routing: 'kunskap' | 'bevis' | 'barnen' | 'dagbok' | 'planning';
  childAlias?: string;
  overrideTags?: string[];
  overrideCategory?: string;
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
    tags: input.overrideTags ?? (Array.isArray(data.tags) ? data.tags.map(String) : []),
    category: input.overrideCategory ?? String(data.category ?? 'bekräftad'),
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
    hasVaultSession: true,
    isVerified: true,
    allowBarnenAutoPersist: true,
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
    ...(input.overrideTags ? { tags: input.overrideTags } : {}),
    ...(input.overrideCategory ? { category: input.overrideCategory } : {}),
  });

  return { collection: routeResult.collection, docId: routeResult.docId };
}

export async function reprocessVaultInboxQueue(uid: string): Promise<{
  processed: number;
  results: Array<{ queueId: string; collection: string; docId: string }>;
}> {
  const pending = await listPendingInboxQueue(uid);
  const bevisPending = pending.filter((item) => item.proposedRouting === 'bevis');
  const results: Array<{ queueId: string; collection: string; docId: string }> = [];

  for (const item of bevisPending) {
    const persisted = await confirmInboxQueueItem({
      uid,
      queueId: item.id,
      routing: 'bevis',
    });
    results.push({ queueId: item.id, ...persisted });
  }

  return { processed: results.length, results };
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
