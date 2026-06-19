import type { WidgetRecordingAnalysis } from './widgetRecordingAnalyze';

export type WidgetRecordingMetadata = {
  vem: string;
  vad: string;
  varfor: string;
};

/** Samma struktur som klient buildVaultTruth — WORM truth för widget commit. */
export function buildWidgetVaultTruth(input: {
  analysis: WidgetRecordingAnalysis;
  transcript: string;
  recordedAtIso: string;
  evidenceUrl: string;
  durationSeconds?: number;
  metadata?: WidgetRecordingMetadata;
}): string {
  const lines = [
    `TITEL: ${input.analysis.title}`,
    'SAMMANFATTNING:',
    input.analysis.summary,
    '',
    `INSPELAD: ${input.recordedAtIso}`,
  ];
  if (input.durationSeconds != null) lines.push(`LÄNGD_SEK: ${input.durationSeconds}`);
  if (input.metadata) {
    const vem = input.metadata.vem.trim();
    const vad = input.metadata.vad.trim();
    const varfor = input.metadata.varfor.trim();
    if (vem || vad || varfor) {
      lines.push('', 'KONTEXT (efter inspelning):');
      if (vem) lines.push(`VEM: ${vem}`);
      if (vad) lines.push(`VAD: ${vad}`);
      if (varfor) lines.push(`VARFÖR: ${varfor}`);
    }
  }
  lines.push(
    '',
    'TRANSKRIPT:',
    input.transcript.trim() || '(ingen transkription — se ljudfil)',
    '',
    `FIL: ${input.evidenceUrl}`,
  );
  return lines.join('\n');
}

/** Fail-closed — widget får inte auto-routas till kunskap i våg 2. */
export function blockWidgetKunskapRouting<T extends { routing: string; rationale: string }>(
  classification: T,
): T {
  if (classification.routing !== 'kunskap') return classification;
  return {
    ...classification,
    routing: 'bevis',
    rationale: `${classification.rationale} Widget våg 2 — ingen auto-kunskap → bevis.`,
  };
}
