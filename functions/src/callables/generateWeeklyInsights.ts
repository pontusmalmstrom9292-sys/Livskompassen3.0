import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { geminiApiKey } from '../lib/geminiSecret';
import { GoogleGenAI } from '@google/genai';
import { getAgentSystemPrompt } from '../sharedRules';

export const generateWeeklyInsights = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    secrets: [geminiApiKey],
    timeoutSeconds: 60,
  },
  async (request): Promise<any> => {
    const uid = await guardSensitiveCallableV2(request, 'generateWeeklyInsights', 5);

    const db = admin.firestore();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const timestamp = admin.firestore.Timestamp.fromDate(sevenDaysAgo);

    try {
      // 1. Fetch user_insights (last 7 days)
      const insightsSnap = await db.collection('user_insights')
        .where('ownerId', '==', uid)
        .where('createdAt', '>=', timestamp)
        .orderBy('createdAt', 'desc')
        .get();

      // 2. Fetch user_daily_focus history (last 7 days)
      const isoDateString = sevenDaysAgo.toISOString().slice(0, 10);
      const focusHistorySnap = await db.collection('user_daily_focus')
        .doc(uid)
        .collection('history')
        .where('date', '>=', isoDateString)
        .orderBy('date', 'desc')
        .get();

      const insightsDocs = insightsSnap.docs.map(d => d.data());
      const focusDocs = focusHistorySnap.docs.map(d => d.data());

      // 3. Fetch vault entries (last 7 days)
      const vaultSnap = await db.collection('vault')
        .where('ownerId', '==', uid)
        .where('timestamp', '>=', timestamp)
        .orderBy('timestamp', 'desc')
        .get();
      const vaultDocs = vaultSnap.docs.map(d => d.data());

      if (insightsDocs.length === 0 && focusDocs.length === 0 && vaultDocs.length === 0) {
        return {
          weeklySummary: 'Inte tillräckligt med data (dagligt fokus/insikter/valv) från de senaste 7 dagarna för att dra slutsatser.',
          detectedPatterns: [],
          focusVsSentiment: 'Ingen data tillgänglig.',
          actionableAdvice: 'Börja sätta dagligt fokus och reflektera för att bygga din insiktsmotor.'
        };
      }

      // Format data for LLM
      const formatInsights = (docs: admin.firestore.DocumentData[]) => {
        return docs.map(d => {
          const date = (d.createdAt as admin.firestore.Timestamp)?.toDate().toISOString().slice(0, 10) || 'Okänt datum';
          const text = d.text || '';
          const category = d.category || 'Generell';
          return `- [${date}] (${category}) ${text}`;
        }).join('\n');
      };

      const formatFocus = (docs: admin.firestore.DocumentData[]) => {
        return docs.map(d => {
          const date = d.date || 'Okänt datum';
          const points = (d.focusPoints || []).filter(Boolean).join(', ');
          return `- [${date}] Fokus: ${points}`;
        }).join('\n');
      };

      const formatVault = (docs: admin.firestore.DocumentData[]) => {
        return docs.map(d => {
          const date = (d.timestamp as admin.firestore.Timestamp)?.toDate().toISOString().slice(0, 10) || 'Okänt datum';
          const text = d.content || '';
          return `- [${date}] Valv-post: ${text}`;
        }).join('\n');
      };

const promptData = `
Användarens data (senaste 7 dagarna):

--- Dagligt Fokus ---
${formatFocus(focusDocs) || 'Ingen fokusdata registrerad.'}

--- Insikter & Reflektioner ---
${formatInsights(insightsDocs) || 'Inga insikter registrerade.'}

--- Valv-poster (Oföränderliga bevis) ---
${formatVault(vaultDocs) || 'Inga valv-poster registrerade.'}
`;

      const systemPrompt = getAgentSystemPrompt('agent_monster_arkivarien');

      const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: [
          { role: 'user', parts: [{ text: promptData }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const responseText = response.text || '{}';
      const parsedJson = JSON.parse(responseText);

      // Save to insight_summaries collection (WORM)
      const summaryRef = db.collection('insight_summaries').doc();
      await summaryRef.set({
        id: summaryRef.id,
        ownerId: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        startDate: timestamp,
        endDate: admin.firestore.FieldValue.serverTimestamp(),
        ...parsedJson
      });

      return parsedJson;
    } catch (error) {
      console.error('generateWeeklyInsights error:', error);
      throw new HttpsError('internal', 'Kunde inte generera insikter.');
    }
  }
);
