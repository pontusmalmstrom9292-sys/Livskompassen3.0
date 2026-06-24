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
    memory: '512MiB', // Increase memory for batch processing
  },
  async () => {
    console.log('[scheduledTransactionsAnalysis] Starting nightly batch job for transactions.');
    const db = admin.firestore();
    const ai = createGenAI();

    const cutoffMs = Date.now() - 24 * 60 * 60 * 1000;
    const cutoff = admin.firestore.Timestamp.fromMillis(cutoffMs);

    // 1. Single Efficient Query
    const txSnap = await db
      .collectionGroup('transactions')
      .where('createdAt', '>=', cutoff)
      .get();

    if (txSnap.empty) {
      console.log('[scheduledTransactionsAnalysis] No recent transactions found. Exiting.');
      return;
    }

    // 2. Group Transactions by User
    const userTransactions = new Map<string, any[]>();
    txSnap.forEach(doc => {
      const tx = doc.data();
      if (!tx.userId) return;

      const userTxs = userTransactions.get(tx.userId) || [];
      userTxs.push(tx);
      userTransactions.set(tx.userId, userTxs);
    });

    const userIds = Array.from(userTransactions.keys());
    let processedUsers = 0;

    // 3. Process Users in Batches
    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      const batchUserIds = userIds.slice(i, i + BATCH_SIZE);

      const batchPromptData = batchUserIds.map(uid => {
        const txs = userTransactions.get(uid) || [];
        const txLines = txs.map(t => `- ${t.label}: ${t.amountSek} kr (${t.category})`).join('\n');
        return `
---
userId: ${uid}
Transactions:
${txLines}
---
`;
      }).join('');

      const prompt = `
You are Kompis, a supportive AI that generates multiple economic summaries in one go.
For each user block provided below, write a short, encouraging summary (max 3 sentences) of their daily economy.

Respond with ONLY a single valid JSON object, where each key is the user's ID and the value is the generated text.
Do not include any other text, markdown, or explanations.

Example format:
{
  "user_id_1": "Your summary for user 1...",
  "user_id_2": "Your summary for user 2..."
}

Here are the user blocks:
${batchPromptData}
`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            systemInstruction: "You are an AI that generates multiple JSON responses in a single turn.",
            temperature: 0.7,
            responseMimeType: 'application/json',
          }
        });

        const batchResults = JSON.parse(response.text?.trim() || '{}');

        // 4. Ingest Results for the Batch
        for (const [uid, factText] of Object.entries(batchResults)) {
          if (typeof factText === 'string' && factText.trim()) {
            await ingestKampsparForUser(uid, {
              title: 'Dagens Ekonomiska Pepp',
              content: factText.trim(),
              category: 'ekonomi',
              entryType: 'FACT',
              source: 'batch_transactions_analysis',
            });
            processedUsers++;
          }
        }
      } catch (err) {
        console.error(`[scheduledTransactionsAnalysis] Failed to process batch from index ${i}:`, err);
      }
    }

    console.log(`[scheduledTransactionsAnalysis] Complete. Analyzed transactions for ${processedUsers} users.`);
  }
);
