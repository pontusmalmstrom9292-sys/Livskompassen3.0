import { analyzeDriveFile } from '../../agents/documentAgent';
import { MonsterArkivarienCard } from '../../agents/cards';
import type { A2AMessage } from '../../agents/types';
import type { AdkOrchestrator } from '../orchestrator';
import type { DriveIngestPayload } from '../types';
import { classifyInboxDocument, applyInkastConfidenceGate } from '../../lib/inboxClassifier';
import { routeInboxToWorm } from '../../lib/inboxPersist';

/**
 * G10 — Självsorterande inkorg: Drive → klassificering → rätt silo.
 * MUST NOT spara bevis till kb_docs (bevis → reality_vault).
 * Trauma/LVU utan optIn → inbox_queue (HITL).
 */
export async function handleDriveIngest(
  orchestrator: AdkOrchestrator,
  payload: DriveIngestPayload
): Promise<{ analysisStarted: boolean; fileId: string; routing?: string }> {
  const { fileId, fileName, mimeType, ownerId, optInTrauma } = payload;
  console.log(`[Synapse:drive_ingest] fileId=${fileId} name=${fileName}`);

  const analysisText = await analyzeDriveFile(fileId, fileName, mimeType);
  let routing: string | undefined;

  if (ownerId) {
    const rawClassification = await classifyInboxDocument(analysisText, fileName);
    const classification = applyInkastConfidenceGate(rawClassification);
    const routeResult = await routeInboxToWorm({
      ownerId,
      fileId,
      fileName,
      mimeType,
      classification,
      analysisText,
      optInTrauma,
      hasVaultSession: false,
      isVerified: true, // System background task
    });

    routing = classification.routing;
    console.log(
      `[Synapse:drive_ingest] G10 routing=${classification.routing} action=${routeResult.action}` +
        (routeResult.collection ? ` collection=${routeResult.collection}` : '') +
        (routeResult.queueId ? ` queueId=${routeResult.queueId}` : '')
    );
  } else {
    console.warn('[Synapse:drive_ingest] ownerId saknas — hoppar över persist (G10)');
  }

  const message: A2AMessage = {
    fromAgentId: 'synapse_drive_ingest',
    toAgentId: MonsterArkivarienCard.metadata.id,
    timestamp: new Date().toISOString(),
    intent: 'forensicPatternScan',
    payload: {
      fileId,
      fileName,
      mimeType,
      analysisExcerpt: analysisText.slice(0, 2000),
      inboxRouting: routing,
    },
    contextId: ownerId,
  };

  await orchestrator.dispatch(message, {
    ragContext: [],
    applyParalysBreak: isHeavyResponse(analysisText),
    productAgentId: MonsterArkivarienCard.metadata.id,
  });

  return { analysisStarted: true, fileId, routing };
}

function isHeavyResponse(text: string): boolean {
  return text.length > 400 || (text.match(/\n/g)?.length ?? 0) > 5;
}
