import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
  generatePayslipInternal,
  generatePayslipsForAllProfiles,
} from '../../economy/generatePayslipInternal';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';

export const scheduledGeneratePayslip = onSchedule(
  { schedule: '0 8 16 * *', timeZone: 'Europe/Stockholm', region: 'europe-west1' },
  async () => {
    console.log('[scheduledGeneratePayslip] Startar…');
    const count = await generatePayslipsForAllProfiles();
    console.log(`[scheduledGeneratePayslip] Klar. ${count} lönespec(er).`);
  }
);

export const generatePayslip = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'generatePayslip', 5);

    const period =
      request.data?.periodFrom && request.data?.periodTo
        ? { from: String(request.data.periodFrom), to: String(request.data.periodTo) }
        : undefined;

    try {
      return await generatePayslipInternal(uid, { period });
    } catch (error) {
      console.error('[generatePayslip] Fel:', error);
      throw new HttpsError(
        'internal',
        error instanceof Error ? error.message : 'Lönespec misslyckades.',
      );
    }
  }
);
