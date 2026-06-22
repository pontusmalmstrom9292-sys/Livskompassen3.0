import type { A2AMessage } from '../../agents/types';
import { getAgentSystemPrompt } from '../../sharedRules';
import { createGenAI } from '../../lib/genaiClient';
import { getOrCreateCache, generateWithCache } from '../../lib/vertexCache';

const MODEL_ID = 'gemini-2.5-flash';

function buildUserPrompt(message: A2AMessage): string {
  const lines = [
    `Uppgift: ${message.intent}`,
    `Payload: ${JSON.stringify(message.payload)}`,
  ];
  return lines.join('\n');
}

/**
 * AgentExecutor — kör A2A-meddelande mot Gemini.
 * Använder GEMINI_API_KEY (AI Studio, gratis) om satt, annars Vertex ADC.
 * Context cache (Vertex-feature) används om RAG-kontext finns och API-nyckel saknas.
 */
export async function runExecutor(
  executorId: string,
  message: A2AMessage,
  ragContext: string[] = []
): Promise<string> {
  const systemInstruction = getAgentSystemPrompt(executorId, message.intent);
  const contextId = message.contextId ?? 'anonymous';

  if (ragContext.length > 0 && !process.env.GEMINI_API_KEY) {
    const cached = await getOrCreateCache(`adk_${executorId}_${contextId}`, {
      systemInstruction,
      backgroundDocuments: ragContext,
      ttlSeconds: 3600,
    }).catch((err) => {
      console.warn(`[runExecutor] Context cache skipped for ${executorId}:`, err);
      return null;
    });
    if (cached) {
      return generateWithCache(cached, buildUserPrompt(message));
    }
  }

  const ai = createGenAI();
  const userPrompt = ragContext.length > 0
    ? `${buildUserPrompt(message)}\n\nBAKGRUNDSKONTEXT:\n${ragContext.join('\n\n---\n\n')}`
    : buildUserPrompt(message);

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: userPrompt,
    config: {
      systemInstruction,
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  });

  return response.text ?? '';
}
