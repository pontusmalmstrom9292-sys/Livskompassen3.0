import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '../../core/firebase/init';
import type { InboxClassification, InboxRouting } from '../../kompis/api/inboxService';

export type SubmitInkastLiteResult = {
  classification: InboxClassification;
  action: 'queued' | 'persisted';
  collection?: string;
  docId?: string;
  queueId?: string;
  fileId: string;
};

const ROUTINGS: InboxRouting[] = ['kunskap', 'bevis', 'barnen', 'review'];

function normalizeRouting(raw: unknown): InboxRouting {
  if (typeof raw === 'string' && (ROUTINGS as string[]).includes(raw)) {
    return raw as InboxRouting;
  }
  return 'review';
}

function normalizeClassification(raw: unknown): InboxClassification {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    routing: normalizeRouting(o.routing),
    tags: Array.isArray(o.tags) ? o.tags.map(String).slice(0, 12) : [],
    category: typeof o.category === 'string' ? o.category.slice(0, 80) : 'okänd',
    confidence:
      typeof o.confidence === 'number' ? Math.min(1, Math.max(0, o.confidence)) : 0,
    summary:
      typeof o.summary === 'string' && o.summary.trim()
        ? o.summary.trim().slice(0, 400)
        : 'Ingen sammanfattning.',
    traumaSensitive: o.traumaSensitive === true,
    childAlias:
      typeof o.childAlias === 'string' && o.childAlias.trim()
        ? o.childAlias.trim()
        : undefined,
    rationale: typeof o.rationale === 'string' ? o.rationale.slice(0, 300) : '',
  };
}

/** Fail-safe parse — undviker vit skärm om Cloud Function returnerar ofullständigt svar. */
export function parseSubmitInkastLiteResult(raw: unknown): SubmitInkastLiteResult {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const classification = normalizeClassification(o.classification);
  const action = o.action === 'persisted' ? 'persisted' : 'queued';
  const fileId = typeof o.fileId === 'string' && o.fileId ? o.fileId : 'inkast_unknown';

  return {
    classification,
    action,
    collection: typeof o.collection === 'string' ? o.collection : undefined,
    docId: typeof o.docId === 'string' ? o.docId : undefined,
    queueId: typeof o.queueId === 'string' ? o.queueId : undefined,
    fileId,
  };
}

function extractCallableErrorMessage(error: unknown): string {
  const fnError = error as FunctionsError & { details?: unknown };
  if (typeof fnError.message === 'string' && fnError.message.trim()) {
    return fnError.message;
  }
  if (typeof fnError.details === 'string' && fnError.details.trim()) {
    return fnError.details;
  }
  return 'Inkast misslyckades.';
}

const submitInkastLiteCallable = httpsCallable<
  {
    text?: string;
    fileName?: string;
    mimeType?: string;
    base64?: string;
    optInTrauma?: boolean;
  },
  SubmitInkastLiteResult
>(functions, 'submitInkastLite');

export async function submitInkastLite(input: {
  text?: string;
  fileName?: string;
  mimeType?: string;
  base64?: string;
  optInTrauma?: boolean;
}): Promise<SubmitInkastLiteResult> {
  try {
    const result = await submitInkastLiteCallable(input);
    return parseSubmitInkastLiteResult(result.data);
  } catch (error) {
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Logga in för att använda Inkast.');
    }
    throw new Error(extractCallableErrorMessage(error));
  }
}

export const ROUTING_LABELS: Record<InboxRouting, string> = {
  kunskap: 'Kunskap',
  bevis: 'Bevis (Valv)',
  barnen: 'Barnen',
  review: 'Granska manuellt',
};

export const COLLECTION_LABELS: Record<string, string> = {
  reality_vault: 'Verklighetsvalvet',
  kb_docs: 'Kunskapsbank',
  children_logs: 'Barnens livslogg',
};

export function formatInkastResultMessage(result: SubmitInkastLiteResult): string {
  const { classification, action, collection } = result;
  const routingLabel = ROUTING_LABELS[classification.routing] ?? 'Granska';

  if (action === 'queued') {
    return `Väntar granskning (${routingLabel}). Öppna Valv → Kunskapsbank → Inkorg när du vill bekräfta.`;
  }

  const dest =
    collection && COLLECTION_LABELS[collection]
      ? COLLECTION_LABELS[collection]
      : routingLabel;

  return `Sparat i ${dest}. ${classification.summary}`;
}

export const VALV_KUNSKAP_INBOX_LINK = {
  pathname: '/dagbok',
  search: '?tab=bevis&vaultTab=kunskapsbank',
} as const;

export const VALV_ARKIV_LINK = {
  pathname: '/dagbok',
  search: '?tab=bevis&vaultTab=logga',
} as const;
