import { VertexAI } from '@google-cloud/vertexai';
import type { A2AMessage } from '../../agents/types';
import { GCP_PROJECT_ID, GCP_REGION } from '../../config';
import { getAgentSystemPrompt } from '../../sharedRules';
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
 * AgentExecutor — kör A2A-meddelande mot Vertex med prompt från sharedRules.
 */
export async function runExecutor(
  executorId: string,
  message: A2AMessage,
  ragContext: string[] = []
): Promise<string> {
  const systemInstruction = getAgentSystemPrompt(executorId);
  const contextId = message.contextId ?? 'anonymous';

  if (ragContext.length > 0) {
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

  const vertexai = new VertexAI({ project: GCP_PROJECT_ID, location: GCP_REGION });
  const model = vertexai.preview.getGenerativeModel({
    model: MODEL_ID,
    systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: buildUserPrompt(message) }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
  });

  return result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}
