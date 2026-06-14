import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { geminiApiKey } from '../lib/geminiSecret';
import { GoogleGenAI } from '@google/genai';
import { EXPERT_PROMPTS } from '../expertPrompts';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatWithKompisRequest {
  history: ChatMessage[];
  message: string;
  expertId?: string;
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
      const uid = request.auth?.uid;
      if (!uid) {
        throw new HttpsError('unauthenticated', 'Kräver inloggning.');
      }

      // 1.5 Hämta dagbokskontext (U1 — aldrig reality_vault utan vault session)
      const db = admin.firestore();
      const journalSnap = await db.collection('journal')
        .where('ownerId', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

      const entries: { date: Date; text: string }[] = [];

      journalSnap.forEach(doc => {
        const d = doc.data();
        const content = d.text || d.truth;
        if (content) {
          entries.push({
            date: d.createdAt?.toDate() || new Date(),
            text: content,
          });
        }
      });

      entries.sort((a, b) => a.date.getTime() - b.date.getTime());

      let contextBlock = '';
      if (entries.length > 0) {
        contextBlock = `\n\nHär är användarens senaste dagboksinlägg (som kontext för dig):\n`;
        entries.forEach(e => {
          const dateStr = e.date.toISOString().split('T')[0];
          contextBlock += `[${dateStr}]: ${e.text.slice(0, 1000)}\n`;
        });
      }

      const basePrompt = EXPERT_PROMPTS[data.expertId || 'default'] || EXPERT_PROMPTS['default'];
      const dynamicSystemInstruction = `${basePrompt}${contextBlock}`;

      // 2. Initiera GenAI
      const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });

      // 3. Förbered konversationen
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
        contents: contents as any,
        config: {
          systemInstruction: dynamicSystemInstruction,
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
