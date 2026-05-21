import { LIVS_ARKIVARIEN_SYSTEM_PROMPT } from '../sharedRules';
import { fetchKampsparEvidenceForQuery } from '../lib/kampsparQueryRag';
import { createGenAI } from '../lib/genaiClient';

const ai = createGenAI();

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

export async function askKnowledgeVaultWithRag(
  uid: string,
  question: string
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash-001',
      contents: prompt,
      config: {
        systemInstruction: `${LIVS_ARKIVARIEN_SYSTEM_PROMPT}
Returnera ENDAST giltig JSON utan markdown. Hallucinera aldrig utan bevis i kontexten.`,
        temperature: 0.15,
        maxOutputTokens: 700,
      },
    });

    const raw = response.text ?? '';
    const parsed = parseKnowledgeVaultJson(raw, allowed);
    if (parsed) return parsed;

    console.warn('[Knowledge Vault RAG] Kunde inte parsa JSON:', raw.slice(0, 200));
    return {
      answer: 'Kunde inte tolka AI-svaret. Försök formulera frågan kortare.',
      citations: [],
    };
  } catch (error) {
    console.error('[Knowledge Vault RAG] Fel:', error);
    throw new Error('Kunskapsvalvet kunde inte svara.');
  }
}
