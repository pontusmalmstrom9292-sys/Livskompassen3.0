import type { A2AMessage } from '../../agents/types';
import { getAgentSystemPrompt } from '../../sharedRules';
import { createGenAI } from '../../lib/genaiClient';
import { selectModel, autoSelectTier } from '../../lib/modelRouter';

function buildUserPrompt(message: A2AMessage): string {
  const lines = [
    `Uppgift: ${message.intent}`,
    `Payload: ${JSON.stringify(message.payload)}`,
  ];
  return lines.join('\n');
}

/**
 * AgentExecutor — kör A2A-meddelande mot Gemini via Google AI API.
 * Modell väljs automatiskt: 3.1 Pro för djup analys, 3.5 Flash för snabba uppgifter.
 * RAG-kontext inlines i prompten (Vertex context cache borttagen Fas 3).
 */
export async function runExecutor(
  executorId: string,
  message: A2AMessage,
  ragContext: string[] = []
): Promise<string> {
  const systemInstruction = getAgentSystemPrompt(executorId, message.intent);

  const tier = autoSelectTier(message.intent, executorId);
  const modelId = selectModel(tier);

  console.log(`[runExecutor] ${executorId} intent=${message.intent} → model=${modelId}`);

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
