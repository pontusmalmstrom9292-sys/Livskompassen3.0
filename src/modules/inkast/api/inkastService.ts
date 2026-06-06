import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '../../core/firebase/init';
import type { InboxClassification, InboxRouting } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import type { UserTagRow } from '@/core/types/firestore';
import { NAV_PATHS } from '@/core/navigation/navTruth';

/** Universell tagg-matris — fyra grupper (CEO-taxonomi). */
export type InkastTagGroupId = 'narcissism' | 'barn' | 'personligt' | 'egen';

export type InkastTagDef = {
  id: string;
  label: string;
  description: string;
};

export type InkastTagGroup = {
  id: InkastTagGroupId;
  label: string;
  tags: InkastTagDef[];
};

export const INKAST_TAG_GROUP_ORDER: InkastTagGroupId[] = [
  'narcissism',
  'barn',
  'personligt',
  'egen',
];

export const TAG_GROUPS: Record<Exclude<InkastTagGroupId, 'egen'>, InkastTagGroup> = {
  narcissism: {
    id: 'narcissism',
    label: 'Narcissism',
    tags: [
      {
        id: 'gaslighting',
        label: '#gaslighting',
        description: 'När verkligheten förvrängs.',
      },
      {
        id: 'motsagelse',
        label: '#motsägelse',
        description: 'När information ändras eller inte går ihop.',
      },
      {
        id: 'beten',
        label: '#beten',
        description: 'Provokationer skrivna för att trigga JADE (försvar/förklaring).',
      },
      {
        id: 'darvo',
        label: '#darvo',
        description: 'Förnekelse, attack och rollbyte (offer blir förövare).',
      },
      {
        id: 'fakta',
        label: '#fakta',
        description: 'Neutral logistik (tid, plats, datum).',
      },
      {
        id: 'tidslinje',
        label: '#tidslinje',
        description: 'Kronologisk kedja — kopplar händelser i ordning för dossier.',
      },
    ],
  },
  barn: {
    id: 'barn',
    label: 'Barn',
    tags: [
      {
        id: 'maende',
        label: '#mående',
        description: 'Humör, sömn, aptit eller stress — observerbart, neutralt.',
      },
      {
        id: 'overlamning',
        label: '#överlämning',
        description: 'Hämtning, lämning eller schema — vad som hände vid bytet.',
      },
      {
        id: 'skola',
        label: '#skola',
        description: 'Skola, läxor eller tredjepart (BVC, resurs, soc).',
      },
      {
        id: 'somatik',
        label: '#somatik',
        description: 'Kroppsliga signaler (magsmärta, trötthet) utan tolkning.',
      },
      {
        id: 'trygghet',
        label: '#trygghet',
        description: 'Regression, otrygghet eller behov av närhet efter separation.',
      },
      {
        id: 'vardag',
        label: '#vardag',
        description: 'Neutral vardagsobservation — rutiner och stabilitet.',
      },
    ],
  },
  personligt: {
    id: 'personligt',
    label: 'Personligt',
    tags: [
      {
        id: 'reflektion',
        label: '#reflektion',
        description: 'Tankar, känslor eller identitet — inåtvänd, inte bevis.',
      },
      {
        id: 'logistik',
        label: '#logistik',
        description: 'Planering, schema och praktiska anteckningar.',
      },
      {
        id: 'tacksamhet',
        label: '#tacksamhet',
        description: 'Det som gav lugn, energi eller mening idag.',
      },
      {
        id: 'aterhamtning',
        label: '#återhämtning',
        description: 'Vila, paus och nervsystemsreglering.',
      },
      {
        id: 'insikt',
        label: '#insikt',
        description: 'Mönster eller lärande om dig själv (KBT/ACT).',
      },
    ],
  },
};

/** Visningsnamn i hjälp-panel (inkast / Valv). */
export const TAG_GROUP_HELP_LABELS: Record<Exclude<InkastTagGroupId, 'egen'>, string> = {
  narcissism: 'Manipulation',
  barn: 'Barn',
  personligt: 'Personligt',
};

const BUILTIN_TAG_GROUP_ORDER: Exclude<InkastTagGroupId, 'egen'>[] = [
  'narcissism',
  'barn',
  'personligt',
];

/** Single source of truth — inbyggda grupper för tagg-hjälp. */
export function listBuiltinTagGroupsForHelp(): Array<{
  groupId: Exclude<InkastTagGroupId, 'egen'>;
  label: string;
  tags: InkastTagDef[];
}> {
  return BUILTIN_TAG_GROUP_ORDER.map((groupId) => ({
    groupId,
    label: TAG_GROUP_HELP_LABELS[groupId],
    tags: TAG_GROUPS[groupId].tags,
  }));
}

