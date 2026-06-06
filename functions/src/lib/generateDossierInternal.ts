import * as admin from 'firebase-admin';
import { randomUUID } from 'crypto';
import {
  buildCanonicalString,
  computeDocumentHash,
  sha256Hex,
  toCanonicalEntry,
  type CanonicalDossierEntry,
  type DossierCollection,
} from './dossierCanonicalHash';
import { buildDossierPdf } from './dossierPdf';

const MAX_DOCS = 200;
const SIGNED_URL_TTL_MS = 24 * 60 * 60 * 1000;

export type GenerateDossierInput = {
  dateFrom: string;
  dateTo: string;
  sources: {
    reality_vault: boolean;
    children_logs: boolean;
    journal: boolean;
  };
  reportType: 'LEGAL' | 'BBIC';
  includeAiForeword: boolean;
  categoryFilter?: string[];
  includedDocIds: {
    reality_vault: string[];
    children_logs: string[];
    journal: string[];
  };
};

export type GenerateDossierResult = {
  dossierId: string;
  documentHash: string;
  downloadUrl?: string;
  /** Fallback när signed URL saknar IAM signBlob — klient laddar ner via blob. */
  pdfBase64?: string;
  status: 'ready' | 'pending';
  jobId?: string;
};

function assertIsoDate(value: unknown, field: string): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Ogiltigt ${field} (YYYY-MM-DD).`);
  }
  return value;
}

function assertIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === 'string' && id.length > 0);
}

async function fetchOwnedDoc(
  uid: string,
  collection: DossierCollection,
  docId: string,
): Promise<CanonicalDossierEntry | null> {
  const snap = await admin.firestore().collection(collection).doc(docId).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  const ownerId = String(data.ownerId ?? data.userId ?? '');
  if (ownerId !== uid) return null;
  if (collection === 'children_logs' && data.visibility === 'private_child') return null;
  return toCanonicalEntry(collection, snap.id, data);
}

export async function generateDossierInternal(
  uid: string,
  raw: GenerateDossierInput,
): Promise<GenerateDossierResult> {
  const dateFrom = assertIsoDate(raw.dateFrom, 'dateFrom');
  const dateTo = assertIsoDate(raw.dateTo, 'dateTo');
  if (dateFrom > dateTo) {
    throw new Error('dateFrom får inte vara efter dateTo.');
  }

  const includedDocIds = {
    reality_vault: assertIdList(raw.includedDocIds?.reality_vault),
    children_logs: assertIdList(raw.includedDocIds?.children_logs),
    journal: assertIdList(raw.includedDocIds?.journal),
  };

  const totalIds =
    includedDocIds.reality_vault.length +
    includedDocIds.children_logs.length +
    includedDocIds.journal.length;

  if (totalIds === 0) {
    throw new Error('Minst ett dokument måste inkluderas.');
  }
  if (totalIds > MAX_DOCS) {
    throw new Error(`Max ${MAX_DOCS} dokument per dossier.`);
  }

  const reportType = raw.reportType === 'BBIC' ? 'BBIC' : 'LEGAL';
  const includeAiForeword = Boolean(raw.includeAiForeword);

  const entries: CanonicalDossierEntry[] = [];

  const loadBatch = async (collection: DossierCollection, ids: string[]) => {
    for (const docId of ids) {
      const entry = await fetchOwnedDoc(uid, collection, docId);
      if (!entry) {
        throw new Error(`Dokument saknas eller tillhör inte dig: ${collection}/${docId}`);
      }
      entries.push(entry);
    }
  };

  await loadBatch('reality_vault', includedDocIds.reality_vault);
  await loadBatch('children_logs', includedDocIds.children_logs);
  await loadBatch('journal', includedDocIds.journal);

  const documentHash = computeDocumentHash(entries);
  const dossierId = randomUUID();
  const generatedAtIso = new Date().toISOString();

  const pdfBytes = await buildDossierPdf({
    dossierId,
    documentHash,
    generatedAtIso,
    reportType,
    dateFrom,
    dateTo,
    includeAiForeword,
    entries,
  });

  const pdfFileHash = sha256Hex(buildCanonicalString(entries) + `:pdf:${pdfBytes.length}`);
  const storagePath = `dossier_exports/${uid}/${dossierId}.pdf`;
  const bucket = admin.storage().bucket();
  const file = bucket.file(storagePath);

  await file.save(Buffer.from(pdfBytes), {
    contentType: 'application/pdf',
    metadata: {
      metadata: {
        dossierId,
        documentHash,
        ownerId: uid,
      },
    },
  });

  let downloadUrl: string | undefined;
  let pdfBase64: string | undefined;
  try {
    const [signed] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + SIGNED_URL_TTL_MS,
    });
    downloadUrl = signed;
  } catch (signErr) {
    console.warn(
      '[generateDossier] Signed URL misslyckades — returnerar pdfBase64 fallback:',
      signErr,
    );
    pdfBase64 = Buffer.from(pdfBytes).toString('base64');
  }

  const downloadUrlExpiresAt = admin.firestore.Timestamp.fromMillis(
    Date.now() + SIGNED_URL_TTL_MS,
  );

  await admin.firestore().collection('dossier_snapshots').doc(dossierId).set({
    ownerId: uid,
    userId: uid,
    dossierId,
    parameters: {
      dateFrom,
      dateTo,
      sources: raw.sources ?? {},
      reportType,
      includeAiForeword,
      categoryFilter: raw.categoryFilter ?? [],
    },
    includedDocIds,
    documentHash,
    pdfFileHash,
    status: 'ready',
    storagePath,
    downloadUrlExpiresAt,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(
    `[generateDossier] uid=${uid} dossierId=${dossierId} docs=${totalIds} hash=${documentHash.slice(0, 12)}…`,
  );

  return {
    dossierId,
    documentHash,
    downloadUrl,
    pdfBase64,
    status: 'ready',
  };
}
