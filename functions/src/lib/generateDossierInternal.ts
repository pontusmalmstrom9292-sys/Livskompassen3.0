import * as admin from 'firebase-admin';
import { randomUUID } from 'crypto';
import { isParentVisibleChildLog } from './childObservationEpistemics';
import {
  buildCanonicalString,
  computeDocumentHash,
  sha256Hex,
  toCanonicalEntry,
  type CanonicalDossierEntry,
  type DossierCollection,
} from './dossierCanonicalHash';
import { buildDossierPdf } from './dossierPdf';
import { generateDossierAiForeword, type DossierAiForewordResult } from './dossierAiForeword';
import {
  PATTERN_SCAN_METADATA_COLLECTION,
} from './patternScanMetadata';

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
  techniqueFilter?: string[];
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
  /** P6 — AI-försätt + tidslinje (utanför documentHash). */
  aiForeword?: DossierAiForewordResult;
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

function docDayInRange(createdAtIso: string, dateFrom: string, dateTo: string): boolean {
  const day = createdAtIso.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  return day >= dateFrom && day <= dateTo;
}

async function fetchOwnedDoc(
  uid: string,
  collection: DossierCollection,
  docId: string,
  dateFrom?: string,
  dateTo?: string,
): Promise<CanonicalDossierEntry | null> {
  const snap = await admin.firestore().collection(collection).doc(docId).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  const ownerId = String(data.ownerId ?? data.userId ?? '');
  if (ownerId !== uid) return null;
  if (collection === 'children_logs' && !isParentVisibleChildLog(data)) return null;
  const entry = toCanonicalEntry(collection, snap.id, data);
  if (dateFrom && dateTo && !docDayInRange(entry.createdAt, dateFrom, dateTo)) {
    throw new Error(
      `Dokument utanför valt datumintervall: ${collection}/${docId} (${entry.createdAt.slice(0, 10)} ∉ ${dateFrom}–${dateTo}).`,
    );
  }
  return entry;
}

async function fetchVaultPatternContext(
  uid: string,
  vaultIds: string[],
): Promise<{
  techniquesByDocId: Map<string, string[]>;
  tacticSummary: { technique: string; count: number }[];
}> {
  const techniquesByDocId = new Map<string, string[]>();
  const counts = new Map<string, number>();
  if (vaultIds.length === 0) {
    return { techniquesByDocId, tacticSummary: [] };
  }

  for (const sourceRef of vaultIds) {
    const snap = await admin
      .firestore()
      .collection(PATTERN_SCAN_METADATA_COLLECTION)
      .where('sourceRef', '==', sourceRef)
      .get();
    const techniques = new Set<string>();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (String(data.userId ?? data.ownerId ?? '') !== uid) continue;
      for (const t of data.techniques ?? []) {
        const key = String(t);
        techniques.add(key);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    if (techniques.size > 0) {
      techniquesByDocId.set(sourceRef, [...techniques]);
    }
  }

  const tacticSummary = [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([technique, count]) => ({ technique, count }));

  return { techniquesByDocId, tacticSummary };
}

export async function generateDossierInternal(
  uid: string,
  raw: GenerateDossierInput,
  geminiApiKey?: string,
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
      const entry = await fetchOwnedDoc(uid, collection, docId, dateFrom, dateTo);
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
  const { techniquesByDocId, tacticSummary } = await fetchVaultPatternContext(
    uid,
    includedDocIds.reality_vault,
  );

  let aiForeword: DossierAiForewordResult | undefined;
  if (includeAiForeword) {
    aiForeword = await generateDossierAiForeword(
      entries,
      dateFrom,
      dateTo,
      reportType,
      geminiApiKey,
      {
        techniquesByDocId,
        tacticSummary: tacticSummary.length > 0 ? tacticSummary : undefined,
      },
    );
  }

  const pdfBytes = await buildDossierPdf({
    dossierId,
    documentHash,
    generatedAtIso,
    reportType,
    dateFrom,
    dateTo,
    includeAiForeword,
    aiForeword,
    entries,
    tacticSummary: tacticSummary.length > 0 ? tacticSummary : undefined,
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
      aiForewordGenerated: Boolean(aiForeword),
      timelineRowCount: aiForeword?.timeline.length ?? 0,
      categoryFilter: raw.categoryFilter ?? [],
      techniqueFilter: raw.techniqueFilter ?? [],
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
    ...(aiForeword ? { aiForeword } : {}),
  };
}
