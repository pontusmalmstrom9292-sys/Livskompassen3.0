import { HttpsError } from 'firebase-functions/v2/https';
import { createGenAI } from './genaiClient';
import { GEMINI_PRO } from './modelRouter';
import type { CanonicalDossierEntry } from './dossierCanonicalHash';

const DOSSIER_AI_MODEL = GEMINI_PRO;

import { DOSSIER_FOREWORD_RESPONSE_SCHEMA } from '../schemas/dossierForeword';

const DOSSIER_AI_SYSTEM = `Du skriver ett neutralt AI-forsatt och en faktabaserad tidslinje till en dossier-export fran Livskompassen.

REGLER:
- Svenska, klinisk och lagaffektiv ton
- Endast observerbara fakta fran underlaget — inga diagnoser, inga partietiketter
- foreword: max 4 korta stycken, sammanfattar omfattning och period (inte juridisk radgivning)
- timeline: max 12 rader, kronologisk, datum YYYY-MM-DD eller "okant"
- sourceRef (valfritt): collection/docId for kallpost nar fakta kan kopplas till en post (max 80 tecken)
- Hanvisa inte till kanslor som sanning — citera beteenden och logistik
- Om underlaget ar tunt: sag det explicit`;

const DOSSIER_AI_SYSTEM_BBIC = `Du skriver ett neutralt AI-forsatt och en tematisk BBIC-strukturerad tidslinje till en dossier-export fran Livskompassen.

BBIC = Barns Behov I Centrum. Teman: Barnets utveckling, Foraldraformaga, Skydd & trygghet, Familj & relationer.

REGLER:
- Svenska, klinisk och lagaffektiv ton
- Endast observerbara fakta fran underlaget — inga diagnoser, inga partietiketter
- foreword: max 4 korta stycken, sammanfattar underlaget ur barnets perspektiv (inte juridisk radgivning)
- Fokusera pa barnets behov, omsorgssituation och skyddsaspekter — inte foralders kanslomassiga upplevelse
- timeline: max 12 rader, kronologisk, datum YYYY-MM-DD eller "okant"
- Varje timeline-rad bor relatera till en BBIC-dimension (utveckling, formaga, skydd, relationer) om mojligt
- sourceRef (valfritt): collection/docId for kallpost nar fakta kan kopplas till en post (max 80 tecken)
- Hanvisa inte till kanslor som sanning — citera beteenden och logistik
- Om underlaget ar tunt: sag det explicit`;

export type DossierTimelineRow = {
  date: string;
  fact: string;
  sourceRef?: string;
};

export type DossierAiForewordResult = {
  foreword: string;
  timeline: DossierTimelineRow[];
};

function extractJsonObject(raw: string): string {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) return cleaned.slice(start, end + 1);
  return cleaned;
}

function summarizeEntriesForLlm(
  entries: CanonicalDossierEntry[],
  techniquesByDocId?: Map<string, string[]>,
): string {
  const sorted = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return sorted
    .slice(0, 80)
    .map((entry) => {
      const body =
        entry.payload.truth ??
        entry.payload.observation ??
        entry.payload.text ??
        entry.payload.action ??
        '';
      const snippet = body.replace(/\s+/g, ' ').trim().slice(0, 220);
      const ref = `${entry.collection}/${entry.docId}`;
      const techniques =
        entry.collection === 'reality_vault' ? techniquesByDocId?.get(entry.docId) : undefined;
      const tacticPart =
        techniques && techniques.length > 0 ? ` | taktik: ${techniques.join(', ')}` : '';
      return `- ${entry.createdAt.slice(0, 10)} | ${ref}${tacticPart} | ${snippet || '(tom)'}`;
    })
    .join('\n');
}

