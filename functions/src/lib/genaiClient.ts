import { GoogleGenAI } from '@google/genai';
import { GCP_PROJECT_ID, GCP_REGION } from '../config';

/** Cloud Functions: Google AI (apiKey) eller Vertex ADC. */
export function createGenAI(apiKeyOverride?: string): GoogleGenAI {
  const apiKey = (apiKeyOverride ?? process.env.GEMINI_API_KEY)?.trim();
  if (apiKey) {
    return new GoogleGenAI({ apiKey });
  }
  return new GoogleGenAI({
    vertexai: true,
    project: GCP_PROJECT_ID,
    location: GCP_REGION,
  });
}
