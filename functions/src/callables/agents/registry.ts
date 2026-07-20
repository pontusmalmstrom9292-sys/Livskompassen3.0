import { onCall } from 'firebase-functions/v2/https';
import { listAgentCards } from '../../adk';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';

export const getAgentRegistry = onCall(
  { region: 'europe-west1' },
  async (request) => {
    await guardSensitiveCallableV2(request, 'getAgentRegistry', 30);
    return { agents: listAgentCards() };
  }
);
