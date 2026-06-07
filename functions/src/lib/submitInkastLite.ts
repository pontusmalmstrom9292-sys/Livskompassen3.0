import { randomUUID } from 'crypto';
import {
  classifyInboxDocument,
  buildManualInkastClassification,
  buildInboxClassifyBlob,
  type InboxClassification,
  type InboxRouting,
} from './inboxClassifier';
import { routeInboxToWorm } from './inboxPersist';
import { analyzeUploadForKnowledge } from './analyzeUploadForKnowledge';
import { uploadInkastEvidence } from './uploadInkastEvidence';
import { normalizeInkastSourceModule, stripInjectedSourceModuleFromText } from './inkastSourceModule';

/** Roadmap 2026-06-05 — utökade dokumentformat för Smart Inkast. */
export const LITE_UPLOAD_MIMES = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
]);

const MAX_FILES_PER_BATCH = 8;
const MAX_TEXT_LEN = 12_000;

export type SubmitInkastLiteInput = {
  text?: string;
  /** Legacy enkel fil */
  fileName?: string;
  mimeType?: string;
  base64?: string;
  /** Multi-fil batch */
  base64Files?: string[];
  mimeTypes?: string[];
  fileNames?: string[];
  optInTrauma?: boolean;
  sourceModule?: string;
  /** Manuellt användarval — prioriteras före AI-klassificering. */
  manualRouting?: Exclude<InboxRouting, 'review'>;
  manualCategory?: string;
  manualTags?: string[];
  manualComment?: string;
  manualChildAlias?: string;
};

export type SubmitInkastLiteItemResult = {
  classification: InboxClassification;
  action: 'queued' | 'persisted';
  collection?: string;
  docId?: string;
  queueId?: string;
  fileId: string;
  fileName: string;
  evidenceUrl?: string;
};

export type SubmitInkastLiteResult = {
  items: SubmitInkastLiteItemResult[];
  processed: number;
  persisted: number;
  queued: number;
  failed: number;
  errors: Array<{ fileName: string; error: string }>;
};

type ManualInkastOverride = {
  routing: Exclude<InboxRouting, 'review'>;
  category?: string;
  tags?: string[];
  comment?: string;
  childAlias?: string;
};

function normalizeManualTags(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const tags = raw
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .map((v) => v.trim().slice(0, 48))
    .slice(0, 11);
  return tags.length ? tags : undefined;
}

function resolveManualOverride(input: SubmitInkastLiteInput): ManualInkastOverride | undefined {
  const routing = input.manualRouting;
  if (routing !== 'kunskap' && routing !== 'bevis' && routing !== 'barnen') {
    return undefined;
  }
  const tags = normalizeManualTags(input.manualTags);
  const category =
    typeof input.manualCategory === 'string' ? input.manualCategory.trim().slice(0, 80) : undefined;
  return {
    routing,
    category: category || tags?.[0],
    tags,
    comment:
      typeof input.manualComment === 'string' ? input.manualComment.trim().slice(0, 400) : undefined,
    childAlias:
      typeof input.manualChildAlias === 'string'
        ? input.manualChildAlias.trim().slice(0, 40)
        : undefined,
  };
}

type InkastFileJob = {
  fileName: string;
  mimeType: string;
  base64: string;
};

function resolveClassification(
  classifyBlob: string,
  fileName: string,
  analysisText: string,
  manual: ManualInkastOverride | undefined,
  geminiApiKey?: string
): Promise<InboxClassification> | InboxClassification {
  if (manual) {
    return buildManualInkastClassification({
      routing: manual.routing,
      category: manual.category,
      tags: manual.tags,
      comment: manual.comment,
      analysisExcerpt: analysisText.slice(0, 400),
      childAlias: manual.childAlias,
    });
  }
  return classifyInboxDocument(classifyBlob, fileName, geminiApiKey);
}

async function finalizeClassification(
  classification: InboxClassification | Promise<InboxClassification>,
  manual: ManualInkastOverride | undefined
): Promise<InboxClassification> {
  let resolved = await classification;
  if (manual) return resolved;
  if (resolved.routing !== 'review' && resolved.confidence < 0.75) {
    resolved = {
      ...resolved,
      routing: 'review',
      rationale: `${resolved.rationale} Inkast Lite: confidence < 0.75 → granskning.`,
    };
  }
  return resolved;
}

