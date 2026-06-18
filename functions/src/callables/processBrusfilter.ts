import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createGenAI } from '../lib/genaiClient';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { assertVaultSession } from '../lib/vaultSessionGate';
import { geminiApiKey } from '../lib/geminiSecret';
import { adkOrchestrator } from '../adk';
import { emitSynapse } from '../adk/synapses/synapseBus';
import { hashPayload } from '../adk/stateStore';

const BRUSFILTER_MODEL = 'gemini-2.5-flash';

const BRUSFILTER_JSON_SCHEMA = {
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

const BRUSFILTER_SYSTEM_INSTRUCTION = `Du är P1 Brusfilter — lågaffektiv textnormalisering före evidensarkiv.

Returnera ENDAST giltig JSON (inga markdown-block) enligt schema:
{
  "dcap_analysis": { "risk_score": 0-100, "recommended_action": "INGEN" | "VARNING" },
  "isolated_logistics": "string — ren logistik/datum/plats, eller tom sträng om ingen finns",
  "biff_draft_reply": "string — kort BIFF/Grey Rock på svenska, 1-3 meningar, ingen JADE"
}

Regler:
- risk_score >= 70 → recommended_action "VARNING"
- Strippa anklagelser, gaslighting, känslomässiga lockbeten
- Om meddelandet saknar logistik: isolated_logistics = "" och biff_draft_reply = neutral bekräftelse utan försvar
- Inga diagnoser, inga partietiketter`;

export type BrusfilterRecommendedAction = 'INGEN' | 'VARNING';

export interface ProcessBrusfilterResult {
  dcap_analysis: {
    risk_score: number;
    recommended_action: BrusfilterRecommendedAction;
  };
  isolated_logistics: string;
  biff_draft_reply: string;
}

function stripJsonFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

/** Plocka första JSON-objektet om modellen lägger till brus före/efter. */
function extractJsonObject(raw: string): string {
  const cleaned = stripJsonFences(raw);
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
}

function normalizeRecommendedAction(
  value: unknown,
  riskScore: number,
): BrusfilterRecommendedAction {
  const normalized = String(value ?? '').trim().toUpperCase();
  if (normalized === 'ALERT' || normalized === 'VARNING' || riskScore >= 70) {
    return 'VARNING';
  }
  return 'INGEN';
}

function clampRiskScore(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function buildBrusfilterFallback(): ProcessBrusfilterResult {
  return {
    dcap_analysis: {
      risk_score: 40,
      recommended_action: 'INGEN',
    },
    isolated_logistics: 'Ingen operativ logistik identifierad i meddelandet.',
    biff_draft_reply:
      'Jag har tagit emot ditt meddelande. Jag återkommer vid behov av praktisk logistik.',
  };
}

function parseBrusfilterResponse(raw: string): ProcessBrusfilterResult {
  const jsonText = extractJsonObject(raw);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText) as Record<string, unknown>;
  } catch {
    console.warn('[processBrusfilter] Ogiltig JSON:', raw.slice(0, 280));
    return buildBrusfilterFallback();
  }

  const dcapRaw = parsed.dcap_analysis;
  if (!dcapRaw || typeof dcapRaw !== 'object') {
    console.warn('[processBrusfilter] Saknar dcap_analysis:', jsonText.slice(0, 280));
    return buildBrusfilterFallback();
  }

  const dcap = dcapRaw as Record<string, unknown>;
  const riskScore = clampRiskScore(dcap.risk_score);
  const recommendedAction = normalizeRecommendedAction(dcap.recommended_action, riskScore);

  const isolatedLogistics =
    typeof parsed.isolated_logistics === 'string' ? parsed.isolated_logistics.trim() : '';
  let biffDraftReply =
    typeof parsed.biff_draft_reply === 'string' ? parsed.biff_draft_reply.trim() : '';

  if (!biffDraftReply) {
    biffDraftReply = buildBrusfilterFallback().biff_draft_reply;
  }

  return {
    dcap_analysis: {
      risk_score: riskScore,
      recommended_action: recommendedAction,
    },
    isolated_logistics: isolatedLogistics,
    biff_draft_reply: biffDraftReply,
  };
}

/**
 * P1 Brusfilter — Valv-gated, read-only LLM-pipeline (ingen WORM-skrivning).
 */
export const processBrusfilter = onCall(
  {
    region: 'europe-west1',
    memory: '512MiB',
    timeoutSeconds: 120,
    secrets: [geminiApiKey],
  },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'processBrusfilter', 20);
    await assertVaultSession(uid, request.data);

    const rawInputText = (request.data as { raw_input_text?: unknown })?.raw_input_text;
    if (typeof rawInputText !== 'string' || rawInputText.trim().length === 0) {
      throw new HttpsError('invalid-argument', 'Fältet "raw_input_text" (string) krävs.');
    }

    const text = rawInputText.trim();
    if (text.length > 8000) {
      throw new HttpsError('invalid-argument', 'raw_input_text får vara max 8000 tecken.');
    }

    try {
      const ai = createGenAI(geminiApiKey.value());
      const response = await ai.models.generateContent({
        model: BRUSFILTER_MODEL,
        contents: `Meddelande att filtrera:\n${text}`,
        config: {
          systemInstruction: BRUSFILTER_SYSTEM_INSTRUCTION,
          temperature: 0.1,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
          responseSchema: BRUSFILTER_JSON_SCHEMA,
        },
      });

      const raw = response.text?.trim() ?? '';
      if (!raw) {
        console.warn('[processBrusfilter] Tomt LLM-svar — fallback');
        return buildBrusfilterFallback();
      }

      const result = parseBrusfilterResponse(raw);
      console.log(
        `[processBrusfilter] uid=${uid} risk=${result.dcap_analysis.risk_score} action=${result.dcap_analysis.recommended_action}`,
      );

      if (
        result.dcap_analysis.recommended_action === 'VARNING' ||
        result.dcap_analysis.risk_score >= 70
      ) {
        const inputHash = hashPayload({ text });
        await emitSynapse(adkOrchestrator, {
          trigger: 'dcap_alert',
          payload: {
            ownerId: uid,
            riskScore: result.dcap_analysis.risk_score,
            recommendedAction: 'ALERT',
            inputHash,
          },
        });
      }

      return result;
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error('[processBrusfilter] Fel:', error);
      return buildBrusfilterFallback();
    }
  },
);
