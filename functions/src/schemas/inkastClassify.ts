/** P1 flow_inkast_classify — prompt-JSON shape + validators. */

export type InboxRouting =
  | 'kunskap'
  | 'bevis'
  | 'barnen'
  | 'dagbok'
  | 'review'
  | 'planning';

export interface InkastClassifyResponse {
  routing: InboxRouting;
  tags: string[];
  category: string;
  confidence: number;
  summary: string;
  traumaSensitive: boolean;
  childAlias?: string;
  rationale: string;
}

const ROUTINGS: InboxRouting[] = [
  'kunskap',
  'bevis',
  'barnen',
  'dagbok',
  'review',
  'planning',
];

export function validateInkastClassifyResponse(value: unknown): InkastClassifyResponse | null {
  if (!value || typeof value !== 'object') return null;
  const o = value as Record<string, unknown>;
  if (!ROUTINGS.includes(o.routing as InboxRouting)) return null;
  const confidence =
    typeof o.confidence === 'number' ? Math.min(1, Math.max(0, o.confidence)) : 0.5;
  return {
    routing: o.routing as InboxRouting,
    tags: Array.isArray(o.tags) ? o.tags.map(String).slice(0, 12) : [],
    category: typeof o.category === 'string' ? o.category.slice(0, 80) : 'okänd',
    confidence,
    summary:
      typeof o.summary === 'string' ? o.summary.slice(0, 400) : 'Ingen sammanfattning.',
    traumaSensitive: o.traumaSensitive === true,
    childAlias:
      typeof o.childAlias === 'string' && o.childAlias.trim()
        ? o.childAlias.trim().slice(0, 40)
        : undefined,
    rationale: typeof o.rationale === 'string' ? o.rationale.slice(0, 300) : '',
  };
}
