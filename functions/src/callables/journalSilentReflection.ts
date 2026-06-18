import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createGenAI } from '../lib/genaiClient';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { geminiApiKey } from '../lib/geminiSecret';
import { JOURNAL_SILENT_REFLECTION_PROMPT } from '../sharedRules';

const MODEL = 'gemini-2.5-flash';

export interface JournalSilentReflectionResult {
  prompt: string;
}

const FALLBACK_PROMPTS = [
  'Vad känns mest sant i kroppen just nu — utan att förklara?',
  'Vilket är ett litet steg du kan ta utan att försvara dig?',
  'Vad behöver du inte svara på idag?',
];

export const journalSilentReflection = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 45,
    secrets: [geminiApiKey],
  },
  async (request): Promise<JournalSilentReflectionResult> => {
    await guardSensitiveCallableV2(request, 'journalSilentReflection', 15);

    const moodHint = (request.data as { moodHint?: unknown })?.moodHint;
    const hint =
      typeof moodHint === 'string' && moodHint.trim().length > 0
        ? moodHint.trim().slice(0, 120)
        : 'neutral';

    try {
      const ai = createGenAI(geminiApiKey.value());
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: `Humörhint (valfritt): ${hint}`,
        config: {
          systemInstruction: JOURNAL_SILENT_REFLECTION_PROMPT,
          temperature: 0.35,
          maxOutputTokens: 128,
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text?.trim() ?? '';
      if (!raw) {
        return { prompt: FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)] };
      }

      const parsed = JSON.parse(raw) as { prompt?: string };
      const prompt = typeof parsed.prompt === 'string' ? parsed.prompt.trim() : '';
      if (!prompt) {
        return { prompt: FALLBACK_PROMPTS[0] };
      }
      return { prompt };
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.warn('[journalSilentReflection] fallback:', error);
      return { prompt: FALLBACK_PROMPTS[0] };
    }
  },
);
