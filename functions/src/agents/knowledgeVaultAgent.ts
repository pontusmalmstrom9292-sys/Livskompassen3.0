import { LIVS_ARKIVARIEN_SYSTEM_PROMPT } from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';
import { loadKunskapEntityBundle } from '../lib/entityProfileStore';
import { fetchKampsparEvidenceForQuery } from '../lib/kampsparQueryRag';

/** Google AI via @google/genai — kräver GEMINI_API_KEY. */
const KNOWLEDGE_VAULT_MODEL = 'gemini-2.5-flash';

export interface KnowledgeVaultCitation {
  docId: string;
  collection: 'kampspar' | 'kb_docs';
  date: string;
  title: string;
  excerpt: string;
}

export interface KnowledgeVaultResult {
  answer: string;
  citations: KnowledgeVaultCitation[];
  moduleRoute?: {
    path: string;
    label: string;
    silo: 'barnen';
  };
}

type KampsparEvidenceChunk = Awaited<ReturnType<typeof fetchKampsparEvidenceForQuery>>[number];

function citationKey(c: { collection: string; docId: string }): string {
  return `${c.collection}:${c.docId}`;
}

/** Hard-ground: excerpt must appear in source content or fall back to allowlist excerpt. */
function groundCitation(
  c: KnowledgeVaultCitation,
  ref: KnowledgeVaultCitation,
  sourceContent: string,
): KnowledgeVaultCitation {
  const excerptRaw = typeof c.excerpt === 'string' ? c.excerpt.trim() : '';
  const hay = sourceContent.toLowerCase();
  const grounded =
    excerptRaw.length >= 12 && hay.includes(excerptRaw.toLowerCase().slice(0, 120))
      ? excerptRaw.slice(0, 240)
      : ref.excerpt;
  const title =
    typeof c.title === 'string' &&
    c.title.trim() &&
    ref.title.toLowerCase().includes(c.title.trim().toLowerCase().slice(0, 40))
      ? c.title.trim()
      : ref.title;
  const date =
    typeof c.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(c.date) ? c.date.slice(0, 10) : ref.date;
  return {
    docId: ref.docId,
    collection: ref.collection,
    date,
    title,
    excerpt: grounded,
  };
}

function parseKnowledgeVaultJson(
  raw: string,
  allowed: Map<string, KnowledgeVaultCitation>,
  contentByKey: Map<string, string>,
): KnowledgeVaultResult | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned) as KnowledgeVaultResult;
    if (typeof parsed.answer !== 'string') return null;

    const citations = Array.isArray(parsed.citations)
      ? parsed.citations
          .filter((c) => {
            if (!c || typeof c.docId !== 'string') return false;
            const collection = c.collection === 'kb_docs' ? 'kb_docs' : 'kampspar';
            return allowed.has(`${collection}:${c.docId}`);
          })
          .map((c) => {
            const collection = c.collection === 'kb_docs' ? 'kb_docs' : 'kampspar';
            const key = `${collection}:${c.docId}`;
            const ref = allowed.get(key)!;
            return groundCitation(
              {
                docId: c.docId,
                collection,
                date: typeof c.date === 'string' ? c.date : ref.date,
                title: typeof c.title === 'string' ? c.title : ref.title,
                excerpt: typeof c.excerpt === 'string' ? c.excerpt : ref.excerpt,
              },
              ref,
              contentByKey.get(key) ?? ref.excerpt,
            );
          })
      : [];

    if (citations.length === 0 && allowed.size > 0) {
      return {
        answer: parsed.answer.trim(),
        citations: [...allowed.values()].slice(0, 3),
      };
    }

    return { answer: parsed.answer.trim(), citations };
  } catch {
    return null;
  }
}

function buildDegradedResponse(chunks: KampsparEvidenceChunk[]): KnowledgeVaultResult {
  const top = chunks.slice(0, 3);
  const lead = top[0];
  const answer = lead
    ? `Jag hittade ${chunks.length} relevanta poster. Senaste: «${lead.title}» — ${lead.excerpt}`
    : 'Inga matchande poster hittades.';
  return {
    answer,
    citations: top.map((c) => ({
      docId: c.docId,
      collection: c.collection,
      date: c.date,
      title: c.title,
      excerpt: c.excerpt,
    })),
  };
}

export async function askKnowledgeVaultWithRag(
  uid: string,
  question: string,
  geminiApiKey?: string,
): Promise<KnowledgeVaultResult> {
  const [chunks, entityBundle] = await Promise.all([
    fetchKampsparEvidenceForQuery(uid, question),
    loadKunskapEntityBundle(uid),
  ]);
  const allowed = new Map<string, KnowledgeVaultCitation>();
  const contentByKey = new Map<string, string>();
  for (const c of chunks) {
    const key = citationKey(c);
    allowed.set(key, {
      docId: c.docId,
      collection: c.collection,
      date: c.date,
      title: c.title,
      excerpt: c.excerpt,
    });
    contentByKey.set(key, c.content);
  }

  if (chunks.length === 0) {
    return {
      answer:
        'Inga poster i Minne ännu. Lägg till material under Tidshjulet-fliken eller importera via Drive.',
      citations: [],
    };
  }

  const contextBlock = chunks
    .map((c, i) => {
      const budget = i < 3 ? 800 : 400;
      return `[collection:${c.collection} docId:${c.docId} datum:${c.date} titel:${c.title}] ${c.content.slice(0, budget)}`;
    })
    .join('\n');

  const prompt = `Användarens fråga:
${question}

EntityProfile (metadata — ej bevis, hallucinera aldrig nya personer):
${entityBundle.contextBlock}

Minne-kontext — använd ENDAST dessa docId + collection i citations. Excerpt MÅSTE vara citat från kontexten:
${contextBlock}

Returnera JSON:
{"answer":"kort svar på svenska","citations":[{"docId":"...","collection":"kampspar|kb_docs","date":"YYYY-MM-DD","title":"...","excerpt":"..."}]}`;

  const systemInstruction = `${LIVS_ARKIVARIEN_SYSTEM_PROMPT}
Returnera ENDAST giltig JSON utan markdown. Hallucinera aldrig utan bevis i kontexten. Varje citation.excerpt MÅSTE vara ordagrant ur Minne-kontexten.`;

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: KNOWLEDGE_VAULT_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.15,
        maxOutputTokens: 700,
      },
    });

    const raw = response.text ?? '';
    const parsed = parseKnowledgeVaultJson(raw, allowed, contentByKey);
    if (parsed) return parsed;

    console.warn('[Knowledge Vault RAG] Kunde inte parsa JSON:', raw.slice(0, 200));
    return buildDegradedResponse(chunks);
  } catch (error) {
    console.error('[Knowledge Vault RAG] LLM fel — degraded RAG-fallback:', error);
    return buildDegradedResponse(chunks);
  }
}
