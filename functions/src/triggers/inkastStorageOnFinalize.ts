import { onObjectFinalized } from 'firebase-functions/v2/storage';
import * as admin from 'firebase-admin';
import { randomUUID } from 'crypto';
import { GCP_REGION } from '../config';
import {
  classifyInboxDocument,
  applyInkastConfidenceGate,
} from '../lib/inboxClassifier';
import { routeInboxToWorm } from '../lib/inboxPersist';
import { transcribeInkastAudio } from '../lib/transcribeInkastAudio';
import { analyzeUploadForKnowledge } from '../lib/analyzeUploadForKnowledge';
import { isInkastAudioMime } from '../lib/inkastConstants';

const INKAST_PATH_RE = /^vault_evidence\/([^/]+)\/inkast\//;

/**
 * Storage onFinalize — direktuppladdning till vault_evidence/…/inkast/
 * Hoppar över filer redan routed via submitInkastLite (metadata source=inkast_lite).
 */
export const onInkastEvidenceFinalized = onObjectFinalized(
  {
    region: GCP_REGION,
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

    let analysisText: string;
    try {
      if (isInkastAudioMime(mimeType)) {
        analysisText = await transcribeInkastAudio(buffer, mimeType, fileName);
      } else {
        const extracted = await analyzeUploadForKnowledge(buffer, mimeType, fileName);
        analysisText = extracted.content;
      }
    } catch (err) {
      console.error('[onInkastEvidenceFinalized] extract failed', name, err);
      return;
    }

    if (analysisText.trim().length < 12) return;

    const encoded = encodeURIComponent(name);
    const token = customMeta.firebaseStorageDownloadTokens;
    const evidenceUrl = token
      ? `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encoded}?alt=media&token=${token}`
      : undefined;

    let classification = await classifyInboxDocument(analysisText, fileName);
    classification = applyInkastConfidenceGate(classification);

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
  },
);
