import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { analyzeWidgetRecording } from '../../lib/widgetRecordingAnalyze';
import { type WidgetRecordingMetadata } from '../../lib/widgetRecordingCommit';
import { readVaultSessionToken, assertVaultSession } from '../../lib/vaultSessionGate';
import { adkOrchestrator } from '../../adk';
import { emitSynapse } from '../../adk/synapses/synapseBus';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';

export const ingestWidgetRecording = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'ingestWidgetRecording', 20);

    const commit = request.data?.commit === true;

    if (!commit) {
      const transcript = typeof request.data.transcript === 'string' ? request.data.transcript : '';
      const recordedAt =
        typeof request.data.recordedAt === 'string' ? request.data.recordedAt : new Date().toISOString();
      const durationSeconds =
        typeof request.data.durationSeconds === 'number' ? request.data.durationSeconds : undefined;

      if (transcript.length > 12000) {
        throw new HttpsError('invalid-argument', 'Transkript max 12000 tecken.');
      }

      const analysis = await analyzeWidgetRecording(
        transcript,
        recordedAt,
        durationSeconds,
        process.env.GEMINI_API_KEY,
      );
      return analysis;
    }

    const transcript = typeof request.data.transcript === 'string' ? request.data.transcript : '';
    const recordedAt =
      typeof request.data.recordedAt === 'string' ? request.data.recordedAt : new Date().toISOString();
    const durationSeconds =
      typeof request.data.durationSeconds === 'number' ? request.data.durationSeconds : undefined;
    const evidenceUrl =
      typeof request.data.evidenceUrl === 'string' ? request.data.evidenceUrl.trim() : '';
    const sourceRef = typeof request.data.sourceRef === 'string' ? request.data.sourceRef.trim() : '';
    const storagePath =
      typeof request.data.storagePath === 'string' ? request.data.storagePath.trim() : '';

    if (!evidenceUrl || !sourceRef) {
      throw new HttpsError('invalid-argument', 'evidenceUrl och sourceRef krävs vid commit.');
    }
    if (transcript.length > 12000) {
      throw new HttpsError('invalid-argument', 'Transkript max 12000 tecken.');
    }

    const rawAnalysis = request.data.analysis as Record<string, unknown> | undefined;
    const title = typeof rawAnalysis?.title === 'string' ? rawAnalysis.title.trim() : '';
    const summary = typeof rawAnalysis?.summary === 'string' ? rawAnalysis.summary.trim() : '';
    if (!title || !summary) {
      throw new HttpsError('invalid-argument', 'analysis.title och analysis.summary krävs vid commit.');
    }
    const analysis = {
      title: title.slice(0, 120),
      summary: summary.slice(0, 4000),
      category: 'tyst_inspelning',
    };

    const rawMeta = request.data.metadata as Record<string, unknown> | undefined;
    const metadata: WidgetRecordingMetadata = {
      vem: typeof rawMeta?.vem === 'string' ? rawMeta.vem : '',
      vad: typeof rawMeta?.vad === 'string' ? rawMeta.vad : '',
      varfor: typeof rawMeta?.varfor === 'string' ? rawMeta.varfor : '',
    };

    let hasVaultSession = false;
    if (readVaultSessionToken(request.data)) {
      await assertVaultSession(uid, request.data);
      hasVaultSession = true;
    }

    const synapseResult = (await emitSynapse(adkOrchestrator, {
      trigger: 'widget_recording_ingested',
      contextId: uid,
      payload: {
        ownerId: uid,
        transcript,
        recordedAtIso: recordedAt,
        durationSeconds,
        evidenceUrl,
        sourceRef,
        storagePath: storagePath || undefined,
        analysis,
        metadata,
        hasVaultSession,
      },
    })) as {
      analysis: typeof analysis;
      classification: { routing: string };
      action: 'queued' | 'persisted';
      collection?: string;
      docId?: string;
      queueId?: string;
    };

    return {
      ...synapseResult.analysis,
      classification: synapseResult.classification,
      action: synapseResult.action,
      collection: synapseResult.collection,
      docId: synapseResult.docId,
      queueId: synapseResult.queueId,
    };
  }
);
