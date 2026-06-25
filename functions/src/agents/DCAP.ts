/**
 * DCAP - Digital Conversation Analysis Pipeline
 * Livskompassen v2 - Fas 3, Steg 3.1
 *
 * En hybrid Regex + semantisk analys-motor för att identifiera narcissistiska
 * missbruksmönster (DARVO, gaslighting, JADE-triggers, stonewalling) i
 * text som skickas in av användaren för granskning.
 *
 * Arkitektur:
 *  - Lager 1 (Snabb/Deterministisk): Regelbaserade Regex-mönster för explicita indikatorer.
 *  - Lager 2 (Djup/Semantisk): Google AI (Gemini) för kontextuell analys av implicita mönster.
 *  - Åtgärd: Returnerar en DcapResult med risknivå och föreslaget Grey Rock-svar.
 */

import { createGenAI } from '../lib/genaiClient';
import { GEMINI_FLASH } from '../lib/modelRouter';
import { DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT } from '../sharedRules';
import { scanTextForTactics, type VaultTechnique } from '../lib/tacticPatternLibrary';
import {
  DCAP_SEMANTIC_RESPONSE_SCHEMA,
  parseDcapSemanticResponse,
} from '../schemas/dcapSemantic';

// --- Typer ---

export type ManipulationTechnique =
  | 'DARVO'
  | 'GASLIGHTING'
  | 'LOVE_BOMBING'
  | 'SILENT_TREATMENT'
  | 'JADE_BAIT'
  | 'THREAT'
  | 'HOOVERING'
  | 'SMEAR'
  | 'ECONOMIC_CONTROL'
  | 'MATERNAL_FACADE'
  | 'TRAUMA_BONDING'
  | 'LEGAL_PRESSURE'
  | 'UNKNOWN';

function vaultTechniqueToDcap(technique: VaultTechnique): ManipulationTechnique {
  return technique as ManipulationTechnique;
}

export interface DcapDetection {
  technique: ManipulationTechnique;
  matchedPattern: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  layer: 'REGEX' | 'SEMANTIC';
}

export interface DcapResult {
  riskScore: number;
  detections: DcapDetection[];
  greyRockResponse?: string;
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT';
}

// --- Lager 1: Regelbaserade Regex-mönster (kanon: shared/patterns) ---

function runRegexLayer(text: string): { detections: DcapDetection[]; score: number } {
  let score = 0;
  const detections: DcapDetection[] = [];
  const seen = new Set<string>();

  for (const match of scanTextForTactics(text)) {
    const key = `${match.technique}:${match.matchedText}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const weight = match.weight;
    score += weight;
    detections.push({
      technique: vaultTechniqueToDcap(match.technique),
      matchedPattern: match.matchedText,
      confidence: weight >= 35 ? 'HIGH' : 'MEDIUM',
      layer: 'REGEX',
    });
  }

  return { detections, score: Math.min(score, 60) };
}

// --- Lager 2: Semantisk analys via Google AI ---

async function runSemanticLayer(
  text: string,
): Promise<{ detections: DcapDetection[]; score: number; greyRockResponse?: string }> {
  const ai = createGenAI();
  const response = await ai.models.generateContent({
    model: GEMINI_FLASH,
    contents: `Analysera denna text:\n\n"${text}"`,
    config: {
      systemInstruction: DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT,
      temperature: 0.1,
      maxOutputTokens: 512,
      responseMimeType: 'application/json',
      responseSchema: DCAP_SEMANTIC_RESPONSE_SCHEMA,
    },
  });

  const raw = response.text?.trim() ?? '';
  if (!raw) {
    return { detections: [], score: 0 };
  }

  let parsed: ReturnType<typeof parseDcapSemanticResponse>;
  try {
    parsed = parseDcapSemanticResponse(JSON.parse(raw));
  } catch {
    return { detections: [], score: 0 };
  }

  if (!parsed) {
    return { detections: [], score: 0 };
  }

  const detections: DcapDetection[] =
    parsed.technique !== 'UNKNOWN'
      ? [
          {
            technique: parsed.technique as ManipulationTechnique,
            matchedPattern: 'Semantisk analys',
            confidence: parsed.confidence ?? 'LOW',
            layer: 'SEMANTIC',
          },
        ]
      : [];

  return {
    detections,
    score: parsed.riskScore ?? 0,
    greyRockResponse: parsed.greyRockSuggestion,
  };
}

// --- Huvud-API ---

/**
 * Kör hela DCAP-pipelinen (Regex + Semantisk) mot given text.
 * @param text Texten som ska analyseras (t.ex. ett mottaget SMS).
 * @param _projectId Legacy — ignoreras (Vertex borttagen).
 */
export async function analyzeDcap(text: string, _projectId?: string): Promise<DcapResult> {
  const regexResult = runRegexLayer(text);
  let semanticResult: Awaited<ReturnType<typeof runSemanticLayer>> = {
    detections: [],
    score: 0,
  };
  try {
    semanticResult = await runSemanticLayer(text);
  } catch (err) {
    console.warn('[DCAP] Semantic layer skipped (regex-only):', err);
  }

  const totalScore = Math.min(regexResult.score + semanticResult.score, 100);
  const allDetections = [...regexResult.detections, ...semanticResult.detections];

  let recommendedAction: DcapResult['recommendedAction'] = 'NONE';
  if (totalScore >= 70) recommendedAction = 'ALERT';
  else if (totalScore >= 30) recommendedAction = 'COACHING';

  return {
    riskScore: totalScore,
    detections: allDetections,
    greyRockResponse: semanticResult.greyRockResponse,
    recommendedAction,
  };
}
