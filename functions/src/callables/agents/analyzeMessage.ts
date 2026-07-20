import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { assertVaultSession } from '../../lib/vaultSessionGate';
import { geminiApiKey } from '../../lib/geminiSecret';
import { supervisor } from '../shared';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';

export const analyzeMessage = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'analyzeMessage', 30);

    const message = request.data.message;
    // U1 — klient får aldrig injicera RAG-kontext (prompt injection / cross-silo).
    if (Array.isArray(request.data.ragContext) && request.data.ragContext.length > 0) {
      console.warn(
        `[analyzeMessage] Ignorerar klient-supplied ragContext (${request.data.ragContext.length} poster) uid=${uid}`,
      );
    }
    const ragContext: string[] = [];

    if (!message || typeof message !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "message" (string) krävs.');
    }

    if (message.length > 5000) {
      throw new HttpsError('invalid-argument', 'Meddelandet får vara max 5000 tecken.');
    }

    const preferGransArkitekten =
      request.data.module === 'safe_harbor' ||
      request.data.module === 'valv_orkester' ||
      request.data.preferGransArkitekten === true;

    if (request.data.module === 'valv_orkester') {
      await assertVaultSession(uid, request.data);
    }

    try {
      const result = await supervisor.handleUserRequest(message, uid, ragContext, {
        preferGransArkitekten,
      });
      console.log(
        `[analyzeMessage] agent=${result.agentId} DCAP riskScore=${result.dcap?.riskScore} för uid=${uid}`
      );
      return result;
    } catch (error) {
      console.error('[analyzeMessage] Fel:', error);
      throw new HttpsError('internal', 'Analys misslyckades. Försök igen.');
    }
  }
);
