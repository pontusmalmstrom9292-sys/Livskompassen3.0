import { onCall } from 'firebase-functions/v2/https';
import { revokeVaultSession } from '../../lib/vaultSessionGate';
import { adkOrchestrator } from '../../adk';
import { supervisor } from '../shared';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';
import { clearVaultJwtClaims } from './helpers';

export const invalidateSession = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'invalidateSession', 30);

    await supervisor.invalidateUserSession(uid);
    await revokeVaultSession(uid);
    await clearVaultJwtClaims(uid);
    adkOrchestrator.clearContext(uid);
    console.log(`[invalidateSession] Session + vault JWT + ADK context rensad för uid=${uid}`);
    return { success: true };
  }
);
