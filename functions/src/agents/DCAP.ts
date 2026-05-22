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

import { VertexAI } from '@google-cloud/vertexai';

// --- Typer ---

export type ManipulationTechnique =
  | 'DARVO'          // Deny, Attack, Reverse Victim and Offender
  | 'GASLIGHTING'    // Ifrågasätter offrets verklighetsbild
  | 'LOVE_BOMBING'   // Överdrivet beröm för att manipulera
  | 'SILENT_TREATMENT' // Stonewalling / Tystnadstraff
  | 'JADE_BAIT'      // Försöker trigga Justify, Argue, Defend, Explain
  | 'THREAT'         // Direkta eller indirekta hot
  | 'UNKNOWN';

export interface DcapDetection {
  technique: ManipulationTechnique;
  matchedPattern: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  layer: 'REGEX' | 'SEMANTIC';
}

export interface DcapResult {
  riskScore: number; // 0 (ingen risk) till 100 (extrem risk)
  detections: DcapDetection[];
  greyRockResponse?: string; // Föreslaget neutralt svar
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT';
}

// --- Lager 1: Regelbaserade Regex-mönster ---

const REGEX_PATTERNS: { pattern: RegExp; technique: ManipulationTechnique; weight: number }[] = [
  // DARVO: Förnekande och reversal av offer/förövare
  { pattern: /du är alltid så (känslig|dramatisk|överdriftig)/i, technique: 'DARVO', weight: 30 },
  { pattern: /du hittar på (allting|det där|det)/i, technique: 'GASLIGHTING', weight: 35 },
  { pattern: /det har aldrig (hänt|sagts|gjorts)/i, technique: 'GASLIGHTING', weight: 35 },
  { pattern: /du är (galen|psykisk|instabil)/i, technique: 'GASLIGHTING', weight: 40 },
  // JADE-bete: Provocerar en att förklara/försvara sig
  { pattern: /varför gör du (alltid|aldrig)/i, technique: 'JADE_BAIT', weight: 20 },
  { pattern: /du måste (förklara|bevisa|motivera)/i, technique: 'JADE_BAIT', weight: 25 },
  // Hot (direkta)
  { pattern: /(annars|om inte).*konsekvens/i, technique: 'THREAT', weight: 50 },
  { pattern: /jag ska se till att/i, technique: 'THREAT', weight: 45 },
  // Love-bombing
  { pattern: /ingen (älskar|förstår|vet) dig som jag/i, technique: 'LOVE_BOMBING', weight: 30 },
];

function runRegexLayer(text: string): { detections: DcapDetection[]; score: number } {
  let score = 0;
  const detections: DcapDetection[] = [];

  for (const { pattern, technique, weight } of REGEX_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      score += weight;
      detections.push({
        technique,
        matchedPattern: match[0],
        confidence: weight >= 35 ? 'HIGH' : 'MEDIUM',
        layer: 'REGEX',
      });
    }
  }

  return { detections, score: Math.min(score, 60) }; // Regex ger max 60p
}

// --- Lager 2: Semantisk Analys via Vertex AI ---

async function runSemanticLayer(
  text: string,
  projectId: string
): Promise<{ detections: DcapDetection[]; score: number; greyRockResponse?: string }> {
  const vertexai = new VertexAI({ project: projectId, location: 'europe-west1' });
  const model = vertexai.preview.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: {
      role: 'system',
      parts: [{
        text: `Du är en expert på narcissistiskt missbruk och psykologiska manipulationstekniker.
Din uppgift är att analysera text för indikatorer på: DARVO, gaslighting, hot, love-bombing, stonewalling och JADE-bete.
Svara ALLTID med ett JSON-objekt. Inga förklaringar utanför JSON.
Format:
{
  "riskScore": <0-40>,
  "technique": "<DARVO|GASLIGHTING|LOVE_BOMBING|SILENT_TREATMENT|JADE_BAIT|THREAT|UNKNOWN>",
  "confidence": "<HIGH|MEDIUM|LOW>",
  "greyRockSuggestion": "<ett kort, neutralt och känslokallt svar>"
}`
      }]
    }
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `Analysera denna text:\n\n"${text}"` }] }]
  });

  const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

  try {
    const parsed = JSON.parse(responseText);
    const detections: DcapDetection[] = parsed.technique !== 'UNKNOWN' ? [{
      technique: parsed.technique as ManipulationTechnique,
      matchedPattern: 'Semantisk analys',
      confidence: parsed.confidence ?? 'LOW',
      layer: 'SEMANTIC',
    }] : [];

    return {
      detections,
      score: parsed.riskScore ?? 0,
      greyRockResponse: parsed.greyRockSuggestion,
    };
  } catch {
    return { detections: [], score: 0 };
  }
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
