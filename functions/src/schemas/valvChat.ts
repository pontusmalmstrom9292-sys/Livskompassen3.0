/** P1 flow_valv_chat — prompt-JSON shape + read-only Gemini tool declarations. */

export interface ValvChatCitation {
  docId: string;
  date: string;
  excerpt: string;
}

export interface ValvChatResponse {
  answer: string;
  citations: ValvChatCitation[];
  theoryWithoutEvidence?: boolean;
}

/** Read-only tool — refines vault RAG search; never writes WORM. */
export const VALV_CHAT_READ_TOOLS = [
  {
    name: 'refine_vault_search',
    description:
      'Sök reality_vault med en förfinad fråga. Read-only. Använd högst en gång om initial kontext otillräcklig.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Kort sökfråga på svenska' },
      },
      required: ['query'],
    },
  },
] as const;

export function validateValvChatResponse(
  value: unknown,
  allowedDocIds: Set<string>,
): ValvChatResponse | null {
  if (!value || typeof value !== 'object') return null;
  const o = value as Record<string, unknown>;
  if (typeof o.answer !== 'string') return null;
  const citations = Array.isArray(o.citations)
    ? o.citations
        .filter(
          (c): c is ValvChatCitation =>
            !!c &&
            typeof c === 'object' &&
            typeof (c as ValvChatCitation).docId === 'string' &&
            allowedDocIds.has((c as ValvChatCitation).docId) &&
            typeof (c as ValvChatCitation).excerpt === 'string',
        )
        .map((c) => ({
          docId: c.docId,
          date: typeof c.date === 'string' ? c.date : '',
          excerpt: c.excerpt.trim(),
        }))
    : [];
  return {
    answer: o.answer.trim(),
    citations,
    theoryWithoutEvidence: o.theoryWithoutEvidence === true,
  };
}
