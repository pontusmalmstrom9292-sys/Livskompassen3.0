/**
 * Companion voice upload — reuses Action Dashboard / Valv recording path.
 * ArrayBuffer in queue for IndexedDB durability (WIDGET_BIBLE 4.3).
 */

import { saveActionVaultRecording } from '@/features/widgets/api/actionDashboardApi';

export type CompanionVoicePayload = {
  kind: 'voice';
  mimeType: string;
  fileName: string;
  audioData: ArrayBuffer;
  recordedAtIso: string;
  durationSeconds?: number;
  transcript?: string;
  silent?: boolean;
  source?: string;
};

export async function blobToVoicePayload(
  blob: Blob,
  opts: {
    source: string;
    silent?: boolean;
    durationSeconds?: number;
    transcript?: string;
    recordedAt?: Date;
  },
): Promise<CompanionVoicePayload> {
  const recordedAt = opts.recordedAt ?? new Date();
  const mimeType = blob.type || 'audio/webm';
  const ext = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';
  const audioData = await blob.arrayBuffer();
  return {
    kind: 'voice',
    mimeType,
    fileName: `cw_voice_${recordedAt.getTime()}.${ext}`,
    audioData,
    recordedAtIso: recordedAt.toISOString(),
    durationSeconds: opts.durationSeconds,
    transcript: opts.transcript ?? '',
    silent: opts.silent,
    source: opts.source,
  };
}

export function isCompanionVoicePayload(payload: Record<string, unknown>): boolean {
  if (payload.kind === 'voice') return true;
  if (payload.audioData instanceof ArrayBuffer) return true;
  if (payload.blob instanceof Blob) return true;
  if (typeof payload.source === 'string' && payload.source.includes('voice') && payload.mimeType) {
    return Boolean(payload.audioData || payload.blob);
  }
  return false;
}

export async function uploadCompanionVoice(
  userId: string,
  payload: Record<string, unknown>,
): Promise<{ queued: boolean; id?: string; title?: string }> {
  const mimeType =
    typeof payload.mimeType === 'string' && payload.mimeType
      ? payload.mimeType
      : 'audio/webm';
  const fileName =
    typeof payload.fileName === 'string' && payload.fileName
      ? payload.fileName
      : `cw_voice_${Date.now()}.webm`;

  let blob: Blob | null = null;
  if (payload.audioData instanceof ArrayBuffer) {
    blob = new Blob([payload.audioData], { type: mimeType });
  } else if (ArrayBuffer.isView(payload.audioData)) {
    const view = payload.audioData;
    const copy = view.buffer.slice(
      view.byteOffset,
      view.byteOffset + view.byteLength,
    ) as ArrayBuffer;
    blob = new Blob([copy], { type: mimeType });
  } else if (payload.blob instanceof Blob) {
    blob = payload.blob;
  }

  if (!blob || blob.size < 1) {
    throw new Error('voice_payload_empty');
  }

  const file = new File([blob], fileName, { type: mimeType });
  const transcript = typeof payload.transcript === 'string' ? payload.transcript : '';
  const recordedAtIso =
    typeof payload.recordedAtIso === 'string' ? payload.recordedAtIso : new Date().toISOString();
  const durationSeconds =
    typeof payload.durationSeconds === 'number' && Number.isFinite(payload.durationSeconds)
      ? payload.durationSeconds
      : undefined;

  return saveActionVaultRecording(
    userId,
    file,
    transcript,
    new Date(recordedAtIso),
    durationSeconds,
  );
}
