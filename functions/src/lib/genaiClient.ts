import { GoogleGenAI } from '@google/genai';

/** Cloud Functions: Google AI via GEMINI_API_KEY (Vertex fallback borttagen Fas 3). */
export function createGenAI(apiKeyOverride?: string): GoogleGenAI {
  const apiKey = (apiKeyOverride ?? process.env.GEMINI_API_KEY)?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY saknas — Google AI API krävs.');
  }
  return new GoogleGenAI({ apiKey });
}
