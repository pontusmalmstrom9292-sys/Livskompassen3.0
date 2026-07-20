import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { askUppgiftsKrossaren } from '../../agents/vertexAgent';
import { adkOrchestrator } from '../../adk';
import type { MicroStep } from '../../adk/types';
import { emitSynapse } from '../../adk/synapses/synapseBus';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';

export const breakDownResponse = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'breakDownResponse', 30);

    const text = request.data.text;
    if (!text || typeof text !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "text" (string) krävs.');
    }

    if (text.length > 12000) {
      throw new HttpsError('invalid-argument', 'Text får vara max 12000 tecken.');
    }

    const result = (await emitSynapse(adkOrchestrator, {
      trigger: 'user_overwhelm',
      contextId: uid,
      payload: { text },
    })) as { microSteps: MicroStep[] };
    return { microSteps: result.microSteps };
  }
);

export const crushTask = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    await guardSensitiveCallableV2(request, 'crushTask', 20);

    const task = request.data.task;
    if (!task || typeof task !== 'string') {
      throw new HttpsError('invalid-argument', 'Fältet "task" (string) krävs.');
    }

    if (task.length > 1000) {
      throw new HttpsError('invalid-argument', 'Uppgiften får vara max 1000 tecken.');
    }

    const atoms = await askUppgiftsKrossaren(task, process.env.GEMINI_API_KEY);
    return { atoms };
  }
);
