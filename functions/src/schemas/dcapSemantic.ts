/** DCAP semantisk lager — Gemini responseSchema + validator. */

export const DCAP_SEMANTIC_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    technique: {
      type: 'string',
      enum: [
        'DARVO',
        'GASLIGHTING',
        'LOVE_BOMBING',
        'SILENT_TREATMENT',
        'JADE_BAIT',
        'THREAT',
        'HOOVERING',
        'SMEAR',
        'ECONOMIC_CONTROL',
        'MATERNAL_FACADE',
        'TRAUMA_BONDING',
        'LEGAL_PRESSURE',
        'UNKNOWN',
      ],
    },
    confidence: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
    riskScore: { type: 'number' },
    greyRockSuggestion: { type: 'string' },
  },
  required: ['technique'],
} as const;

export interface DcapSemanticResponse {
  technique: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore?: number;
  greyRockSuggestion?: string;
}

const TECHNIQUES = new Set<string>(DCAP_SEMANTIC_RESPONSE_SCHEMA.properties.technique.enum);
const CONFIDENCE = new Set(['HIGH', 'MEDIUM', 'LOW']);

export function parseDcapSemanticResponse(value: unknown): DcapSemanticResponse | null {
  if (!value || typeof value !== 'object') return null;
  const o = value as Record<string, unknown>;
  if (typeof o.technique !== 'string' || !TECHNIQUES.has(o.technique)) return null;
  const confidence =
    typeof o.confidence === 'string' && CONFIDENCE.has(o.confidence)
      ? (o.confidence as DcapSemanticResponse['confidence'])
      : undefined;
  const riskScore = typeof o.riskScore === 'number' ? o.riskScore : undefined;
  const greyRockSuggestion =
    typeof o.greyRockSuggestion === 'string' ? o.greyRockSuggestion : undefined;
  return { technique: o.technique, confidence, riskScore, greyRockSuggestion };
}
