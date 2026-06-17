import { HttpsError } from 'firebase-functions/v2/https';
import { createGenAI } from './genaiClient';
import type { CanonicalDossierEntry } from './dossierCanonicalHash';

const DOSSIER_AI_MODEL = 'gemini-2.5-flash';

const DOSSIER_AI_SCHEMA = {
  type: 'object',
  properties: {
    foreword: { type: 'string' },
    timeline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          fact: { type: 'string' },
        },
        required: ['date', 'fact'],
      },
    },
  },
  required: ['foreword', 'timeline'],
} as const;

const DOSSIER_AI_SYSTEM = `Du skriver ett neutralt AI-försätt och en faktabaserad tidslinje till en dossier-export från Livskompassen.

REGLER:
- Svenska, klinisk och lågaffektiv ton
- Endast observerbara fakta från underlaget — inga diagnoser, inga partietiketter
- foreword: max 4 korta stycken, sammanfattar omfattning och period (inte juridisk rådgivning)
- timeline: max 12 rader, kronologisk, datum YYYY-MM-DD eller "okänt"
- Hänvisa inte till känslor som sanning — citera beteenden och logistik
- Om underlaget är tunt: säg det explicit`;

export type DossierTimelineRow = {
  date: string;
  fact: string;
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

function summarizeEntriesForLlm(entries: CanonicalDossierEntry[]): string {
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
      return `- ${entry.createdAt.slice(0, 10)} | ${entry.collection} | ${snippet || '(tom)'}`;
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
        if (!fact) return null;
        return { date: date || 'okänt', fact: fact.slice(0, 280) };
      })
      .filter((r): r is DossierTimelineRow => r !== null)
      .slice(0, 12);

    if (!foreword) return fallback;
    return { foreword: foreword.slice(0, 2400), timeline: timeline.length ? timeline : fallback.timeline };
  } catch {
    return fallback;
  }
}

/** P2 Dossier v2 — LLM foreword + tidslinje (påverkar inte kanonisk documentHash). */
export async function generateDossierAiForeword(
  entries: CanonicalDossierEntry[],
  dateFrom: string,
  dateTo: string,
  reportType: string,
  geminiApiKey?: string,
): Promise<DossierAiForewordResult> {
  const fallback = buildFallbackForeword(entries, dateFrom, dateTo, reportType);
  if (entries.length === 0) return fallback;

  const summary = summarizeEntriesForLlm(entries);
  const prompt = `Rapporttyp: ${reportType}
Period: ${dateFrom} — ${dateTo}
Antal poster: ${entries.length}

Underlag (kronologiskt urval):
${summary}

Returnera JSON enligt schema.`;

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: DOSSIER_AI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: DOSSIER_AI_SYSTEM,
        temperature: 0.12,
        maxOutputTokens: 1800,
        responseMimeType: 'application/json',
        responseSchema: DOSSIER_AI_SCHEMA,
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