function buildFallbackForeword(
  entries: CanonicalDossierEntry[],
  dateFrom: string,
  dateTo: string,
  reportType: string,
): DossierAiForewordResult {
  const vaultCount = entries.filter((e) => e.collection === 'reality_vault').length;
  const childCount = entries.filter((e) => e.collection === 'children_logs').length;
  const journalCount = entries.filter((e) => e.collection === 'journal').length;
  const timeline = [...entries]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, 8)
    .map((e) => ({
      date: e.createdAt.slice(0, 10) || 'okänt',
      fact:
        (e.payload.truth ?? e.payload.observation ?? e.payload.text ?? e.payload.action ?? 'Post')
          .slice(0, 120) || 'Post',
      sourceRef: `${e.collection}/${e.docId}`,
    }));

  return {
    foreword: `Dossier (${reportType}) för perioden ${dateFrom}–${dateTo}. Underlag: ${entries.length} poster (valv: ${vaultCount}, barn: ${childCount}, dagbok: ${journalCount}). AI-försätt är deterministisk fallback — bevisdelen nedan är ordagrant från WORM.`,
    timeline,
  };
}

function parseAiForeword(raw: string, fallback: DossierAiForewordResult): DossierAiForewordResult {
  try {
    const parsed = JSON.parse(extractJsonObject(raw)) as Record<string, unknown>;
    const foreword = typeof parsed.foreword === 'string' ? parsed.foreword.trim() : '';
    const timelineRaw = Array.isArray(parsed.timeline) ? parsed.timeline : [];
    const timeline = timelineRaw
      .map((row) => {
        if (!row || typeof row !== 'object') return null;
        const r = row as Record<string, unknown>;
        const fact = typeof r.fact === 'string' ? r.fact.trim() : '';
        const date = typeof r.date === 'string' ? r.date.trim() : 'okänt';
        const sourceRefRaw = typeof r.sourceRef === 'string' ? r.sourceRef.trim() : '';
        const sourceRef = sourceRefRaw ? sourceRefRaw.slice(0, 80) : undefined;
        if (!fact) return null;
        return {
          date: date || 'okänt',
          fact: fact.slice(0, 280),
          ...(sourceRef ? { sourceRef } : {}),
        };
      })
      .filter((r): r is DossierTimelineRow => r !== null)
      .slice(0, 12);

    if (!foreword) return fallback;
    return { foreword: foreword.slice(0, 2400), timeline: timeline.length ? timeline : fallback.timeline };
  } catch {
    return fallback;
  }
}

export type DossierAiForewordOptions = {
  techniquesByDocId?: Map<string, string[]>;
  tacticSummary?: { technique: string; count: number }[];
};

/** P2/P6 Dossier — LLM foreword + tidslinje (påverkar inte kanonisk documentHash). */
export async function generateDossierAiForeword(
  entries: CanonicalDossierEntry[],
  dateFrom: string,
  dateTo: string,
  reportType: string,
  geminiApiKey?: string,
  options?: DossierAiForewordOptions,
): Promise<DossierAiForewordResult> {
  const fallback = buildFallbackForeword(entries, dateFrom, dateTo, reportType);
  if (entries.length === 0) return fallback;

  const summary = summarizeEntriesForLlm(entries, options?.techniquesByDocId);
  const tacticBlock =
    options?.tacticSummary && options.tacticSummary.length > 0
      ? `\n\nTaktik-sammanfattning (P3 sidecar, regex-assisterad — inte diagnos):\n${options.tacticSummary
          .slice(0, 12)
          .map((row) => `- ${row.technique}: ${row.count} valv-poster`)
          .join('\n')}`
      : '';

  const prompt = `Rapporttyp: ${reportType}
Period: ${dateFrom} — ${dateTo}
Antal poster: ${entries.length}

Underlag (kronologiskt urval):
${summary}${tacticBlock}

Returnera JSON enligt schema.`;

  try {
    const ai = createGenAI(geminiApiKey);
    const systemPrompt = reportType === 'BBIC' ? DOSSIER_AI_SYSTEM_BBIC : DOSSIER_AI_SYSTEM;
    const response = await ai.models.generateContent({
      model: DOSSIER_AI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.12,
        maxOutputTokens: 1800,
        responseMimeType: 'application/json',
        responseSchema: DOSSIER_FOREWORD_RESPONSE_SCHEMA,
      },
    });

    const raw = response.text?.trim() ?? '';
    if (!raw) return fallback;
    return parseAiForeword(raw, fallback);
  } catch (error) {
    console.warn('[generateDossierAiForeword] LLM fallback:', error);
    if (error instanceof HttpsError) throw error;
    return fallback;
  }
}
