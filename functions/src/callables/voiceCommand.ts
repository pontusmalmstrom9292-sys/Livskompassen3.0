import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { createGenAI } from '../lib/genaiClient';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { submitInkastLiteForUser } from '../lib/submitInkastLite';
import { VOICE_COMMAND_SYSTEM_PROMPT } from '../sharedRules';

export const parseVoiceCommand = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'parseVoiceCommand', 15);
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
        systemInstruction: VOICE_COMMAND_SYSTEM_PROMPT,
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
