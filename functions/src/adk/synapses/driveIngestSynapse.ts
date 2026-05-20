import { analyzeDriveFile } from '../../agents/documentAgent';
import { MonsterArkivarienCard } from '../../agents/cards';
import type { A2AMessage } from '../../agents/types';
import type { AdkOrchestrator } from '../orchestrator';
import type { DriveIngestPayload } from '../types';

/**
 * Sub-synaps: Google Drive-ingest → Mönster-Arkivarien via A2A.
 * Triggas av notifyNewFile (webhook) eller framtida Pub/Sub.
 */
export async function handleDriveIngest(
  orchestrator: AdkOrchestrator,
  payload: DriveIngestPayload
): Promise<{ analysisStarted: boolean; fileId: string }> {
  const { fileId, fileName, mimeType, ownerId } = payload;
  console.log(`[Synapse:drive_ingest] fileId=${fileId} name=${fileName}`);

  const analysisText = await analyzeDriveFile(fileId, fileName, mimeType);

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
    },
    contextId: ownerId,
  };

  await orchestrator.dispatch(message, {
    ragContext: [],
    applyParalysBreak: isHeavyResponse(analysisText),
    productAgentId: MonsterArkivarienCard.metadata.id,
  });

  return { analysisStarted: true, fileId };
}

function isHeavyResponse(text: string): boolean {
  return text.length > 400 || (text.match(/\n/g)?.length ?? 0) > 5;
}
