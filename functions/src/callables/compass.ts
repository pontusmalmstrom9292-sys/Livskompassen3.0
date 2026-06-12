import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { geminiApiKey } from '../lib/geminiSecret';
import { GoogleGenAI } from '@google/genai';
import { KOMPASS_INSIKT_SYSTEM_PROMPT } from '../sharedRules';

export interface CompassInsightResponse {
  journalCount: number;
  vaultCount: number;
  streak: number;
  dominantEmotion: string | null;
  latestInsight: string;
  recommendedPhase: 'morgon' | 'dag' | 'kvall';
  generatedAt: string;
}

const LOOKBACK_DAYS = 7;

function computeStreak(journalDocs: admin.firestore.DocumentData[]): number {
  if (journalDocs.length === 0) return 0;

  const daysWithActivity = new Set<string>();
  for (const doc of journalDocs) {
    const ts = doc.createdAt as admin.firestore.Timestamp | undefined;
    if (!ts) continue;
    const date = ts.toDate();
    daysWithActivity.add(date.toISOString().slice(0, 10));
  }

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < LOOKBACK_DAYS; i++) {
    const check = new Date(today);
    check.setDate(today.getDate() - i);
    const key = check.toISOString().slice(0, 10);
    if (daysWithActivity.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Anropar Gemini 1.5 Flash för att generera en kompassinsikt baserat på senaste 7 dagarnas data.
 */
async function generateInsightFromLLM(data: {
  journalCount: number;
  vaultCount: number;
  streak: number;
  emotions: string[];
}): Promise<{ dominantEmotion: string | null; latestInsight: string; recommendedPhase: 'morgon' | 'dag' | 'kvall' }> {
  
  const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });

  const prompt = `
Data från de senaste 7 dagarna:
- Dagboksinlägg: ${data.journalCount}
- Valv-inlägg (bevis): ${data.vaultCount}
- Nuvarande streak: ${data.streak} dagar
- Känslor under perioden: ${data.emotions.length > 0 ? data.emotions.join(', ') : 'Inga angivna'}

Generera ett svar i JSON-format med följande struktur:
{
  "dominantEmotion": "string eller null",
  "latestInsight": "string",
  "recommendedPhase": "morgon" | "dag" | "kvall"
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: KOMPASS_INSIKT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      }
    });

    if (!response.text) {
      throw new Error("Empty response from LLM");
    }

    const parsed = JSON.parse(response.text);

    return {
      dominantEmotion: parsed.dominantEmotion || null,
      latestInsight: parsed.latestInsight || 'Inga inlägg den här veckan — börja med ett mikrosteg.',
      recommendedPhase: ['morgon', 'dag', 'kvall'].includes(parsed.recommendedPhase) ? parsed.recommendedPhase : 'dag'
    };
  } catch (error) {
    console.error("Gemini fallback error:", error);
    // Fallback if the call fails
    const total = data.journalCount + data.vaultCount;
    let latestInsight = '';
    if (total === 0) {
      latestInsight = 'Inga inlägg den här veckan — börja med ett mikrosteg.';
    } else if (total >= 5) {
      latestInsight = `Starkt! ${total} inlägg den här veckan. Din röst dokumenteras.`;
    } else {
      latestInsight = `${total} inlägg hittills denna vecka. Varje ord räknas.`;
    }

    let dominantEmotion = null;
    if (data.emotions.length > 0) {
      dominantEmotion = data.emotions[0];
    }

    const hour = new Date().getHours();
    let recommendedPhase: 'morgon' | 'dag' | 'kvall' = 'dag';
    if (hour >= 5 && hour < 12) recommendedPhase = 'morgon';
    else if (hour >= 17 || hour < 5) recommendedPhase = 'kvall';

    return { dominantEmotion, latestInsight, recommendedPhase };
  }
}

/**
 * generateCompassInsight
 * Lättviktig, WORM-säker aggregeringsfunktion.
 * Läser journal och reality_vault för de senaste 7 dagarna och genererar en AI-insikt.
 * Enbart läsning — ingen modifiering av data!
 */
export const generateCompassInsight = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    secrets: [geminiApiKey],
  },
  async (request): Promise<CompassInsightResponse> => {
    // 1. Auth & App Check & Rate Limit (20 req/min)
    const uid = await guardSensitiveCallableV2(request, 'generateCompassInsight', 20);

    const db = admin.firestore();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - LOOKBACK_DAYS);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const timestamp = admin.firestore.Timestamp.fromDate(sevenDaysAgo);

    try {
      // 2. WORM-säker läsning (Endast filter på ownerId och datum)
      const journalPromise = db.collection('journal')
        .where('ownerId', '==', uid)
        .where('createdAt', '>=', timestamp)
        .orderBy('createdAt', 'desc')
        .get();

      const vaultPromise = db.collection('reality_vault')
        .where('ownerId', '==', uid)
        .where('createdAt', '>=', timestamp)
        .orderBy('createdAt', 'desc')
        .get();

      const [journalSnap, vaultSnap] = await Promise.all([journalPromise, vaultPromise]);

      const journalDocs = journalSnap.docs.map(d => d.data());

      // 3. Aggregera
      const journalCount = journalSnap.size;
      const vaultCount = vaultSnap.size;
      const streak = computeStreak(journalDocs);

      // Extrahera emotion-data (om tillgängligt i journalDocs)
      const emotions = journalDocs
        .map(doc => doc.emotion as string | undefined)
        .filter((e): e is string => !!e);

      // 4. LLM Abstraktion
      const { dominantEmotion, latestInsight, recommendedPhase } = await generateInsightFromLLM({
        journalCount,
        vaultCount,
        streak,
        emotions,
      });

      // 5. Returnera
      return {
        journalCount,
        vaultCount,
        streak,
        dominantEmotion,
        latestInsight,
        recommendedPhase,
        generatedAt: new Date().toISOString(),
      };

    } catch (error) {
      console.error('generateCompassInsight error:', error);
      throw new HttpsError('internal', 'Kunde inte generera kompassinsikt.');
    }
  }
);
