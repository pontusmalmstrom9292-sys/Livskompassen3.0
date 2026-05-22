import { INKORG_SORTERARE_SYSTEM_PROMPT } from '../sharedRules';
import { createGenAI } from './genaiClient';

export type InboxRouting = 'kunskap' | 'bevis' | 'barnen' | 'review';

export interface InboxClassification {
  routing: InboxRouting;
  tags: string[];
  category: string;
  confidence: number;
  summary: string;
  traumaSensitive: boolean;
  childAlias?: string;
  rationale: string;
}

const CLASSIFY_MODEL = 'gemini-2.5-flash';

function parseClassificationJson(raw: string): InboxClassification | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned) as InboxClassification;
    const routing = parsed.routing;
    if (
      routing !== 'kunskap' &&
      routing !== 'bevis' &&
      routing !== 'barnen' &&
      routing !== 'review'
    ) {
      return null;
    }
    const confidence =
      typeof parsed.confidence === 'number'
        ? Math.min(1, Math.max(0, parsed.confidence))
        : 0.5;

    let resolvedRouting: InboxRouting = routing;
    if (confidence < 0.55 && routing !== 'review') {
      resolvedRouting = 'review';
    }

    const childAlias =
      typeof parsed.childAlias === 'string' && parsed.childAlias.trim()
        ? parsed.childAlias.trim()
        : undefined;

    return {
      routing: resolvedRouting,
      tags: Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 12) : [],
      category: typeof parsed.category === 'string' ? parsed.category.slice(0, 80) : 'okänd',
      confidence,
      summary:
        typeof parsed.summary === 'string' ? parsed.summary.slice(0, 400) : 'Ingen sammanfattning.',
      traumaSensitive: parsed.traumaSensitive === true,
      childAlias:
        childAlias && /kasper|arvid/i.test(childAlias)
          ? childAlias.match(/arvid/i)
            ? 'Arvid'
            : 'Kasper'
          : undefined,
      rationale:
        typeof parsed.rationale === 'string' ? parsed.rationale.slice(0, 300) : '',
    };
  } catch {
    return null;
  }
}

/** Deterministisk försortering — fail-safe innan LLM (anti-hallucination). */
export function heuristicInboxClassify(
  analysisText: string,
  fileName: string
): InboxClassification | null {
  const blob = `${fileName} ${analysisText}`.toLowerCase();

  if (/\b(lvu|vårdnadstvist|vårdnad|akut kris|självskada)\b/.test(blob)) {
    return {
      routing: 'review',
      tags: ['trauma', 'myndighet'],
      category: 'vårdnad',
      confidence: 0.92,
      summary: 'Trauma/LVU — kräver manuell granskning.',
      traumaSensitive: true,
      rationale: 'Heuristisk match: trauma/LVU.',
    };
  }

  if (
    /\b(sms|mejl|e-post|mail|whatsapp|meddelande)\b/.test(blob) &&
    /\b(isabelle|motpart|ex|barnens mor|soc|socialtjänst|dom|bevis)\b/.test(blob)
  ) {
    return {
      routing: 'bevis',
      tags: ['kommunikation', 'bevis'],
      category: 'kommunikation',
      confidence: 0.88,
      summary: 'Kommunikationslogg / bevismaterial.',
      traumaSensitive: false,
      rationale: 'Heuristisk match: kommunikation → reality_vault.',
    };
  }

  if (
    /\b(bbic|metod|artikel|tips|handbok|gaslighting)\b/.test(blob) &&
    !/\b(sms|mejl|whatsapp)\b/.test(blob)
  ) {
    return {
      routing: 'kunskap',
      tags: ['referens', 'metod'],
      category: 'kunskap',
      confidence: 0.85,
      summary: 'Referens eller metodmaterial.',
      traumaSensitive: false,
      rationale: 'Heuristisk match: kunskap/referens.',
    };
  }

  if (/\bkasper\b/.test(blob) && /\b(sov|skola|ångest|beteende|observation)\b/.test(blob)) {
    return {
      routing: 'barnen',
      tags: ['barn', 'livslogg'],
      category: 'barn',
      confidence: 0.86,
      summary: 'Observation om barn.',
      traumaSensitive: false,
      childAlias: 'Kasper',
      rationale: 'Heuristisk match: barnobservation.',
    };
  }

  if (/\barvid\b/.test(blob) && /\b(sov|skola|ångest|beteende|observation)\b/.test(blob)) {
    return {
      routing: 'barnen',
      tags: ['barn', 'livslogg'],
      category: 'barn',
      confidence: 0.86,
      summary: 'Observation om barn.',
      traumaSensitive: false,
      childAlias: 'Arvid',
      rationale: 'Heuristisk match: barnobservation.',
    };
  }

  return null;
}

/** G10 — Vertex/Gemini auto-tag för inkorg (metadata only före persist). */
export async function classifyInboxDocument(
  analysisText: string,
  fileName: string,
  geminiApiKey?: string
): Promise<InboxClassification> {
  const heuristic = heuristicInboxClassify(analysisText, fileName);
  if (heuristic) return heuristic;

  const excerpt = analysisText.slice(0, 6000);
  const prompt = `Filnamn: ${fileName}

Dokumentutdrag:
${excerpt}

Returnera JSON enligt systeminstruktion.`;

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: CLASSIFY_MODEL,
      contents: prompt,
      config: {
        systemInstruction: INKORG_SORTERARE_SYSTEM_PROMPT,
        temperature: 0.08,
        maxOutputTokens: 500,
      },
    });

    const raw = response.text ?? '';
    const parsed = parseClassificationJson(raw);
    if (parsed) return parsed;

    console.warn('[inboxClassifier] Kunde inte parsa JSON:', raw.slice(0, 200));
  } catch (err) {
    console.error('[inboxClassifier] LLM fel:', err);
  }

  return {
    routing: 'review',
    tags: ['oparsad'],
    category: 'review',
    confidence: 0,
    summary: `Kräver manuell granskning: ${fileName}`,
    traumaSensitive: false,
    rationale: 'Klassificering misslyckades — fail-closed till review.',
  };
}

/** Trauma/LVU utan opt-in → alltid review-kö, aldrig auto-WORM. */
export function requiresHumanReview(
  classification: InboxClassification,
  optInTrauma?: boolean
): boolean {
  if (classification.routing === 'review') return true;
  if (classification.traumaSensitive && !optInTrauma) return true;
  return false;
}
