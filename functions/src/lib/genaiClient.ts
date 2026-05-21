import { GoogleGenAI } from '@google/genai';
import { GCP_PROJECT_ID, GCP_REGION } from '../config';

/** Cloud Functions: Vertex AI (ADC) eller GEMINI_API_KEY som fallback. */
export function createGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (apiKey) {
    return new GoogleGenAI({ apiKey });
  }
  return new GoogleGenAI({
    vertexai: true,
    project: GCP_PROJECT_ID,
    location: GCP_REGION,
  });
}
