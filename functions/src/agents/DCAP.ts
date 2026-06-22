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
 *  - Lager 2 (Djup/Semantisk): Vertex AI (Gemini) för kontextuell analys av implicita mönster.
 *  - Åtgärd: Returnerar en DcapResult med risknivå och föreslaget Grey Rock-svar.
 */

import { genkit, z } from 'genkit';
import { vertexAI, gemini15Flash } from '@genkit-ai/vertexai';
import { DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT } from '../sharedRules';
import { scanTextForTactics, type VaultTechnique } from '../lib/tacticPatternLibrary';

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

const SemanticResponseSchema = z.object({
  technique: z.enum([
    'DARVO', 'GASLIGHTING', 'LOVE_BOMBING', 'SILENT_TREATMENT',
    'JADE_BAIT', 'THREAT', 'HOOVERING', 'SMEAR',
    'ECONOMIC_CONTROL', 'MATERNAL_FACADE', 'TRAUMA_BONDING',
    'LEGAL_PRESSURE', 'UNKNOWN'
  ]),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  riskScore: z.number().optional(),
  greyRockSuggestion: z.string().optional()
});

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

// --- Lager 2: Semantisk Analys via Vertex AI ---

async function runSemanticLayer(
  text: string,
  projectId: string
): Promise<{ detections: DcapDetection[]; score: number; greyRockResponse?: string }> {
  const ai = genkit({
    plugins: [vertexAI({ projectId, location: 'europe-west1' })],
  });

  const { output } = await ai.generate({
    model: gemini15Flash,
    system: DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT,
    prompt: `Analysera denna text:\n\n"${text}"`,
    output: { schema: SemanticResponseSchema }
  });

  if (!output) {
    return { detections: [], score: 0 };
  }

  const detections: DcapDetection[] = output.technique !== 'UNKNOWN' ? [{
    technique: output.technique as ManipulationTechnique,
    matchedPattern: 'Semantisk analys',
    confidence: output.confidence ?? 'LOW',
    layer: 'SEMANTIC',
  }] : [];

  return {
    detections,
    score: output.riskScore ?? 0,
    greyRockResponse: output.greyRockSuggestion,
  };
}

// --- Huvud-API ---

/**
 * Kör hela DCAP-pipelinen (Regex + Semantisk) mot given text.
 * @param text Texten som ska analyseras (t.ex. ett mottaget SMS).
 * @param projectId GCP-projekt-ID.
 */
export async function analyzeDcap(text: string, projectId: string): Promise<DcapResult> {
  const regexResult = runRegexLayer(text);
  let semanticResult: Awaited<ReturnType<typeof runSemanticLayer>> = {
    detections: [],
    score: 0,
  };
  try {
    semanticResult = await runSemanticLayer(text, projectId);
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
