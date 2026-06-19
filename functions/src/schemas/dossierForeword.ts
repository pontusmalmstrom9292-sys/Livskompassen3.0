/** P1 flow_dossier_foreword — Gemini responseSchema + validators. */

export const DOSSIER_FOREWORD_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    foreword: { type: 'string' },
    timeline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          fact: { type: 'string' },
          sourceRef: { type: 'string' },
        },
        required: ['date', 'fact'],
      },
    },
  },
  required: ['foreword', 'timeline'],
} as const;

export interface DossierTimelineRow {
  date: string;
  fact: string;
  sourceRef?: string;
}

export interface DossierForewordResponse {
  foreword: string;
  timeline: DossierTimelineRow[];
}

export function validateDossierForewordResponse(value: unknown): DossierForewordResponse | null {
  if (!value || typeof value !== 'object') return null;
  const o = value as Record<string, unknown>;
  if (typeof o.foreword !== 'string') return null;
  if (!Array.isArray(o.timeline)) return null;
  const timeline: DossierTimelineRow[] = [];
  for (const row of o.timeline.slice(0, 12)) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    if (typeof r.date !== 'string' || typeof r.fact !== 'string') continue;
    timeline.push({
      date: r.date.slice(0, 32),
      fact: r.fact.slice(0, 500),
      sourceRef: typeof r.sourceRef === 'string' ? r.sourceRef.slice(0, 80) : undefined,
    });
  }
  return { foreword: o.foreword.slice(0, 4000), timeline };
}
