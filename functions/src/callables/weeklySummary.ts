import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { vaultSessionGrantsVaultRead } from '../lib/vaultSessionGate';
import { geminiApiKey } from '../lib/geminiSecret';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_FLASH } from '../lib/modelRouter';

export const generateWeeklySummary = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    secrets: [geminiApiKey],
    timeoutSeconds: 60,
  },
  async (request): Promise<{ summary: string }> => {
    // 1. Auth & App Check
    const uid = await guardSensitiveCallableV2(request, 'generateWeeklySummary', 5);

    const db = admin.firestore();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const timestamp = admin.firestore.Timestamp.fromDate(sevenDaysAgo);

    try {
      // 2. Query Journal and Vault
      const journalSnap = await db.collection('journal')
        .where('ownerId', '==', uid)
        .where('createdAt', '>=', timestamp)
        .orderBy('createdAt', 'desc')
        .get();

      const journalDocs = journalSnap.docs.map(d => d.data());

      const includeVault = await vaultSessionGrantsVaultRead(uid, request.data);
      let vaultDocs: admin.firestore.DocumentData[] = [];
      if (includeVault) {
        const vaultSnap = await db.collection('reality_vault')
          .where('ownerId', '==', uid)
          .where('createdAt', '>=', timestamp)
          .orderBy('createdAt', 'desc')
          .get();
        vaultDocs = vaultSnap.docs.map(d => d.data());
      }

      if (journalDocs.length === 0 && vaultDocs.length === 0) {
        return { 
          summary: 'Du har inga inlägg från de senaste 7 dagarna. Skriv gärna något i journalen för att få en veckosammanfattning nästa gång!' 
        };
      }

      // 3. Format data for LLM
      const formatEntries = (docs: admin.firestore.DocumentData[]) => {
        return docs.map(d => {
          const date = (d.createdAt as admin.firestore.Timestamp)?.toDate().toISOString().slice(0, 10) || 'Okänt datum';
          const content = d.content || d.text || '';
          return `- [${date}] ${content}`;
        }).join('\n');
      };

      const journalText = formatEntries(journalDocs);
      const vaultText = formatEntries(vaultDocs);

      // 4. Construct System Prompt
      const promptText = `
Du är en analytisk, stärkande expertgrupp för Livskompassen.
Din uppgift är att skriva en objektiv men validerande veckosammanfattning baserad på användarens inlägg från de senaste 7 dagarna.

Fokusera på:
1. Satta gränser och hur de upprätthölls.
2. Varningssignaler eller röda flaggor (t.ex. hög stress, ångest, överbelastning).
3. Allmänt välbefinnande, identifierade mönster och framsteg.

Du MÅSTE inkludera och använda exakt dessa Markdown-rubriker (H2 / ##):
## Observerade mönster
## Upprätthållna gränser
## Röda flaggor/inkonsekvenser

Skriv på svenska. Var objektiv, validerande, stärkande och ge konstruktiv pepp.
Undvik att hitta på information. Om det saknas underlag för en rubrik, nämn kort att inget anmärkningsvärt hittades.

Här är veckans data:
--- Dagboksinlägg ---
${journalText || 'Inga dagboksinlägg.'}

--- Reality Vault-inlägg ---
${vaultText || 'Inga reality vault-inlägg.'}
`;

      // 5. Call LLM
      const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
      const response = await ai.models.generateContent({
        model: GEMINI_FLASH,
        contents: promptText,
      });

      return { summary: response.text || 'Kunde inte generera sammanfattning just nu.' };

    } catch (error) {
      console.error('generateWeeklySummary error:', error);
      throw new HttpsError('internal', 'Kunde inte hämta eller analysera veckosammanfattningen.');
    }
  }
);
