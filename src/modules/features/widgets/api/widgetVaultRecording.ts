import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { saveVaultLog } from '@/core/firebase/firestore';
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

const ingestCallable = httpsCallable<
  { transcript: string; recordedAt: string; durationSeconds?: number },
  WidgetRecordingAnalysis
>(functions, 'ingestWidgetRecording');

function buildVaultTruth(
  analysis: WidgetRecordingAnalysis,
  transcript: string,
  recordedAt: string,
  evidenceUrl: string,
  durationSeconds?: number,
  metadata?: WidgetRecordingMetadata,
): string {
  const lines = [
    `TITEL: ${analysis.title}`,
    `SAMMANFATTNING:`,
    analysis.summary,
    '',
    `INSPELAD: ${recordedAt}`,
  ];
  if (durationSeconds != null) lines.push(`LÄNGD_SEK: ${durationSeconds}`);
  if (metadata) {
    const vem = metadata.vem.trim();
    const vad = metadata.vad.trim();
    const varfor = metadata.varfor.trim();
    if (vem || vad || varfor) {
      lines.push('', 'KONTEXT (efter inspelning):');
      if (vem) lines.push(`VEM: ${vem}`);
      if (vad) lines.push(`VAD: ${vad}`);
      if (varfor) lines.push(`VARFÖR: ${varfor}`);
    }
  }
  lines.push('', 'TRANSKRIPT:', transcript.trim() || '(ingen transkription — se ljudfil)', '', `FIL: ${evidenceUrl}`);
  return lines.join('\n');
}

async function runAnalysis(
  transcript: string,
  recordedAt: Date,
  durationSeconds?: number,
): Promise<WidgetRecordingAnalysis> {
  const recordedAtIso = recordedAt.toISOString();
  try {
    const res = await ingestCallable({
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

/** Lås i Valvet efter vem/vad/varför (WORM). */
export async function lockWidgetRecordingToVault(
  userId: string,
  prepared: PreparedWidgetRecording,
  metadata: WidgetRecordingMetadata,
): Promise<string> {
  const truth = buildVaultTruth(
    prepared.analysis,
    prepared.transcript,
    prepared.recordedAtIso,
    prepared.evidenceUrl,
    prepared.durationSeconds,
    metadata,
  );

  return saveVaultLog(userId, {
    action: `widget_inspelning: ${prepared.analysis.title.slice(0, 80)}`,
    category: 'tyst_inspelning',
    truth,
    evidenceUrl: prepared.evidenceUrl,
    sourceRef: prepared.sourceRef,
    entryType: 'simple',
  });
}

/** Legacy one-shot (anteckning utan metadata-steg). */
export async function ingestWidgetRecordingToVault(
  userId: string,
  file: File,
  transcript: string,
  recordedAt: Date,
  durationSeconds?: number,
): Promise<{ vaultId: string; analysis: WidgetRecordingAnalysis }> {
  const prepared = await prepareWidgetRecording(userId, file, transcript, recordedAt, durationSeconds);
  const vaultId = await lockWidgetRecordingToVault(userId, prepared, {
    vem: '',
    vad: '',
    varfor: '',
  });
  return { vaultId, analysis: prepared.analysis };
}
