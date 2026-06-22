import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import { GCP_REGION } from '../config';
import { ingestKampsparForUser } from '../lib/ingestKampsparInternal';
import { createGenAI } from '../lib/genaiClient';

export const scheduledTransactionsAnalysis = onSchedule(
  {
    schedule: '0 2 * * *',
    region: GCP_REGION,
    timeZone: 'Europe/Stockholm',
  },
  async () => {
    console.log('[scheduledTransactionsAnalysis] Startar nattligt batch-jobb för transactions.');
    const db = admin.firestore();
    const ai = createGenAI();
    
    const usersSnap = await db.collection('users').get();
    let processedUsers = 0;

    const cutoffMs = Date.now() - 24 * 60 * 60 * 1000;
    const cutoff = admin.firestore.Timestamp.fromMillis(cutoffMs);

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;

      const txSnap = await db
        .collection('transactions')
        .where('userId', '==', uid)
        .where('createdAt', '>=', cutoff)
        .get();

      if (txSnap.empty) continue;

      const transactions = txSnap.docs.map(doc => doc.data());
      
      const prompt = `Du är Kompis, en stöttande AI. Användaren har registrerat följande ekonomiska transaktioner senaste dygnet:
${transactions.map(t => `- ${t.label}: ${t.amountSek} kr (${t.category})`).join('\n')}

Skriv en kort, peppande textuell sammanfattning (FACT) av deras dagliga ekonomi. Ge bara textuell pepp, inga grafer eller onödig formatering. Max 3 meningar.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: "Skriv endast den peppande texten. Ingen inledning, ingen avslutning.",
            temperature: 0.7,
          }
        });
        
        const factText = response.text?.trim() || 'Bra jobbat med din ekonomiska registrering idag!';

        await ingestKampsparForUser(uid, {
          title: 'Dagens Ekonomiska Pepp',
          content: factText,
          category: 'ekonomi',
          entryType: 'FACT',
          source: 'batch_transactions_analysis',
        });

        processedUsers++;
      } catch (err) {
        console.error(`[scheduledTransactionsAnalysis] Fel för uid=${uid}:`, err);
      }
    }

    console.log(`[scheduledTransactionsAnalysis] Klart. Analyserade transaktioner för ${processedUsers} användare.`);
  }
);
