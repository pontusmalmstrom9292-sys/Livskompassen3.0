import type { A2AMessage } from '../../agents/types';
import { getAgentSystemPrompt } from '../../sharedRules';
import { createGenAI } from '../../lib/genaiClient';
import { selectModel, autoSelectTier } from '../../lib/modelRouter';
import { getOrCreateCache, generateWithCache } from '../../lib/vertexCache';

function buildUserPrompt(message: A2AMessage): string {
  const lines = [
    `Uppgift: ${message.intent}`,
    `Payload: ${JSON.stringify(message.payload)}`,
  ];
  return lines.join('\n');
}

/**
 * AgentExecutor — kör A2A-meddelande mot Gemini.
 * Modell väljs automatiskt: 3.1 Pro för djup analys, 3.5 Flash för snabba uppgifter.
 * Använder GEMINI_API_KEY (AI Studio, gratis) om satt, annars Vertex ADC.
 */
export async function runExecutor(
  executorId: string,
  message: A2AMessage,
  ragContext: string[] = []
): Promise<string> {
  const systemInstruction = getAgentSystemPrompt(executorId, message.intent);
  const contextId = message.contextId ?? 'anonymous';

  const tier = autoSelectTier(message.intent, executorId);
  const modelId = selectModel(tier);

  console.log(`[runExecutor] ${executorId} intent=${message.intent} → model=${modelId}`);

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
    model: modelId,
    contents: userPrompt,
    config: {
      systemInstruction,
      temperature: tier === 'pro' ? 0.15 : 0.2,
      maxOutputTokens: tier === 'pro' ? 2048 : 1024,
    },
  });

  return response.text ?? '';
}
