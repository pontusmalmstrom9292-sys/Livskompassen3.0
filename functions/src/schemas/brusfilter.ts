/** P1 flow_brusfilter — Gemini responseSchema + input/output validators. */

export const BRUSFILTER_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    dcap_analysis: {
      type: 'object',
      properties: {
        risk_score: { type: 'number' },
        recommended_action: { type: 'string', enum: ['INGEN', 'VARNING'] },
      },
      required: ['risk_score', 'recommended_action'],
    },
    isolated_logistics: { type: 'string' },
    biff_draft_reply: { type: 'string' },
  },
  required: ['dcap_analysis', 'isolated_logistics', 'biff_draft_reply'],
} as const;

export type BrusfilterRecommendedAction = 'INGEN' | 'VARNING';

export interface BrusfilterResponse {
  dcap_analysis: {
    risk_score: number;
    recommended_action: BrusfilterRecommendedAction;
  };
  isolated_logistics: string;
  biff_draft_reply: string;
}

export function validateBrusfilterResponse(value: unknown): BrusfilterResponse | null {
  if (!value || typeof value !== 'object') return null;
  const o = value as Record<string, unknown>;
  const dcap = o.dcap_analysis;
  if (!dcap || typeof dcap !== 'object') return null;
  const d = dcap as Record<string, unknown>;
  const risk = d.risk_score;
  const action = d.recommended_action;
  if (typeof risk !== 'number' || !Number.isFinite(risk)) return null;
  if (action !== 'INGEN' && action !== 'VARNING') return null;
  if (typeof o.isolated_logistics !== 'string') return null;
  if (typeof o.biff_draft_reply !== 'string') return null;
  return {
    dcap_analysis: {
      risk_score: Math.min(100, Math.max(0, risk)),
      recommended_action: action,
    },
    isolated_logistics: o.isolated_logistics,
    biff_draft_reply: o.biff_draft_reply,
  };
}
