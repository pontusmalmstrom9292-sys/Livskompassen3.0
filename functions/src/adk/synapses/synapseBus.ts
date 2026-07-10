/** @locked MOD-BACK-SYN — låst modul; unlock via docs/evaluations/*-unlock-MOD-BACK-SYN.md */
import type { SynapseEvent, SynapseTrigger } from '../types';
import type { AdkOrchestrator } from '../orchestrator';
import { handleDriveIngest } from './driveIngestSynapse';
import { handleDcapAlert } from './dcapAlertSynapse';
import { handleJournalWoven } from './journalWovenSynapse';
import { handleWidgetRecordingIngest } from './widgetRecordingIngestSynapse';
import { applyParalysBreak } from './paralysBrytarenSynapse';
import { handleKasamAggregation } from './kasamAggregationSynapse';
import type {
  DriveIngestPayload,
  JournalWovenPayload,
  DcapAlertPayload,
  WidgetRecordingIngestedPayload,
  KasamAggregationPayload,
} from '../types';

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
    return handleJournalWoven(p);
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
  widget_recording_ingested: async (orchestrator, event) => {
    const p = event.payload as unknown as WidgetRecordingIngestedPayload;
    return handleWidgetRecordingIngest(orchestrator, p, process.env.GEMINI_API_KEY);
  },
  kasam_aggregation: async (_orchestrator, event) => {
    const p = event.payload as unknown as KasamAggregationPayload;
    return handleKasamAggregation(p);
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
