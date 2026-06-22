import { SANNING_ANALYTIKERN_SYSTEM_PROMPT } from '../sharedRules';
import { loadEntityProfileBundle } from '../lib/entityProfileStore';
import { fetchVaultEvidenceForQuery } from '../lib/vaultRag';
import { createGenAI } from '../lib/genaiClient';
import { GEMINI_PRO } from '../lib/modelRouter';
import {
  VALV_CHAT_READ_TOOLS,
  validateValvChatResponse,
  type ValvChatCitation,
  type ValvChatResponse,
} from '../schemas/valvChat';

const ai = createGenAI();

export type { ValvChatCitation, ValvChatResponse };

function buildContextBlock(
  chunks: Awaited<ReturnType<typeof fetchVaultEvidenceForQuery>>,
): string {
  if (chunks.length === 0) return '(inga bevis i reality_vault)';
  return chunks.map((c) => `[docId:${c.docId} datum:${c.date}] ${c.truth}`).join('\n');
}

function buildPrompt(question: string, entityBlock: string, contextBlock: string): string {
  return `Användarens fråga:
${question}

EntityProfile (metadata — ej bevis, hallucinera aldrig nya personer):
${entityBlock}

WORM-bevis (reality_vault) — använd ENDAST dessa docId i citations:
${contextBlock}

Returnera JSON:
{"answer":"kort kliniskt svar på svenska","citations":[{"docId":"...","date":"YYYY-MM-DD","excerpt":"..."}],"theoryWithoutEvidence":false}

Du får anropa refine_vault_search högst en gång om kontexten är otillräcklig.`;
}

async function runValvChatGeneration(
  prompt: string,
  allowedDocIds: Set<string>,
  uid: string,
  enableTools: boolean,
): Promise<ValvChatResponse> {
  const config: Record<string, unknown> = {
    systemInstruction: SANNING_ANALYTIKERN_SYSTEM_PROMPT,
    temperature: 0.1,
    maxOutputTokens: 600,
  };

  if (enableTools) {
    config.tools = [{ functionDeclarations: [...VALV_CHAT_READ_TOOLS] }];
  }

  let contents: string | object = prompt;
  let toolRound = 0;

  while (toolRound < 2) {
    const response = await ai.models.generateContent({
      model: GEMINI_PRO,
      contents: contents as Parameters<typeof ai.models.generateContent>[0]['contents'],
      config,
    });

    const functionCalls = response.functionCalls;
    if (
      enableTools &&
      functionCalls &&
      functionCalls.length > 0 &&
      toolRound === 0
    ) {
      const call = functionCalls[0];
      if (call.name === 'refine_vault_search') {
        const args = call.args as { query?: string };
        const refinedQuery =
          typeof args?.query === 'string' && args.query.trim()
            ? args.query.trim()
            : prompt.slice(0, 200);
        const refinedChunks = await fetchVaultEvidenceForQuery(uid, refinedQuery);
        for (const c of refinedChunks) allowedDocIds.add(c.docId);
        contents = [
          { role: 'user', parts: [{ text: prompt }] },
          {
            role: 'model',
            parts: [{ functionCall: { name: call.name, args: call.args } }],
          },
          {
            role: 'user',
            parts: [
              {
                functionResponse: {
                  name: call.name,
                  response: {
                    chunks: refinedChunks.map((c) => ({
                      docId: c.docId,
                      date: c.date,
                      excerpt: c.truth.slice(0, 200),
                    })),
                  },
                },
              },
            ],
          },
        ] as object;
        toolRound += 1;
        continue;
      }
    }

    const raw = response.text ?? '';
    const parsed = validateValvChatResponse(
      tryParseJson(raw),
      allowedDocIds,
    );
    if (parsed) {
      const theoryWithoutEvidence =
        parsed.theoryWithoutEvidence ||
        (parsed.citations.length === 0 &&
          /\b(bevissaknas|saknas i valvet|kräver fler|hypotes|teori)\b/i.test(parsed.answer));
      return { ...parsed, theoryWithoutEvidence };
    }

    console.warn('[Valv-Chat] Kunde inte parsa JSON:', raw.slice(0, 200));
    return {
      answer: 'Kunde inte tolka AI-svaret. Försök formulera frågan kortare.',
      citations: [],
    };
  }

  return {
    answer: 'Kunde inte tolka AI-svaret. Försök formulera frågan kortare.',
    citations: [],
  };
}

function tryParseJson(raw: string): unknown {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function askValvChat(uid: string, question: string): Promise<ValvChatResponse> {
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

  const prompt = buildPrompt(
    question,
    entityBundle.contextBlock,
    buildContextBlock(chunks),
  );

  try {
    return await runValvChatGeneration(prompt, allowedDocIds, uid, true);
  } catch (error) {
    console.error('[Valv-Chat] Fel:', error);
    throw new Error('Valv-Chat kunde inte svara.');
  }
}
