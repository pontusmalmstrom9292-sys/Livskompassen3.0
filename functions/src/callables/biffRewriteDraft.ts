import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createGenAI } from '../lib/genaiClient';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { geminiApiKey } from '../lib/geminiSecret';
import { BIFF_REWRITE_DRAFT_SYSTEM_PROMPT } from '../sharedRules';
import {
  biffRewriteDraftFallback,
  parseBiffRewriteDraftJson,
  type BiffRewriteDraftResult,
} from '../lib/biffRewriteDraftParse';

const BIFF_REWRITE_MODEL = 'gemini-2.5-flash';

const BIFF_REWRITE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    cleanedText: { type: 'string' },
    toneCheck: { type: 'string', enum: ['pass', 'still_emotional', 'too_long'] },
  },
  required: ['cleanedText', 'toneCheck'],
} as const;

export type BiffRewriteContext = 'dagbok' | 'hamn' | 'inkast';

/**
 * Inline BIFF-tvätt av användarens utgående utkast — ingen WORM, ingen DCAP.
 */
export const biffRewriteDraft = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 60,
    secrets: [geminiApiKey],
  },
  async (request): Promise<BiffRewriteDraftResult> => {
    await guardSensitiveCallableV2(request, 'biffRewriteDraft', 20);

    const draft = (request.data as { draft?: unknown })?.draft;
    if (typeof draft !== 'string' || draft.trim().length === 0) {
      throw new HttpsError('invalid-argument', 'Fältet "draft" (string) krävs.');
    }

    const text = draft.trim();
    if (text.length < 10) {
      throw new HttpsError('invalid-argument', 'Utkastet måste vara minst 10 tecken.');
    }
    if (text.length > 4000) {
      throw new HttpsError('invalid-argument', 'Utkast får vara max 4000 tecken.');
    }

    const contextRaw = (request.data as { context?: unknown })?.context;
    const context: BiffRewriteContext =
      contextRaw === 'hamn' || contextRaw === 'inkast' ? contextRaw : 'dagbok';

    try {
      const ai = createGenAI(geminiApiKey.value());
      const response = await ai.models.generateContent({
        model: BIFF_REWRITE_MODEL,
        contents: `Kontext: ${context}\n\nUtkast att tvätta enligt BIFF:\n${text}`,
        config: {
          systemInstruction: BIFF_REWRITE_DRAFT_SYSTEM_PROMPT,
          temperature: 0.15,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
          responseSchema: BIFF_REWRITE_JSON_SCHEMA,
        },
      });

      const raw = response.text?.trim() ?? '';
      if (!raw) {
        console.warn('[biffRewriteDraft] Tomt LLM-svar — fallback');
        return biffRewriteDraftFallback(text);
      }

      try {
        return parseBiffRewriteDraftJson(raw, text);
      } catch (parseErr) {
        console.warn('[biffRewriteDraft] JSON-parse misslyckades:', parseErr);
        return biffRewriteDraftFallback(text);
      }
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error('[biffRewriteDraft] Fel:', error);
      return biffRewriteDraftFallback(text);
    }
  },
);
