import { analyzeDriveFile } from '../../agents/documentAgent';
import { MonsterArkivarienCard } from '../../agents/cards';
import type { A2AMessage } from '../../agents/types';
import type { AdkOrchestrator } from '../orchestrator';
import type { DriveIngestPayload } from '../types';
import { classifyInboxDocument, applyInkastConfidenceGate } from '../../lib/inboxClassifier';
import { routeInboxToWorm } from '../../lib/inboxPersist';

/**
 * G10 — Självsorterande inkorg: Drive → klassificering → rätt silo.
 *
 * Klassificeringsordning (DCAP-first, U2):
 *   1. heuristicInboxClassify — deterministic keyword/sourceModule rules (no LLM).
 *   2. Gemini LLM — only when heuristic returns null.
 *   3. applyInkastConfidenceGate — downgrades low-confidence results to 'review'.
 *   4. routeInboxToWorm — WORM persist or inbox_queue (HITL).
 *
 * Silo constraints (MUST NOT violate):
 *   - bevis → reality_vault only, NEVER kb_docs.
 *   - barnen → inbox_queue (no auto-persist without explicit allowBarnenAutoPersist).
 *   - trauma/LVU or confidence < threshold → inbox_queue.
 * Routing (via routeInboxToWorm):
 *   - kunskap → kb_docs via persistKunskapFromInbox (ingest våg 1).
 *   - dagbok → journal; planning → planning_tasks.
 *   - kampspar: journal_woven opt-in / ingestKampsparEntry only — not Drive G10 default.
 */
export async function handleDriveIngest(
  orchestrator: AdkOrchestrator,
  payload: DriveIngestPayload
): Promise<{ analysisStarted: boolean; fileId: string; routing?: string; dryRun?: boolean }> {
  const { fileId, fileName, mimeType, ownerId, optInTrauma, dryRun } = payload;
  console.log(`[Synapse:drive_ingest] fileId=${fileId} name=${fileName}${dryRun ? ' (DRY-RUN)' : ''}`);

  const analysisText = await analyzeDriveFile(fileId, fileName, mimeType);
  let routing: string | undefined;

  if (ownerId) {
    // classifyInboxDocument runs heuristicInboxClassify first (DCAP-before-LLM, U2).
    const rawClassification = await classifyInboxDocument(analysisText, fileName);
    const classification = applyInkastConfidenceGate(rawClassification);
    routing = classification.routing;

    if (dryRun) {
      console.log(
        `[Synapse:drive_ingest] DRY-RUN routing=${classification.routing} — ingen persist/dispatch`
      );
      return { analysisStarted: true, fileId, routing, dryRun: true };
    }

    const routeResult = await routeInboxToWorm({
      ownerId,
      fileId,
      fileName,
      mimeType,
      classification,
      analysisText,
      optInTrauma,
      hasVaultSession: false,  // background task — no active Vault session
      isVerified: true,
      allowBarnenAutoPersist: false, // Drive ingest always queues barnen for HITL
    });

    console.log(
      `[Synapse:drive_ingest] G10 routing=${classification.routing} action=${routeResult.action}` +
        (routeResult.collection ? ` collection=${routeResult.collection}` : '') +
        (routeResult.queueId ? ` queueId=${routeResult.queueId}` : '')
    );
  } else {
    console.warn('[Synapse:drive_ingest] ownerId saknas — hoppar över persist (G10)');
    if (dryRun) {
      return { analysisStarted: true, fileId, dryRun: true };
    }
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
