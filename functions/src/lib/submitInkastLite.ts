import { randomUUID } from 'crypto';
import { classifyInboxDocument, type InboxClassification } from './inboxClassifier';
import { routeInboxToWorm } from './inboxPersist';
import { analyzeUploadForKnowledge } from './analyzeUploadForKnowledge';

const LITE_UPLOAD_MIMES = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export type SubmitInkastLiteInput = {
  text?: string;
  fileName?: string;
  mimeType?: string;
  base64?: string;
  optInTrauma?: boolean;
  sourceModule?: string;
};

export type SubmitInkastLiteResult = {
  classification: InboxClassification;
  action: 'queued' | 'persisted';
  collection?: string;
  docId?: string;
  queueId?: string;
  fileId: string;
};

/** Inkast Lite — klassificering + G10-routing (samma silos som Drive-ingest). */
export async function submitInkastLiteForUser(
  ownerId: string,
  input: SubmitInkastLiteInput,
  geminiApiKey?: string
): Promise<SubmitInkastLiteResult> {
  const fileName =
    typeof input.fileName === 'string' && input.fileName.trim()
      ? input.fileName.trim().slice(0, 200)
      : 'inkast.txt';

  let analysisText: string;
  const mimeType =
    typeof input.mimeType === 'string' && input.mimeType.trim()
      ? input.mimeType.trim()
      : 'text/plain';

  if (typeof input.text === 'string' && input.text.trim()) {
    analysisText = input.text.trim();
    if (analysisText.length > 12_000) {
      throw new Error('text max 12000 tecken.');
    }
  } else if (typeof input.base64 === 'string' && input.base64.trim()) {
    if (!LITE_UPLOAD_MIMES.has(mimeType)) {
      throw new Error('mimeType stöds inte för Inkast Lite.');
    }
    let buffer: Buffer;
    try {
      buffer = Buffer.from(input.base64.trim(), 'base64');
    } catch {
      throw new Error('Ogiltig base64.');
    }

    const isPlainText =
      mimeType.startsWith('text/') ||
      mimeType === 'application/json' ||
      /\.(txt|md|csv|json)$/i.test(fileName);

    if (isPlainText) {
      analysisText = buffer.toString('utf8').trim();
    } else {
      const extracted = await analyzeUploadForKnowledge(buffer, mimeType, fileName);
      analysisText = extracted.content.trim();
    }

    if (analysisText.length < 12) {
      throw new Error('Innehållet är för kort efter extraktion.');
    }
    analysisText = analysisText.slice(0, 12_000);
  } else {
    throw new Error('text eller base64 krävs.');
  }

  const sourceModule =
    typeof input.sourceModule === 'string' && input.sourceModule.trim()
      ? input.sourceModule.trim().slice(0, 80)
      : undefined;
  const classifyBlob = sourceModule
    ? `[sourceModule:${sourceModule}]\n${analysisText}`
    : analysisText;

  let classification = await classifyInboxDocument(classifyBlob, fileName, geminiApiKey);

  if (classification.routing !== 'review' && classification.confidence < 0.75) {
    classification = {
      ...classification,
      routing: 'review',
      rationale: `${classification.rationale} Inkast Lite: confidence < 0.75 → granskning.`,
    };
  }

  const fileId = `inkast_lite_${randomUUID()}`;
  const routeResult = await routeInboxToWorm({
    ownerId,
    fileId,
    fileName,
    mimeType,
    classification,
    analysisText,
    optInTrauma: input.optInTrauma === true,
  });

  return {
    classification,
    fileId,
    ...routeResult,
  };
}