export type InkastTagMeta = {
  id: string;
  label: string;
  description: string;
  groupId: InkastTagGroupId;
};

export function userTagsToInkastDefs(userTags: UserTagRow[]): InkastTagDef[] {
  return userTags.map((tag) => ({
    id: `egen:${tag.slug}`,
    label: tag.label.startsWith('#') ? tag.label : `#${tag.label}`,
    description: tag.description?.trim() || 'Din egen tagg.',
  }));
}

export function inkastTagsForGroup(
  groupId: InkastTagGroupId,
  userTags: UserTagRow[] = [],
): InkastTagDef[] {
  if (groupId === 'egen') return userTagsToInkastDefs(userTags);
  return TAG_GROUPS[groupId].tags;
}

export function resolveInkastTag(category: string, userTags: UserTagRow[] = []): string {
  const normalized = category.trim().toLowerCase().replace(/^#/, '');

  for (const groupId of INKAST_TAG_GROUP_ORDER) {
    if (groupId === 'egen') {
      const custom = userTags.find((tag) => tag.slug === normalized || `egen:${tag.slug}` === normalized);
      if (custom) return `egen:${custom.slug}`;
      continue;
    }
    const match = TAG_GROUPS[groupId].tags.find((tag) => tag.id === normalized);
    if (match) return match.id;
  }

  if (normalized.startsWith('egen:')) {
    const slug = normalized.slice(5);
    if (slug && (userTags.length === 0 || userTags.some((tag) => tag.slug === slug))) {
      return `egen:${slug}`;
    }
  }

  return 'fakta';
}

export function inkastTagMeta(
  tagId: string,
  userTags: UserTagRow[] = [],
): InkastTagMeta {
  const resolved = resolveInkastTag(tagId, userTags);
  for (const groupId of INKAST_TAG_GROUP_ORDER) {
    const tags = inkastTagsForGroup(groupId, userTags);
    const hit = tags.find((tag) => tag.id === resolved);
    if (hit) {
      return { ...hit, groupId };
    }
  }
  return {
    id: 'fakta',
    label: '#fakta',
    description: 'Neutral logistik (tid, plats, datum).',
    groupId: 'narcissism',
  };
}

export function inkastTagGroupForTag(tagId: string, userTags: UserTagRow[] = []): InkastTagGroupId {
  return inkastTagMeta(tagId, userTags).groupId;
}

export function normalizeInkastTagSelection(
  raw: string | string[] | undefined,
  userTags: UserTagRow[] = [],
): string[] {
  const items = Array.isArray(raw) ? raw : raw?.trim() ? [raw] : [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const resolved = resolveInkastTag(item, userTags);
    if (!seen.has(resolved)) {
      seen.add(resolved);
      out.push(resolved);
    }
  }
  return out.slice(0, 12);
}

export function tagsFromInkastClassification(classification: InboxClassification): string[] {
  const fromTags = classification.tags
    .filter((t) => t !== 'manuell')
    .map((t) => t.trim())
    .filter(Boolean);
  if (fromTags.length) return fromTags;
  if (classification.category?.trim() && classification.category !== 'manuell') {
    return [classification.category.trim()];
  }
  return [];
}

export function toggleInkastTag(
  selected: string[],
  tagId: string,
  userTags: UserTagRow[] = [],
): string[] {
  const resolved = resolveInkastTag(tagId, userTags);
  const normalized = normalizeInkastTagSelection(selected, userTags);
  if (normalized.includes(resolved)) {
    return normalized.filter((id) => id !== resolved);
  }
  return [...normalized, resolved].slice(0, 12);
}

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

function normalizeItem(raw: unknown): SubmitInkastLiteItemResult {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const classification = normalizeClassification(o.classification);
  const action = o.action === 'persisted' ? 'persisted' : 'queued';
  const fileId = typeof o.fileId === 'string' && o.fileId ? o.fileId : 'inkast_unknown';
  const fileName =
    typeof o.fileName === 'string' && o.fileName.trim() ? o.fileName.trim() : 'inkast';

  return {
    classification,
    action,
    fileId,
    fileName,
    collection: typeof o.collection === 'string' ? o.collection : undefined,
    docId: typeof o.docId === 'string' ? o.docId : undefined,
    queueId: typeof o.queueId === 'string' ? o.queueId : undefined,
    evidenceUrl: typeof o.evidenceUrl === 'string' ? o.evidenceUrl : undefined,
  };
}

/** Fail-safe parse — undviker vit skärm om Cloud Function returnerar ofullständigt svar. */
export function parseSubmitInkastLiteResult(raw: unknown): SubmitInkastLiteResult {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  if (Array.isArray(o.items)) {
    const items = o.items.map(normalizeItem);
    return {
      items,
      processed: typeof o.processed === 'number' ? o.processed : items.length,
      persisted: typeof o.persisted === 'number' ? o.persisted : items.filter((i) => i.action === 'persisted').length,
      queued: typeof o.queued === 'number' ? o.queued : items.filter((i) => i.action === 'queued').length,
      failed: typeof o.failed === 'number' ? o.failed : 0,
      errors: Array.isArray(o.errors)
        ? o.errors.map((e) => {
            const row = e && typeof e === 'object' ? (e as Record<string, unknown>) : {};
            return {
              fileName: typeof row.fileName === 'string' ? row.fileName : 'okänd',
              error: typeof row.error === 'string' ? row.error : 'Fel',
            };
          })
        : [],
    };
  }

  // Legacy enkel-post svar
  const legacy = normalizeItem(raw);
  return {
    items: [legacy],
    processed: 1,
    persisted: legacy.action === 'persisted' ? 1 : 0,
    queued: legacy.action === 'queued' ? 1 : 0,
    failed: 0,
    errors: [],
  };
}

/** Första posten — bakåtkompatibelt med enkel-fil-flöden. */
export function primaryInkastItem(result: SubmitInkastLiteResult): SubmitInkastLiteItemResult {
  return (
    result.items[0] ?? {
      classification: normalizeClassification(undefined),
      action: 'queued',
      fileId: 'inkast_unknown',
      fileName: 'inkast',
    }
  );
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
    base64Files?: string[];
    mimeTypes?: string[];
    fileNames?: string[];
    optInTrauma?: boolean;
    sourceModule?: string;
    manualRouting?: Exclude<InboxRouting, 'review'>;
    manualCategory?: string;
    manualTags?: string[];
    manualComment?: string;
    manualChildAlias?: string;
  },
  SubmitInkastLiteResult
>(functions, 'submitInkastLite');

const previewInboxClassificationCallable = httpsCallable<
  { text: string; fileName?: string },
  { classification: InboxClassification }
>(functions, 'previewInboxClassification');

export async function previewInboxClassification(input: {
  text: string;
  fileName?: string;
}): Promise<InboxClassification> {
  try {
    const result = await previewInboxClassificationCallable(input);
    return normalizeClassification(result.data?.classification);
  } catch (error) {
    throw new Error(extractCallableErrorMessage(error));
  }
}

export async function submitInkastLite(input: {
  text?: string;
  fileName?: string;
  mimeType?: string;
  base64?: string;
  base64Files?: string[];
  mimeTypes?: string[];
  fileNames?: string[];
  optInTrauma?: boolean;
  sourceModule?: string;
  manualRouting?: Exclude<InboxRouting, 'review'>;
  manualCategory?: string;
  manualTags?: string[];
  manualComment?: string;
  manualChildAlias?: string;
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
  if (result.items.length === 1) {
    const item = result.items[0]!;
    const routingLabel = ROUTING_LABELS[item.classification.routing] ?? 'Granska';

    if (item.action === 'queued') {
      return `Väntar granskning (${routingLabel}). Öppna Valv → Samla → granskningskö när du vill bekräfta.`;
    }

    const dest =
      item.collection && COLLECTION_LABELS[item.collection]
        ? COLLECTION_LABELS[item.collection]
        : routingLabel;

    return `Sparat i ${dest}. ${item.classification.summary}`;
  }

  const parts = [
    `${result.processed} fil${result.processed === 1 ? '' : 'er'} bearbetade`,
    result.persisted > 0 ? `${result.persisted} sparade` : null,
    result.queued > 0 ? `${result.queued} i granskningskö` : null,
    result.failed > 0 ? `${result.failed} misslyckades` : null,
  ].filter(Boolean);

  return parts.join(' · ');
}

export const VALV_KUNSKAP_INBOX_LINK = {
  pathname: NAV_PATHS.VALVET,
  search: '?vaultTab=kunskapsbank',
} as const;

export const VALV_SAMLA_GRANSKA_LINK = {
  pathname: NAV_PATHS.VALVET,
  search: '?vaultTab=logga&samlaView=granska',
} as const;

export const VALV_ARKIV_LINK = {
  pathname: NAV_PATHS.VALVET,
  search: '?vaultTab=logga',
} as const;
