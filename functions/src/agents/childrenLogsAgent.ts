import { MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT } from '../sharedRules';
import { loadEntityProfileBundle } from '../lib/entityProfileStore';
import { fetchChildrenLogsForQuery } from '../lib/childrenLogsQueryRag';
import { createGenAI } from '../lib/genaiClient';

const CHILDREN_LOGS_MODEL = 'gemini-2.5-flash';

export interface ChildrenLogCitation {
  docId: string;
  childAlias: string;
  date: string;
  excerpt: string;
}

export interface ChildrenLogsQueryResult {
  answer: string;
  citations: ChildrenLogCitation[];
  silo: 'barnen';
}

function buildContextBlock(chunks: Awaited<ReturnType<typeof fetchChildrenLogsForQuery>>): string {
  if (chunks.length === 0) return '(inga poster i children_logs)';
  return chunks
    .map(
      (c) =>
        `[docId:${c.docId} barn:${c.childAlias} datum:${c.date} typ:${c.action}] ${c.body.slice(0, 400)}`
    )
    .join('\n');
}

function parseChildrenLogsJson(
  raw: string,
  allowed: Map<string, ChildrenLogCitation>
): ChildrenLogsQueryResult | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned) as ChildrenLogsQueryResult;
    if (typeof parsed.answer !== 'string') return null;

    const citations = Array.isArray(parsed.citations)
      ? parsed.citations
          .filter((c) => c && typeof c.docId === 'string' && allowed.has(c.docId))
          .map((c) => {
            const ref = allowed.get(c.docId)!;
            return {
              docId: ref.docId,
              childAlias:
                typeof c.childAlias === 'string' && c.childAlias.trim()
                  ? c.childAlias.trim()
                  : ref.childAlias,
              date: typeof c.date === 'string' ? c.date : ref.date,
              excerpt: typeof c.excerpt === 'string' ? c.excerpt.trim() : ref.excerpt,
            };
          })
      : [];

    return { answer: parsed.answer.trim(), citations, silo: 'barnen' };
  } catch {
    return null;
  }
}

function buildDegradedResponse(
  chunks: Awaited<ReturnType<typeof fetchChildrenLogsForQuery>>
): ChildrenLogsQueryResult {
  const top = chunks.slice(0, 3);
  const lead = top[0];
  const answer = lead
    ? `Jag hittade ${chunks.length} livslogg-poster. Senaste (${lead.childAlias}): ${lead.excerpt}`
    : 'Inga livsloggar hittades. Logga under Balansmätare eller Livslogg först.';
  return {
    answer,
    citations: top.map((c) => ({
      docId: c.docId,
      childAlias: c.childAlias,
      date: c.date,
      excerpt: c.excerpt,
    })),
    silo: 'barnen',
  };
}

export async function askChildrenLogsQuery(
  uid: string,
  question: string,
  childAlias?: string,
  geminiApiKey?: string
): Promise<ChildrenLogsQueryResult> {
  const [chunks, entityBundle] = await Promise.all([
    fetchChildrenLogsForQuery(uid, question, childAlias),
    loadEntityProfileBundle(uid),
  ]);
  const allowed = new Map<string, ChildrenLogCitation>();
  for (const c of chunks) {
    allowed.set(c.docId, {
      docId: c.docId,
      childAlias: c.childAlias,
      date: c.date,
      excerpt: c.excerpt,
    });
  }

  if (chunks.length === 0) {
    return {
      answer:
        'Inga livsloggar i Familjen ännu. Spara signaler eller en observation — fråga sedan igen.',
      citations: [],
      silo: 'barnen',
    };
  }

  const prompt = `Användarens fråga (Familjen · Livsloggar):
${question}
${childAlias ? `\nFiltrera tolkning till barn: ${childAlias}` : ''}

EntityProfile (metadata — ej bevis, hallucinera aldrig nya personer):
${entityBundle.contextBlock}

children_logs — använd ENDAST dessa docId i citations:
${buildContextBlock(chunks)}

Returnera JSON:
{"answer":"neutralt kort svar på svenska","citations":[{"docId":"...","childAlias":"Kasper|Arvid","date":"YYYY-MM-DD","excerpt":"..."}]}`;

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: CHILDREN_LOGS_MODEL,
      contents: prompt,
      config: {
        systemInstruction: MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT,
        temperature: 0.12,
        maxOutputTokens: 650,
      },
    });

    const raw = response.text ?? '';
    const parsed = parseChildrenLogsJson(raw, allowed);
    if (parsed) return parsed;

    console.warn('[childrenLogsQuery] Kunde inte parsa JSON:', raw.slice(0, 200));
    return buildDegradedResponse(chunks);
  } catch (error) {
    console.error('[childrenLogsQuery] LLM fel — degraded RAG-fallback:', error);
    return buildDegradedResponse(chunks);
  }
}
