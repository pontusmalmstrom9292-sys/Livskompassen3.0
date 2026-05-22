import { SANNING_ANALYTIKERN_SYSTEM_PROMPT } from '../sharedRules';
import { loadEntityProfileBundle } from '../lib/entityProfileStore';
import { fetchVaultEvidenceForQuery } from '../lib/vaultRag';
import { createGenAI } from '../lib/genaiClient';

const ai = createGenAI();

export interface ValvChatCitation {
  docId: string;
  date: string;
  excerpt: string;
}

export interface ValvChatResult {
  answer: string;
  citations: ValvChatCitation[];
}

function buildContextBlock(
  chunks: Awaited<ReturnType<typeof fetchVaultEvidenceForQuery>>
): string {
  if (chunks.length === 0) return '(inga bevis i reality_vault)';
  return chunks.map((c) => `[docId:${c.docId} datum:${c.date}] ${c.truth}`).join('\n');
}

function parseValvChatJson(raw: string, allowedDocIds: Set<string>): ValvChatResult | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned) as ValvChatResult;
    if (typeof parsed.answer !== 'string') return null;

    const citations = Array.isArray(parsed.citations)
      ? parsed.citations
          .filter(
            (c) =>
              c &&
              typeof c.docId === 'string' &&
              allowedDocIds.has(c.docId) &&
              typeof c.excerpt === 'string'
          )
          .map((c) => ({
            docId: c.docId,
            date: typeof c.date === 'string' ? c.date : '',
            excerpt: c.excerpt.trim(),
          }))
      : [];

    return { answer: parsed.answer.trim(), citations };
  } catch {
    return null;
  }
}

export async function askValvChat(uid: string, question: string): Promise<ValvChatResult> {
  const [chunks, entityBundle] = await Promise.all([
    fetchVaultEvidenceForQuery(uid, question),
    loadEntityProfileBundle(uid),
  ]);
  const allowedDocIds = new Set(chunks.map((c) => c.docId));

  if (chunks.length === 0) {
    return {
      answer: 'Inga bevis hittades i valvet. Logga först under fliken Logga.',
      citations: [],
    };
  }

  const prompt = `Användarens fråga:
${question}

EntityProfile (metadata — ej bevis, hallucinera aldrig nya personer):
${entityBundle.contextBlock}

WORM-bevis (reality_vault) — använd ENDAST dessa docId i citations:
${buildContextBlock(chunks)}

Returnera JSON:
{"answer":"kort kliniskt svar på svenska","citations":[{"docId":"...","date":"YYYY-MM-DD","excerpt":"..."}]}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SANNING_ANALYTIKERN_SYSTEM_PROMPT,
        temperature: 0.1,
        maxOutputTokens: 600,
      },
    });

    const raw = response.text ?? '';
    const parsed = parseValvChatJson(raw, allowedDocIds);
    if (parsed) return parsed;

    console.warn('[Valv-Chat] Kunde inte parsa JSON:', raw.slice(0, 200));
    return {
      answer: 'Kunde inte tolka AI-svaret. Försök formulera frågan kortare.',
      citations: [],
    };
  } catch (error) {
    console.error('[Valv-Chat] Fel:', error);
    throw new Error('Valv-Chat kunde inte svara.');
  }
}
