import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createGenAI } from '../lib/genaiClient';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { assertVaultSession } from '../lib/vaultSessionGate';

const BRUSFILTER_MODEL = 'gemini-2.5-pro';

const BRUSFILTER_SYSTEM_INSTRUCTION = `Du är bearbetningskärnan i "P1 Brusfilter", en kognitiv sköld utformad för en konfliktfylld miljö med gemensamt föräldraskap. Ditt jobb är att fungera som en analytisk buffert med låg upphetsning. Slutanvändaren lider av svår trötthet och hypervaksamhet på grund av psykosocial stress; du måste skydda deras kognitiva bandbredd genom att skala bort all emotionell manipulation, gaslighting, projektioner och skuldbeläggning.

FÖRVÄNTAT JSON-SCHEMA FÖR INGÅNG: { "raw_input_text": "string" }

REGLER FÖR PIPELINEEXEKVERING:

DCAP-RISKKLASSIFICERING: Analysera inmatningstext för operativa risker, underliggande hot, passiv-aggressiva fällor eller eskalerande mönster. Tilldela en deterministisk riskpoäng (0–100). Om riskpoängen är >= 70, sätt recommended_action till "VARNING".

EX-BRUSFILTRERING: Extrahera administrativa, operativa eller logistiska fakta gällande barnen (datum, tider, platser). Avlägsna och kassera helt alla känslomässiga lockbeten, anklagelser, förolämpningar, historisk revisionism eller projektioner.

BIFF/GRÅSTENS SVARSGENERATOR: Formulera ett svar på svenska baserat strikt på BIFF-reglerna (Kort, Informativ, Vänlig, Fast). Max 2–3 korta meningar. Klinisk, affärsmässig ton. Ta ENDAST upp de logistiska fakta. Absolut INGEN JADE (Motivera, Argumentera, Försvara, Förklara).

OBLIGATORISKT JSON-SCHEMA FÖR UTMATNING: { "dcap_analysis": { "risk_score": number, "recommended_action": "INGEN" | "VARNING" }, "isolated_logistics": "string", "biff_draft_reply": "string" }`;

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
  return raw.replace(/```json\n?|\n?```/g, '').trim();
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

function parseBrusfilterResponse(raw: string): ProcessBrusfilterResult {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(stripJsonFences(raw)) as Record<string, unknown>;
  } catch {
    throw new HttpsError('internal', 'Brusfilter returnerade ogiltig JSON.');
  }

  const dcapRaw = parsed.dcap_analysis;
  if (!dcapRaw || typeof dcapRaw !== 'object') {
    throw new HttpsError('internal', 'Brusfilter-svar saknar dcap_analysis.');
  }

  const dcap = dcapRaw as Record<string, unknown>;
  const riskScore = clampRiskScore(dcap.risk_score);
  const recommendedAction = normalizeRecommendedAction(dcap.recommended_action, riskScore);

  const isolatedLogistics =
    typeof parsed.isolated_logistics === 'string' ? parsed.isolated_logistics.trim() : '';
  const biffDraftReply =
    typeof parsed.biff_draft_reply === 'string' ? parsed.biff_draft_reply.trim() : '';

  if (!biffDraftReply) {
    throw new HttpsError('internal', 'Brusfilter-svar saknar biff_draft_reply.');
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
 * DCAP + logistikextraktion + BIFF-utkast via gemini-2.5-pro.
 */
export const processBrusfilter = onCall(
  { region: 'europe-west1', memory: '512MiB', timeoutSeconds: 120 },
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
      const ai = createGenAI();
      const response = await ai.models.generateContent({
        model: BRUSFILTER_MODEL,
        contents: JSON.stringify({ raw_input_text: text }),
        config: {
          systemInstruction: BRUSFILTER_SYSTEM_INSTRUCTION,
          temperature: 0.1,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text ?? '';
      if (!raw.trim()) {
        throw new HttpsError('internal', 'Tomt svar från Brusfilter-modellen.');
      }

      const result = parseBrusfilterResponse(raw);
      console.log(
        `[processBrusfilter] uid=${uid} risk=${result.dcap_analysis.risk_score} action=${result.dcap_analysis.recommended_action}`,
      );
      return result;
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error('[processBrusfilter] Fel:', error);
      throw new HttpsError('internal', 'Brusfilter-bearbetning misslyckades. Försök igen.');
    }
  },
);
