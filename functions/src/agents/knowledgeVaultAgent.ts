import { LIVS_ARKIVARIEN_SYSTEM_PROMPT } from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';
import { fetchKampsparEvidenceForQuery } from '../lib/kampsparQueryRag';

/** Google AI / Vertex via @google/genai — kräver GEMINI_API_KEY i prod om Vertex-modeller saknas. */
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
}

function buildContextBlock(chunks: Awaited<ReturnType<typeof fetchKampsparEvidenceForQuery>>): string {
  if (chunks.length === 0) return '(inga poster i Kampspår eller kb_docs)';
  return chunks
    .map(
      (c) =>
        `[collection:${c.collection} docId:${c.docId} datum:${c.date} titel:${c.title}] ${c.content.slice(0, 400)}`
    )
    .join('\n');
}

function citationKey(c: KnowledgeVaultCitation): string {
  return `${c.collection}:${c.docId}`;
}

function parseKnowledgeVaultJson(
  raw: string,
  allowed: Map<string, KnowledgeVaultCitation>
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
            const key = `${collection}:${c.docId}`;
            return allowed.has(key);
          })
          .map((c) => {
            const collection = c.collection === 'kb_docs' ? 'kb_docs' : 'kampspar';
            const ref = allowed.get(`${collection}:${c.docId}`)!;
            return {
              docId: ref.docId,
              collection: ref.collection,
              date: typeof c.date === 'string' ? c.date : ref.date,
              title: typeof c.title === 'string' ? c.title : ref.title,
              excerpt: typeof c.excerpt === 'string' ? c.excerpt.trim() : ref.excerpt,
            };
          })
      : [];

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

type KampsparEvidenceChunk = Awaited<ReturnType<typeof fetchKampsparEvidenceForQuery>>[number];

export async function askKnowledgeVaultWithRag(
  uid: string,
  question: string,
  geminiApiKey?: string
): Promise<KnowledgeVaultResult> {
  const chunks = await fetchKampsparEvidenceForQuery(uid, question);
  const allowed = new Map<string, KnowledgeVaultCitation>();
  for (const c of chunks) {
    allowed.set(citationKey(c), {
      docId: c.docId,
      collection: c.collection,
      date: c.date,
      title: c.title,
      excerpt: c.excerpt,
    });
  }

  if (chunks.length === 0) {
    return {
      answer:
        'Inga poster i Kampspår ännu. Lägg till material under Tidshjulet-fliken eller importera via Drive.',
      citations: [],
    };
  }

  const prompt = `Användarens fråga:
${question}

Kampspår-kontext — använd ENDAST dessa docId + collection i citations:
${buildContextBlock(chunks)}

Returnera JSON:
{"answer":"kort svar på svenska","citations":[{"docId":"...","collection":"kampspar|kb_docs","date":"YYYY-MM-DD","title":"...","excerpt":"..."}]}`;

  const systemInstruction = `${LIVS_ARKIVARIEN_SYSTEM_PROMPT}
Returnera ENDAST giltig JSON utan markdown. Hallucinera aldrig utan bevis i kontexten.`;

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
    const parsed = parseKnowledgeVaultJson(raw, allowed);
    if (parsed) return parsed;

    console.warn('[Knowledge Vault RAG] Kunde inte parsa JSON:', raw.slice(0, 200));
    return buildDegradedResponse(chunks);
  } catch (error) {
    console.error('[Knowledge Vault RAG] LLM fel — degraded RAG-fallback:', error);
    return buildDegradedResponse(chunks);
  }
}
