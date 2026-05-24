import { httpsCallable } from 'firebase/functions';
import { functions } from '../../core/firebase/init';
import { saveVaultLog } from '../../core/firebase/firestore';
import { uploadDiscreetRecording } from '../../core/firebase/storage';

export type WidgetRecordingAnalysis = {
  title: string;
  summary: string;
  category: string;
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
): string {
  const lines = [
    `TITEL: ${analysis.title}`,
    `SAMMANFATTNING:`,
    analysis.summary,
    '',
    `INSPELAD: ${recordedAt}`,
  ];
  if (durationSeconds != null) lines.push(`LÄNGD_SEK: ${durationSeconds}`);
  lines.push('', 'TRANSKRIPT:', transcript.trim() || '(ingen transkription — se ljudfil)', '', `FIL: ${evidenceUrl}`);
  return lines.join('\n');
}

export async function ingestWidgetRecordingToVault(
  userId: string,
  file: File,
  transcript: string,
  recordedAt: Date,
  durationSeconds?: number,
): Promise<{ vaultId: string; analysis: WidgetRecordingAnalysis }> {
  const recordedAtIso = recordedAt.toISOString();

  let analysis: WidgetRecordingAnalysis;
  try {
    const res = await ingestCallable({
      transcript,
      recordedAt: recordedAtIso,
      durationSeconds,
    });
    analysis = res.data;
  } catch {
    const stamp = recordedAt.toLocaleString('sv-SE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    analysis = {
      title:
        words.length >= 3
          ? `${words.slice(0, 6).join(' ')} · ${stamp}`
          : `Inspelning ${stamp}`,
      summary:
        transcript.trim().slice(0, 2000) ||
        `Ljudinspelning ${stamp}.`,
      category: 'tyst_inspelning',
    };
  }

  const evidenceUrl = await uploadDiscreetRecording(
    userId,
    file,
    recordedAt,
    analysis.title,
  );

  const truth = buildVaultTruth(
    analysis,
    transcript,
    recordedAtIso,
    evidenceUrl,
    durationSeconds,
  );

  const vaultId = await saveVaultLog(userId, {
    action: `widget_inspelning: ${analysis.title.slice(0, 80)}`,
    category: analysis.category || 'tyst_inspelning',
    truth,
    evidenceUrl,
    entryType: 'simple',
  });

  return { vaultId, analysis };
}
