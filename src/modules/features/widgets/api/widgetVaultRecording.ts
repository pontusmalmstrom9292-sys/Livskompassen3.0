import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';
import { ensureVaultWriteReady } from '@/core/security/vaultWriteUnlock';
import { storageInboxSourceRef } from '@/core/firebase/inboxSourceRef';
import { uploadDiscreetRecording } from '@/core/firebase/storage';

export type WidgetRecordingAnalysis = {
  title: string;
  summary: string;
  category: string;
};

export type WidgetRecordingMetadata = {
  vem: string;
  vad: string;
  varfor: string;
};

export type PreparedWidgetRecording = {
  analysis: WidgetRecordingAnalysis;
  evidenceUrl: string;
  storagePath: string;
  sourceRef: string;
  recordedAtIso: string;
  transcript: string;
  durationSeconds?: number;
};

export type WidgetRecordingLockResult = {
  action: 'persisted' | 'queued';
  collection?: string;
  docId?: string;
  vaultId?: string;
  queueId?: string;
  title: string;
  summary: string;
};

type WidgetAnalyzeResponse = WidgetRecordingAnalysis;

type WidgetCommitResponse = WidgetRecordingAnalysis & {
  action: 'persisted' | 'queued';
  collection?: string;
  docId?: string;
  queueId?: string;
};

const analyzeCallable = httpsCallable<
  { transcript: string; recordedAt: string; durationSeconds?: number },
  WidgetAnalyzeResponse
>(functions, 'ingestWidgetRecording');

const commitCallable = httpsCallable<
  {
    commit: true;
    transcript: string;
    recordedAt: string;
    durationSeconds?: number;
    evidenceUrl: string;
    sourceRef: string;
    storagePath: string;
    analysis: WidgetRecordingAnalysis;
    metadata: WidgetRecordingMetadata;
    vaultSessionToken?: string;
  },
  WidgetCommitResponse
>(functions, 'ingestWidgetRecording');

async function runAnalysis(
  transcript: string,
  recordedAt: Date,
  durationSeconds?: number,
): Promise<WidgetRecordingAnalysis> {
  const recordedAtIso = recordedAt.toISOString();
  try {
    const res = await analyzeCallable({
      transcript,
      recordedAt: recordedAtIso,
      durationSeconds,
    });
    const data = res.data;
    return {
      ...data,
      category: 'tyst_inspelning',
    };
  } catch {
    const stamp = recordedAt.toLocaleString('sv-SE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    return {
      title:
        words.length >= 3
          ? `${words.slice(0, 6).join(' ')} · ${stamp}`
          : `Anteckning ${stamp}`,
      summary: transcript.trim().slice(0, 2000) || `Ljud ${stamp}.`,
      category: 'tyst_inspelning',
    };
  }
}

/** Upload + analys — sparar inte i Valvet än (metadata-steg först). */
export async function prepareWidgetRecording(
  userId: string,
  file: File,
  transcript: string,
  recordedAt: Date,
  durationSeconds?: number,
): Promise<PreparedWidgetRecording> {
  const recordedAtIso = recordedAt.toISOString();
  const analysis = await runAnalysis(transcript, recordedAt, durationSeconds);
  const { storagePath, downloadUrl } = await uploadDiscreetRecording(
    userId,
    file,
    recordedAt,
    analysis.title,
  );
  const sourceRef = storageInboxSourceRef(storagePath);

  return {
    analysis,
    evidenceUrl: downloadUrl,
    storagePath,
    sourceRef,
    recordedAtIso,
    transcript,
    durationSeconds,
  };
}

/** Lås via DCAP-kedja (classify → routeInboxToWorm) efter vem/vad/varför. */
export async function lockWidgetRecordingToVault(
  _userId: string,
  prepared: PreparedWidgetRecording,
  metadata: WidgetRecordingMetadata,
): Promise<WidgetRecordingLockResult> {
  const unlock = await ensureVaultWriteReady();
  if (unlock.ok === false) {
    throw new Error(unlock.message);
  }

  const res = await commitCallable(
    withVaultSessionPayload({
      commit: true,
      transcript: prepared.transcript,
      recordedAt: prepared.recordedAtIso,
      durationSeconds: prepared.durationSeconds,
      evidenceUrl: prepared.evidenceUrl,
      sourceRef: prepared.sourceRef,
      storagePath: prepared.storagePath,
      analysis: prepared.analysis,
      metadata,
    }),
  );

  const data = res.data;
  const docId = data.docId;
  return {
    action: data.action,
    collection: data.collection,
    docId,
    vaultId: data.collection === 'reality_vault' ? docId : undefined,
    queueId: data.queueId,
    title: prepared.analysis.title,
    summary: prepared.analysis.summary,
  };
}

/** Legacy one-shot (anteckning utan metadata-steg). */
export async function ingestWidgetRecordingToVault(
  userId: string,
  file: File,
  transcript: string,
  recordedAt: Date,
  durationSeconds?: number,
): Promise<{ vaultId: string; analysis: WidgetRecordingAnalysis; queued?: boolean }> {
  const prepared = await prepareWidgetRecording(userId, file, transcript, recordedAt, durationSeconds);
  const result = await lockWidgetRecordingToVault(userId, prepared, {
    vem: '',
    vad: '',
    varfor: '',
  });
  const vaultId = result.vaultId ?? result.docId ?? result.queueId ?? '';
  return {
    vaultId,
    analysis: prepared.analysis,
    queued: result.action === 'queued',
  };
}
