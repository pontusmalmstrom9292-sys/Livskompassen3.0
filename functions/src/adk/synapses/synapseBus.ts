import type { SynapseEvent, SynapseTrigger } from '../types';
import type { AdkOrchestrator } from '../orchestrator';
import { appendMutation } from '../stateStore';
import { handleDriveIngest } from './driveIngestSynapse';
import { handleDcapAlert } from './dcapAlertSynapse';
import { handleJournalWoven } from './journalWovenSynapse';
import { applyParalysBreak } from './paralysBrytarenSynapse';
import type { DriveIngestPayload, JournalWovenPayload, DcapAlertPayload } from '../types';

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
    const p = event.payload as unknown as JournalWovenPayload;
    const result = await handleJournalWoven(p);
    const contextId = event.contextId ?? p.ownerId;
    appendMutation(contextId, {
      fromAgentId: 'synapse_journal_woven',
      toAgentId: 'kampspar',
      intent: 'journal_woven',
      payload: {
        journalEntryId: p.journalEntryId,
        mood: p.mood,
        optIn: true,
        idempotent: result.idempotent === true,
      },
    });
    return result;
  },
  dcap_alert: async (_orchestrator, event) => {
    const p = event.payload as unknown as DcapAlertPayload;
    return handleDcapAlert(p);
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
