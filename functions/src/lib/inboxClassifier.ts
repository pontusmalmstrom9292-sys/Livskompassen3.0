import { INKORG_SORTERARE_SYSTEM_PROMPT } from '../sharedRules';
import {
  normalizeInkastSourceModule,
  stripInjectedSourceModuleFromText,
} from './inkastSourceModule';
import { createGenAI } from './genaiClient';

export type InboxRouting = 'kunskap' | 'bevis' | 'barnen' | 'dagbok' | 'review' | 'planning';

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
      routing !== 'dagbok' &&
      routing !== 'review' &&
      routing !== 'planning'
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
    /\[sourcemodule:hamn\]/i.test(blob) ||
    /sourcemodule:hamn_biff/i.test(blob) ||
    (/sourcemodule:/i.test(blob) && /\b(hamn|biff|grey rock)\b/.test(blob))
  ) {
    return {
      routing: 'bevis',
      tags: ['hamn', 'kommunikation'],
      category: 'kommunikation',
      confidence: 0.9,
      summary: 'Hamn / ex-kommunikation → bevis.',
      traumaSensitive: false,
      rationale: 'Heuristisk match: sourceModule hamn → reality_vault.',
    };
  }

  if (
    /\[sourcemodule:valv_samla\]/i.test(blob) ||
    /sourcemodule:valv_samla/i.test(blob)
  ) {
    return {
      routing: 'bevis',
      tags: ['bevis', 'valv'],
      category: 'bevis',
      confidence: 0.88,
      summary: 'Valv Samla — bevismaterial.',
      traumaSensitive: false,
      rationale: 'Heuristisk match: sourceModule valv_samla → reality_vault.',
    };
  }

  if (/sourcemodule:planering_inkorg/i.test(blob)) {
    return {
      routing: 'planning',
      tags: ['planering'],
      category: 'planering',
      confidence: 1.0,
      summary: 'Inkommande uppgift för planering.',
      traumaSensitive: false,
      rationale: 'Heuristisk match: planering_inkorg.',
    };
  }

  if (
    /\[sourcemodule:(hem_capture|hem_smart_inkast|hem_inkast)\]/i.test(blob) ||
    /sourcemodule:(hem_capture|hem_smart_inkast|hem_inkast)/i.test(blob)
  ) {
    return {
      routing: 'dagbok',
      tags: ['reflektion', 'inkast'],
      category: 'vardag',
      confidence: 0.86,
      summary: 'Personlig reflektion via Hem-capture → dagbok.',
      traumaSensitive: false,
      rationale: 'Heuristisk match: sourceModule hem → journal.',
    };
  }

  if (
    /\[sourcemodule:mabra_inkast\]/i.test(blob) ||
    /sourcemodule:mabra_inkast/i.test(blob)
  ) {
    return {
      routing: 'dagbok',
      tags: ['reflektion', 'mabra', 'aterhamtning'],
      category: 'vardag',
      confidence: 0.88,
      summary: 'MåBra reflektion via inkast → dagbok (HITL).',
      traumaSensitive: false,
      rationale: 'Heuristisk match: sourceModule mabra_inkast → journal.',
    };
  }

  if (
    /\[sourcemodule:(familjen|barnen|barnfokus)\]/i.test(blob) ||
    (/sourcemodule:/i.test(blob) && /\b(barnfokus|livslogg|barnporten)\b/.test(blob))
  ) {
    const childAlias = /\barvid\b/.test(blob) ? 'Arvid' : /\bkasper\b/.test(blob) ? 'Kasper' : undefined;
    return {
      routing: 'barnen',
      tags: ['barn', 'livslogg'],
      category: 'barn',
      confidence: 0.88,
      summary: 'Barnobservation via Familj/capture.',
      traumaSensitive: false,
      childAlias,
      rationale: 'Heuristisk match: sourceModule familj → children_logs.',
    };
  }

  if (
    /\b(sms|mejl|e-post|mail|whatsapp|meddelande)\b/.test(blob) &&
    /\b(isabelle|motpart|ex|barnens mor|soc|socialtjänst|dom|bevis|biff)\b/.test(blob)
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

  if (/\bbarnfokus\b/.test(blob) || /\bbarnens (logg|livslogg)\b/.test(blob)) {
    const childAlias = /\barvid\b/.test(blob) ? 'Arvid' : /\bkasper\b/.test(blob) ? 'Kasper' : undefined;
    return {
      routing: 'barnen',
      tags: ['barn', 'livslogg'],
      category: 'barn',
      confidence: 0.84,
      summary: 'Barnrelaterad observation.',
      traumaSensitive: false,
      childAlias,
      rationale: 'Heuristisk match: barnlogg.',
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

  /** Domän-prior ~80%: HCF/covert-bevis eller teori utan explicit hem/måbra-källa. */
  const covertHcfSignal =
    /\b(darvo|gaslight|triangul|projektion|invalidation|tyst straff|covert|offerroll|biff|grey rock|moving goalpost)\b/.test(
      blob,
    ) ||
    (/\b(motpart|ex|barnens mor|isabelle)\b/.test(blob) &&
      /\b(sms|mejl|sa|skrev|hände|bevis|mönster|teori|logg)\b/.test(blob));

  if (
    covertHcfSignal &&
    !/\bsourcemodule:(hem_|mabra_|planering_)/i.test(blob)
  ) {
    return {
      routing: 'bevis',
      tags: ['covert_taktik', 'hcf', 'bevis'],
      category: 'covert_hcf',
      confidence: 0.78,
      summary: 'HCF/covert — bevis eller teori (domän-prior).',
      traumaSensitive: false,
      rationale: 'Heuristisk match: domän-prior ~80% → reality_vault.',
    };
  }

  return null;
}

/** Samma prefix som submitInkastLite — heuristiker läser [sourceModule:…]. */
export function buildInboxClassifyBlob(analysisText: string, sourceModule?: string): string {
  const clean = stripInjectedSourceModuleFromText(analysisText);
  const mod = normalizeInkastSourceModule(sourceModule);
  return mod ? `[sourceModule:${mod}]\n${clean}` : clean;
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
  if (isManualInkastClassification(classification)) return false;
  if (classification.routing === 'review') return true;
  if (classification.traumaSensitive && !optInTrauma) return true;
  return false;
}

/** Manuellt användarval — prioriteras före AI i routeInboxToWorm. */
export function isManualInkastClassification(classification: InboxClassification): boolean {
  return (
    classification.confidence >= 1 &&
    classification.tags.includes('manuell') &&
    classification.routing !== 'review'
  );
}

export function buildManualInkastClassification(input: {
  routing: Exclude<InboxRouting, 'review'>;
  category?: string;
  tags?: string[];
  comment?: string;
  analysisExcerpt?: string;
  childAlias?: string;
}): InboxClassification {
  const analysisTags = Array.isArray(input.tags)
    ? input.tags
        .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
        .map((t) => t.trim().toLowerCase().replace(/^#/, '').slice(0, 48))
        .filter((t) => t !== 'manuell')
        .slice(0, 11)
    : [];
  const category =
    typeof input.category === 'string' && input.category.trim()
      ? input.category.trim().slice(0, 80)
      : analysisTags[0] || 'manuell';
  const tags = ['manuell', ...analysisTags].slice(0, 12);
  const summary =
    typeof input.comment === 'string' && input.comment.trim()
      ? input.comment.trim().slice(0, 400)
      : (input.analysisExcerpt ?? 'Manuellt inkast.').slice(0, 400);

  let childAlias: string | undefined;
  if (input.routing === 'barnen') {
    const raw =
      typeof input.childAlias === 'string' && input.childAlias.trim()
        ? input.childAlias.trim()
        : undefined;
    if (raw && /arvid/i.test(raw)) childAlias = 'Arvid';
    else if (raw && /kasper/i.test(raw)) childAlias = 'Kasper';
    else childAlias = raw;
  }

  return {
    routing: input.routing,
    tags,
    category,
    confidence: 1,
    summary,
    traumaSensitive: false,
    childAlias,
    rationale: 'Manuellt val av användare (HITL override).',
  };
}
