import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { admin } from '../lib/firebaseAdmin';
import { randomUUID } from 'crypto';
import { GCP_STORAGE_BUCKET, GCP_STORAGE_TRIGGER_REGION } from '../config';
import {
  applyInkastConfidenceGate,
  heuristicInboxClassify,
} from '../lib/inboxClassifier';
import { routeInboxToWorm } from '../lib/inboxPersist';
import { transcribeInkastAudio } from '../lib/transcribeInkastAudio';
import { isInkastAudioMime } from '../lib/inkastConstants';
import { analyzeAndClassifyUpload } from '../lib/analyzeAndClassifyUpload';

const INKAST_PATH_RE = /^vault_evidence\/([^/]+)\/inkast\//;

/**
 * Storage onFinalize — direktuppladdning till vault_evidence/…/inkast/
 * Hoppar över filer redan routed via submitInkastLite (metadata source=inkast_lite).
 */
export const onInkastEvidenceFinalized = onObjectFinalized(
  {
    bucket: GCP_STORAGE_BUCKET,
    region: GCP_STORAGE_TRIGGER_REGION,
    cpu: 'gcf_gen1',
    memory: '256MiB',
  },
  async (event) => {
    const object = event.data;
    const name = object.name;
    if (!name || !INKAST_PATH_RE.test(name)) return;

    const customMeta = object.metadata ?? {};
    if (customMeta.source === 'inkast_lite' || customMeta.inkastRouted === 'true') {
      return;
    }

    const match = name.match(INKAST_PATH_RE);
    const ownerId = match?.[1];
    if (!ownerId) return;

    const mimeType = object.contentType ?? 'application/octet-stream';
    const fileName = name.split('/').pop() ?? 'inkast.bin';
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(name);

    let buffer: Buffer;
    try {
      const [data] = await file.download();
      buffer = data;
    } catch (err) {
      console.error('[onInkastEvidenceFinalized] download failed', name, err);
      return;
    }

    // --- Start Refactored Logic ---

    // For audio files, we still need to transcribe first.
    if (isInkastAudioMime(mimeType)) {
        try {
            const analysisText = await transcribeInkastAudio(buffer, mimeType, fileName);
            if (analysisText.trim().length < 12) return;

            // After transcription, run the heuristic check.
            let classification = heuristicInboxClassify(analysisText, fileName);
            if (!classification) {
                // If heuristics don't match, we would need a classification-only call.
                // For now, we are skipping the expensive classification and sending to review.
                // This path is less common than document uploads.
                console.warn(`[onInkastEvidenceFinalized] Audio file '${name}' did not match heuristics, sending to review.`);
                classification = {
                    routing: 'review',
                    tags: ['audio', 'transcribed'],
                    category: 'review',
                    confidence: 0.5,
                    summary: 'Transkriberad ljudfil kräver manuell granskning.',
                    traumaSensitive: false,
                    rationale: 'Audio file did not match any heuristic classifiers.',
                };
            }
            
            // Proceed with the routing logic from here...
            await continueWithRouting(ownerId, name, fileName, mimeType, customMeta, file, applyInkastConfidenceGate(classification), analysisText);
            return;

        } catch (err) {
            console.error('[onInkastEvidenceFinalized] Audio transcription failed', name, err);
            return;
        }
    }

    // For all other files, use the new combined analysis function.
    try {
      const analysisResult = await analyzeAndClassifyUpload(buffer, mimeType, fileName);
      if (!analysisResult) {
        console.error('[onInkastEvidenceFinalized] Combined analysis failed, aborting.', name);
        return;
      }

      let { classification, knowledge } = analysisResult;
      const analysisText = `## ${knowledge.title}\n\n${knowledge.summary}\n\n### Fakta\n${knowledge.facts.join('\n- ')}\n\n### Datum och parter\n${knowledge.datesAndParties}`;
      
      if (analysisText.trim().length < 12) return;

      classification = applyInkastConfidenceGate(classification);
      await continueWithRouting(ownerId, name, fileName, mimeType, customMeta, file, classification, analysisText);

    } catch (err) {
      console.error('[onInkastEvidenceFinalized] Combined analysis and classification failed', name, err);
      return;
    }
    
    // --- End Refactored Logic ---
  },
);


async function continueWithRouting(ownerId: string, name: string, fileName: string, mimeType: string, customMeta: any, file: any, classification: any, analysisText: string) {
    const encoded = encodeURIComponent(name);
    const token = customMeta.firebaseStorageDownloadTokens;
    const evidenceUrl = token
      ? `https://firebasestorage.googleapis.com/v0/b/${file.bucket.name}/o/${encoded}?alt=media&token=${token}`
      : undefined;

    const fileId = `storage_inkast_${randomUUID()}`;
    const routeResult = await routeInboxToWorm({
      ownerId,
      fileId,
      fileName,
      mimeType,
      classification,
      analysisText,
      evidenceUrl,
      hasVaultSession: false,
      isVerified: true,
    });

    try {
      await file.setMetadata({
        metadata: {
          ...customMeta,
          inkastRouted: 'true',
          inkastRouting: classification.routing,
          inkastRouteAction: routeResult.action,
        },
      });
    } catch (err) {
      console.warn('[onInkastEvidenceFinalized] metadata update failed', err);
    }

    console.log(
      `[onInkastEvidenceFinalized] ${name} routing=${classification.routing} action=${routeResult.action}`,
    );
}

