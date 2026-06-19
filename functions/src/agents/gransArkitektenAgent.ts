import type { DcapResult } from './DCAP';
import { GRANS_ARKITEKTEN_SYSTEM_PROMPT } from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';

const GRANS_MODEL = 'gemini-2.5-flash';

export interface GransArkitektenResult {
  cleanFacts: string[];
  emotionalBait: string[];
  greyRockReply: string;
  techniques: string[];
  coachingNote: string;
  /** LLM-förslag — kod i resolveHamnTheoryWithoutEvidence vinner vid konflikt. */
  theoryWithoutEvidence?: boolean;
}

export function parseGransJson(raw: string, dcap: DcapResult): GransArkitektenResult {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned) as GransArkitektenResult & { theoryWithoutEvidence?: boolean };
    if (typeof parsed.greyRockReply !== 'string') return buildFallback(dcap);
    return {
      cleanFacts: Array.isArray(parsed.cleanFacts) ? parsed.cleanFacts.map(String).slice(0, 5) : [],
      emotionalBait: Array.isArray(parsed.emotionalBait)
        ? parsed.emotionalBait.map(String).slice(0, 5)
        : [],
      greyRockReply: parsed.greyRockReply.trim(),
      techniques: Array.isArray(parsed.techniques) ? parsed.techniques.map(String).slice(0, 6) : [],
      coachingNote:
        typeof parsed.coachingNote === 'string' ? parsed.coachingNote.trim() : '',
      theoryWithoutEvidence: parsed.theoryWithoutEvidence === true ? true : undefined,
    };
  } catch {
    return buildFallback(dcap);
  }
}

function buildFallback(dcap: DcapResult): GransArkitektenResult {
  const techniques = dcap.detections.map((d) => d.technique);
  return {
    cleanFacts: ['Extrahera logistik manuellt från meddelandet.'],
    emotionalBait: ['Ignorera känslomässiga beten och anklagelser.'],
    greyRockReply:
      dcap.greyRockResponse?.trim() ||
      'Tack för informationen. Jag återkommer vid behov av logistik.',
    techniques: techniques.length > 0 ? techniques : ['UNKNOWN'],
    coachingNote: 'Svara kort. Ingen JADE.',
  };
}

/** G14 — strukturerad Gräns-Arkitekten (Brusfilter + BIFF) med DCAP-kontext. */
export async function askGransArkitekten(
  message: string,
  dcap: DcapResult,
  geminiApiKey?: string
): Promise<GransArkitektenResult> {
  const detectionSummary =
    dcap.detections.length > 0
      ? dcap.detections.map((d) => `${d.technique} (${d.confidence})`).join(', ')
      : 'inga';

  const prompt = `Meddelande från motpart:
${message}

DCAP: riskScore=${dcap.riskScore}, recommendedAction=${dcap.recommendedAction}
Detektioner: ${detectionSummary}
${dcap.greyRockResponse ? `DCAP greyRock-förslag: ${dcap.greyRockResponse}` : ''}

Returnera JSON enligt systeminstruktion.`;

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: GRANS_MODEL,
      contents: prompt,
      config: {
        systemInstruction: GRANS_ARKITEKTEN_SYSTEM_PROMPT,
        temperature: 0.12,
        maxOutputTokens: 700,
      },
    });

    const raw = response.text ?? '';
    const parsed = parseGransJson(raw, dcap);
    if (!parsed.greyRockReply) return buildFallback(dcap);
    return parsed;
  } catch (error) {
    console.error('[GransArkitekten] LLM fel — fallback:', error);
    return buildFallback(dcap);
  }
}