function isPlainTextMime(mimeType: string, fileName: string): boolean {
  return (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    /\.(txt|md|csv|json)$/i.test(fileName)
  );
}

function normalizeMimeType(raw: unknown, fileName: string): string {
  if (typeof raw === 'string' && raw.trim()) {
    const m = raw.trim();
    if (m === 'image/jpg') return 'image/jpeg';
    return m;
  }
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (lower.endsWith('.xlsx')) {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  if (lower.endsWith('.pptx')) {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }
  if (lower.endsWith('.doc')) return 'application/msword';
  if (lower.endsWith('.xls')) return 'application/vnd.ms-excel';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.md')) return 'text/markdown';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.json')) return 'application/json';
  return 'text/plain';
}

function resolveFileJobs(input: SubmitInkastLiteInput): InkastFileJob[] {
  const batchBase64 = Array.isArray(input.base64Files) ? input.base64Files : [];
  const batchMime = Array.isArray(input.mimeTypes) ? input.mimeTypes : [];
  const batchNames = Array.isArray(input.fileNames) ? input.fileNames : [];

  if (batchBase64.length > 0) {
    if (batchBase64.length > MAX_FILES_PER_BATCH) {
      throw new Error(`Max ${MAX_FILES_PER_BATCH} filer per inkast.`);
    }
    return batchBase64.map((raw, i) => {
      const base64 = typeof raw === 'string' ? raw.trim() : '';
      if (!base64) throw new Error(`Fil ${i + 1}: base64 saknas.`);
      const fileName =
        typeof batchNames[i] === 'string' && batchNames[i]!.trim()
          ? batchNames[i]!.trim().slice(0, 200)
          : `inkast_${i + 1}.bin`;
      const mimeType = normalizeMimeType(batchMime[i], fileName);
      return { fileName, mimeType, base64 };
    });
  }

  if (typeof input.base64 === 'string' && input.base64.trim()) {
    const fileName =
      typeof input.fileName === 'string' && input.fileName.trim()
        ? input.fileName.trim().slice(0, 200)
        : 'inkast.bin';
    return [
      {
        fileName,
        mimeType: normalizeMimeType(input.mimeType, fileName),
        base64: input.base64.trim(),
      },
    ];
  }

  return [];
}

async function extractAnalysisFromBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  if (!LITE_UPLOAD_MIMES.has(mimeType)) {
    throw new Error(`mimeType stöds inte för Inkast Lite: ${mimeType}`);
  }

  if (isPlainTextMime(mimeType, fileName)) {
    return buffer.toString('utf8').trim();
  }

  const extracted = await analyzeUploadForKnowledge(buffer, mimeType, fileName);
  return extracted.content.trim();
}

async function processOneInkastFile(
  ownerId: string,
  job: InkastFileJob,
  sourceModule: string | undefined,
  optInTrauma: boolean,
  manual: ManualInkastOverride | undefined,
  geminiApiKey?: string
): Promise<SubmitInkastLiteItemResult> {
  let buffer: Buffer;
  try {
    buffer = Buffer.from(job.base64, 'base64');
  } catch {
    throw new Error('Ogiltig base64.');
  }

  const analysisTextRaw = await extractAnalysisFromBuffer(buffer, job.mimeType, job.fileName);
  if (analysisTextRaw.length < 12) {
    throw new Error('Innehållet är för kort efter extraktion.');
  }
  const analysisText = stripInjectedSourceModuleFromText(analysisTextRaw.slice(0, MAX_TEXT_LEN));

  let evidenceUrl: string | undefined;
  if (!isPlainTextMime(job.mimeType, job.fileName)) {
    evidenceUrl = await uploadInkastEvidence({
      ownerId,
      fileName: job.fileName,
      mimeType: job.mimeType,
      buffer,
    });
  }

  const classifyBlob = buildInboxClassifyBlob(analysisText, sourceModule);

  const classification = await finalizeClassification(
    resolveClassification(classifyBlob, job.fileName, analysisText, manual, geminiApiKey),
    manual
  );

  const effectiveOptIn = manual ? true : optInTrauma;
  const fileId = `inkast_lite_${randomUUID()}`;
  const routeResult = await routeInboxToWorm({
    ownerId,
    fileId,
    fileName: job.fileName,
    mimeType: job.mimeType,
    classification,
    analysisText,
    optInTrauma: effectiveOptIn,
    evidenceUrl,
  });

  return {
    classification,
    fileId,
    fileName: job.fileName,
    evidenceUrl,
    ...routeResult,
  };
}

