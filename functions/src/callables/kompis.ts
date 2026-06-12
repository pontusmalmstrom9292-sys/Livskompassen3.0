import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { geminiApiKey } from '../lib/geminiSecret';
import { GoogleGenAI } from '@google/genai';
import { KOMPIS_SYSTEM_PROMPT } from '../sharedRules';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatWithKompisRequest {
  history: ChatMessage[];
  message: string;
}

export interface ChatWithKompisResponse {
  reply: string;
}

/**
 * chatWithKompis
 * Backend-funktion för AI-Companion "Kompis".
 * Tar emot chatthistorik och ett nytt meddelande, verifierar användaren,
 * och anropar Gemini 1.5 Flash för att generera ett svar.
 */
export const chatWithKompis = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    secrets: [geminiApiKey],
  },
  async (request): Promise<ChatWithKompisResponse> => {
    // 1. Auth & App Check & Rate Limit (20 req/min)
    await guardSensitiveCallableV2(request, 'chatWithKompis', 20);

    const data = request.data as ChatWithKompisRequest;
    
    if (!data.message || typeof data.message !== 'string') {
      throw new HttpsError('invalid-argument', 'A valid message string is required.');
    }

    const history = Array.isArray(data.history) ? data.history : [];

    try {
      // 2. Initiera GenAI
      const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });

      // 3. Förbered konversationen
      // Historik förväntas vara i formatet { role: 'user'|'model', parts: [{ text: string }] }
      const contents = [
        ...history,
        {
          role: 'user',
          parts: [{ text: data.message }]
        }
      ];

      // 4. Anropa modellen
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: contents as any, // Cast to any to align with SDK expectations if needed
        config: {
          systemInstruction: KOMPIS_SYSTEM_PROMPT,
        }
      });

      if (!response.text) {
        throw new Error('Empty response from LLM');
      }

      // 5. Returnera
      return {
        reply: response.text,
      };

    } catch (error) {
      console.error('chatWithKompis error:', error);
      throw new HttpsError('internal', 'Kunde inte generera svar från Kompis.');
    }
  }
);
