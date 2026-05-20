import type { SynapseEvent, SynapseTrigger } from '../types';
import type { AdkOrchestrator } from '../orchestrator';
import { handleDriveIngest } from './driveIngestSynapse';
import { applyParalysBreak } from './paralysBrytarenSynapse';
import type { DriveIngestPayload } from '../types';

type SynapseHandler = (
  orchestrator: AdkOrchestrator,
  event: SynapseEvent
) => Promise<unknown>;

const handlers: Record<SynapseTrigger, SynapseHandler> = {
  drive_file_ingested: async (orchestrator, event) => {
    const p = event.payload as unknown as DriveIngestPayload;
    return handleDriveIngest(orchestrator, p);
  },
  journal_woven: async (_orchestrator, event) => {
    console.log('[Synapse:bus] journal_woven stub', event.contextId);
    return { ok: true };
  },
  dcap_alert: async (_orchestrator, event) => {
    console.log('[Synapse:bus] dcap_alert stub', event.contextId);
    return { ok: true };
  },
  user_overwhelm: async (_orchestrator, event) => {
    const text = String(event.payload.text ?? '');
    const microSteps = await applyParalysBreak(text);
    return { microSteps };
  },
};

/** Sub-synaptiskt nätverk — routar triggers till rätt handler. */
export async function emitSynapse(
  orchestrator: AdkOrchestrator,
  event: SynapseEvent
): Promise<unknown> {
  const handler = handlers[event.trigger];
  if (!handler) {
    throw new Error(`Okänd synapse-trigger: ${event.trigger}`);
  }
  return handler(orchestrator, event);
}
