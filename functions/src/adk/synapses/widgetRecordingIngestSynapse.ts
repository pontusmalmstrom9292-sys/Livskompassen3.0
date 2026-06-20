import { MonsterArkivarienCard } from '../../agents/cards';
import type { A2AMessage } from '../../agents/types';
import type { AdkOrchestrator } from '../orchestrator';
import type { WidgetRecordingIngestedPayload } from '../types';
import {
  buildInboxClassifyBlob,
  classifyInboxDocument,
  applyInkastConfidenceGate,
  type InboxClassification,
} from '../../lib/inboxClassifier';
import { routeInboxToWorm } from '../../lib/inboxPersist';
import {
  blockWidgetKunskapRouting,
  buildWidgetVaultTruth,
} from '../../lib/widgetRecordingCommit';

export interface WidgetRecordingIngestResult {
  analysis: { title: string; summary: string; category: string };
  classification: InboxClassification;
  action: 'queued' | 'persisted';
  collection?: string;
  docId?: string;
  queueId?: string;
}

/**
 * Ingest våg 3 — Widget WH1 commit via SynapseBus.
 * DCAP-first: classifyInboxDocument → routeInboxToWorm (samma kedja som 2b).
 * MUST NOT auto-routa widget till kunskap/kb_docs.
 */
export async function handleWidgetRecordingIngest(
  orchestrator: AdkOrchestrator,
  payload: WidgetRecordingIngestedPayload,
  geminiApiKey?: string,
): Promise<WidgetRecordingIngestResult> {
  const {
    ownerId,
    transcript,
    recordedAtIso,
    durationSeconds,
    evidenceUrl,
    sourceRef,
    storagePath,
    analysis,
    metadata,
    hasVaultSession,
  } = payload;

  console.log(`[Synapse:widget_recording_ingested] ownerId=${ownerId} sourceRef=${sourceRef.slice(0, 48)}`);

  const analysisText = buildWidgetVaultTruth({
    analysis,
    transcript,
    recordedAtIso,
    evidenceUrl,
    durationSeconds,
    metadata,
  });

  const classifyBlob = buildInboxClassifyBlob(analysisText, 'widget_recording');
  const rawClassification = await classifyInboxDocument(
    classifyBlob,
    'widget_recording.webm',
    geminiApiKey,
  );
  const gated = applyInkastConfidenceGate(rawClassification);
  const classification = blockWidgetKunskapRouting(gated);

  const fileId = (storagePath || sourceRef.replace(/^storage:/, 'widget_')).slice(0, 120);
  const routeResult = await routeInboxToWorm({
    ownerId,
    fileId,
    fileName: `${analysis.title.slice(0, 80)}.webm`,
    mimeType: 'audio/webm',
    classification,
    analysisText,
    evidenceUrl,
    hasVaultSession,
    isVerified: true,
    allowBarnenAutoPersist: false,
    sourceRef,
    vaultAction: `widget_inspelning: ${analysis.title.slice(0, 80)}`,
    vaultCategory: 'tyst_inspelning',
    truthOverride: analysisText,
  });

  console.log(
    `[Synapse:widget_recording_ingested] routing=${classification.routing} action=${routeResult.action}` +
      (routeResult.collection ? ` collection=${routeResult.collection}` : '') +
      (routeResult.queueId ? ` queueId=${routeResult.queueId}` : ''),
  );

  if (
    classification.routing === 'bevis' &&
    routeResult.action === 'persisted' &&
    routeResult.collection === 'reality_vault'
  ) {
    const message: A2AMessage = {
      fromAgentId: 'synapse_widget_recording_ingest',
      toAgentId: MonsterArkivarienCard.metadata.id,
      timestamp: new Date().toISOString(),
      intent: 'forensicPatternScan',
      payload: {
        sourceRef,
        fileName: `${analysis.title.slice(0, 80)}.webm`,
        analysisExcerpt: analysisText.slice(0, 2000),
        inboxRouting: classification.routing,
        vaultDocId: routeResult.docId,
      },
      contextId: ownerId,
    };

    await orchestrator.dispatch(message, {
      ragContext: [],
      applyParalysBreak: analysisText.length > 400,
      productAgentId: MonsterArkivarienCard.metadata.id,
    });
  }

  return {
    analysis,
    classification,
    action: routeResult.action,
    collection: routeResult.collection,
    docId: routeResult.docId,
    queueId: routeResult.queueId,
  };
}
