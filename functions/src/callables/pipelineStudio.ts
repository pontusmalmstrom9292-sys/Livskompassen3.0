import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { appendPipelineRun, type PipelineRunStatus } from '../lib/pipelineRunStore';

const ALLOWED_TOOL_IDS = new Set([
  'flow_brusfilter',
  'flow_biff_rewrite',
  'flow_dossier_foreword',
  'flow_pattern_assist',
  'flow_inkast_classify',
  'flow_valv_chat',
]);

const ALLOWED_STATUS: PipelineRunStatus[] = [
  'spawned',
  'PASS',
  'FAIL',
  'validated',
  'exported',
];

/**
 * Append-only pipeline run checkpoint (metadata only).
 * Used by Pipeline Studio CLI after smoke / export.
 */
export const recordPipelineRun = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 15,
  },
  async (request): Promise<{ runId: string }> => {
    await guardSensitiveCallableV2(request, 'recordPipelineRun', 30);

    const data = request.data as {
      toolId?: unknown;
      status?: unknown;
      schemaVersion?: unknown;
      smokeTier?: unknown;
      commitSha?: unknown;
      errorCode?: unknown;
    };

    const toolId = typeof data.toolId === 'string' ? data.toolId.trim() : '';
    if (!ALLOWED_TOOL_IDS.has(toolId)) {
      throw new HttpsError('invalid-argument', 'Ogiltigt toolId.');
    }

    const status = data.status as PipelineRunStatus;
    if (!ALLOWED_STATUS.includes(status)) {
      throw new HttpsError('invalid-argument', 'Ogiltig status.');
    }

    const schemaVersion =
      typeof data.schemaVersion === 'string' && data.schemaVersion.trim()
        ? data.schemaVersion.trim().slice(0, 32)
        : '1.0.0';

    const smokeTier =
      typeof data.smokeTier === 'number' && Number.isFinite(data.smokeTier)
        ? Math.min(3, Math.max(0, Math.floor(data.smokeTier)))
        : undefined;

    const commitSha =
      typeof data.commitSha === 'string' ? data.commitSha.slice(0, 40) : undefined;
    const errorCode =
      typeof data.errorCode === 'string' ? data.errorCode.slice(0, 80) : undefined;

    const runId = await appendPipelineRun(request.auth!.uid, {
      toolId,
      status,
      schemaVersion,
      smokeTier,
      commitSha,
      errorCode,
    });

    return { runId };
  },
);
