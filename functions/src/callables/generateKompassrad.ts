import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createGenAI } from '../lib/genaiClient';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { geminiApiKey } from '../lib/geminiSecret';
import {
  appendAdaptationSemanticContext,
  loadAdaptationSemanticContext,
} from '../lib/adaptationSemanticContext';
import { KOMPASSRAD_SYSTEM_PROMPT } from '../sharedRules';

const MODEL = 'gemini-2.5-flash';

export type KompassradFlow = 'morgon' | 'dag' | 'kvall';

export interface GenerateKompassradResult {
  advice: string;
  tag: 'biff' | 'no-jade' | 'parallel' | 'rest';
  flow: KompassradFlow;
}

function parseFlow(value: unknown): KompassradFlow {
  if (value === 'morgon' || value === 'dag' || value === 'kvall') return value;
  const hour = new Date().getHours();
  if (hour < 11) return 'morgon';
  if (hour < 18) return 'dag';
  return 'kvall';
}

function fallback(flow: KompassradFlow): GenerateKompassradResult {
  const advice =
    flow === 'morgon'
      ? 'Ett steg i taget idag — logistik först, känslor senare.'
      : flow === 'kvall'
        ? 'Avsluta dagen utan att svara på nya beten.'
        : 'Håll svaren korta och sakliga — BIFF räcker.';
  return { advice, tag: 'biff', flow };
}

export const generateKompassrad = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 45,
    secrets: [geminiApiKey],
  },
  async (request): Promise<GenerateKompassradResult> => {
    const uid = await guardSensitiveCallableV2(request, 'generateKompassrad', 20);

    const flow = parseFlow((request.data as { flow?: unknown })?.flow);
    const adaptationContext = await loadAdaptationSemanticContext(uid);

    try {
      const ai = createGenAI(geminiApiKey.value());
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: `Dygnsfas: ${flow}\nGe ett kompassråd.`,
        config: {
          systemInstruction: appendAdaptationSemanticContext(
            KOMPASSRAD_SYSTEM_PROMPT,
            adaptationContext,
          ),
          temperature: 0.2,
          maxOutputTokens: 256,
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text?.trim() ?? '';
      if (!raw) return fallback(flow);

      const parsed = JSON.parse(raw) as { advice?: string; tag?: string };
      const advice = typeof parsed.advice === 'string' ? parsed.advice.trim() : '';
      if (!advice) return fallback(flow);

      const tagRaw = String(parsed.tag ?? 'biff');
      const tag: GenerateKompassradResult['tag'] =
        tagRaw === 'no-jade' || tagRaw === 'parallel' || tagRaw === 'rest' ? tagRaw : 'biff';

      return { advice, tag, flow };
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.warn('[generateKompassrad] fallback:', error);
      return fallback(flow);
    }
  },
);
