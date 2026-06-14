import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { createGenAI } from '../lib/genaiClient';
import { submitInkastLiteForUser } from '../lib/submitInkastLite';

const SYSTEM_PROMPT = `Du är en intelligent röst-assistent för "Livskompassen". Användarens inmatning har transkriberats via Voice-to-Vault.
Ditt uppdrag är att klassificera huruvida texten är en uppgift (att-göra, 'task') eller en fakta/observation (anteckning, minne, bevis, 'vault_fact').

Om det är något som kräver en åtgärd framöver (ex. "påminn mig att...", "jag måste..."), returnera intent: 'task'.
Om det är en observation, en logg om barnen, ett minne, eller något som sagts (ex. "Kasper var ledsen", "Isabelle skickade sms"), returnera intent: 'vault_fact'.

Svara ENDAST med giltig JSON med följande schema:
{
  "intent": "task" | "vault_fact",
  "taskPayload": {
    "title": "Kortfattad rubrik, max 60 tecken",
    "summary": "Valfri längre beskrivning",
    "dueAt": "Valfritt datum i YYYY-MM-DD om användaren anger en tidpunkt, annars null"
  },
  "vaultFactPayload": {
    "summary": "Texten anpassad till en ren logg utan fyllnadsord"
  }
}
`;

export const parseVoiceCommand = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  const uid = request.auth.uid;
  const text = request.data?.transcript;

  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new HttpsError('invalid-argument', 'transcript saknas eller är tomt.');
  }

  try {
    const ai = createGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Transkriberad röstinmatning: "${text}"`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text ?? '{}';
    const parsed = JSON.parse(raw);
    const intent = parsed.intent;

    if (intent === 'task') {
      const payload = parsed.taskPayload || {};
      const title = payload.title || 'Ny uppgift från röst';
      
      const db = admin.firestore();
      const ref = db.collection('planning_tasks').doc();
      
      await ref.set({
        title: title,
        summary: payload.summary || text,
        status: 'todo',
        source: 'manual',
        userId: uid,
        ownerId: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...(payload.dueAt ? { dueAt: payload.dueAt } : {})
      });

      return {
        action: 'task_created',
        message: 'Uppgift tillagd i Planering',
        title: title
      };

    } else {
      // intent === 'vault_fact' or fallback
      const summary = parsed.vaultFactPayload?.summary || text;
      
      // Vi skickar in texten till Inkast. submitInkastLiteForUser
      // har inbyggd auto-routing till kunskap/bevis/barnen/dagbok/review.
      const result = await submitInkastLiteForUser(
        uid,
        {
          text: summary,
          sourceModule: 'voiceToVault'
        },
        undefined, // geminiApiKey
        false, // hasVaultSession
        request.auth?.token?.email_verified === true // isVerified
      );

      return {
        action: 'vault_fact_created',
        message: 'Sparat i Arkivet',
        inkastResult: result
      };
    }

  } catch (error) {
    console.error('parseVoiceCommand error:', error);
    throw new HttpsError('internal', 'Misslyckades att tolka röstkommandot.');
  }
});