async function processTextInkast(
  ownerId: string,
  text: string,
  fileName: string,
  sourceModule: string | undefined,
  optInTrauma: boolean,
  manual: ManualInkastOverride | undefined,
  geminiApiKey?: string
): Promise<SubmitInkastLiteItemResult> {
  const analysisText = stripInjectedSourceModuleFromText(text.trim());
  if (analysisText.length < 12) {
    throw new Error('Innehållet är för kort (minst 12 tecken).');
  }
  if (analysisText.length > MAX_TEXT_LEN) {
    throw new Error('text max 12000 tecken.');
  }

  const classifyBlob = buildInboxClassifyBlob(analysisText, sourceModule);

  const classification = await finalizeClassification(
    resolveClassification(classifyBlob, fileName, analysisText, manual, geminiApiKey),
    manual
  );

  const effectiveOptIn = manual ? true : optInTrauma;
  const fileId = `inkast_lite_${randomUUID()}`;
  const routeResult = await routeInboxToWorm({
    ownerId,
    fileId,
    fileName,
    mimeType: 'text/plain',
    classification,
    analysisText,
    optInTrauma: effectiveOptIn,
  });

  return {
    classification,
    fileId,
    fileName,
    ...routeResult,
  };
}

/** Inkast Lite — klassificering + G10-routing (samma silos som Drive-ingest). */
export async function submitInkastLiteForUser(
  ownerId: string,
  input: SubmitInkastLiteInput,
  geminiApiKey?: string
): Promise<SubmitInkastLiteResult> {
  const sourceModule = normalizeInkastSourceModule(input.sourceModule);
  const optInTrauma = input.optInTrauma === true;
  const manual = resolveManualOverride(input);

  const items: SubmitInkastLiteItemResult[] = [];
  const errors: Array<{ fileName: string; error: string }> = [];

  const fileJobs = resolveFileJobs(input);
  const hasText = typeof input.text === 'string' && input.text.trim().length > 0;

  if (fileJobs.length === 0 && !hasText) {
    throw new Error('text eller base64/base64Files krävs.');
  }
  if (fileJobs.length > 0 && hasText) {
    throw new Error('Skicka antingen text eller filer — inte båda samtidigt.');
  }

  if (hasText) {
    const fileName =
      typeof input.fileName === 'string' && input.fileName.trim()
        ? input.fileName.trim().slice(0, 200)
        : 'inkast.txt';
    try {
      const item = await processTextInkast(
        ownerId,
        input.text!,
        fileName,
        sourceModule,
        optInTrauma,
        manual,
        geminiApiKey
      );
      items.push(item);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Inkast misslyckades.';
      errors.push({ fileName, error: message });
      throw new Error(message);
    }
  } else {
    for (const job of fileJobs) {
      try {
        const item = await processOneInkastFile(
          ownerId,
          job,
          sourceModule,
          optInTrauma,
          manual,
          geminiApiKey
        );
        items.push(item);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Filbearbetning misslyckades.';
        errors.push({ fileName: job.fileName, error: message });
      }
    }

    if (items.length === 0 && errors.length > 0) {
      throw new Error(errors.map((e) => `${e.fileName}: ${e.error}`).join(' '));
    }
  }

  let persisted = 0;
  let queued = 0;
  for (const item of items) {
    if (item.action === 'persisted') persisted += 1;
    else queued += 1;
  }

  return {
    items,
    processed: items.length,
    persisted,
    queued,
    failed: errors.length,
    errors,
  };
}
