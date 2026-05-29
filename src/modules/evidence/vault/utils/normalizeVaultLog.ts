import type { VaultLog, WeaverTags } from '../../../core/types/firestore';

export function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.length > 0);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeWeaverTags(raw: unknown): WeaverTags | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const wt = raw as Record<string, unknown>;
  return {
    emotions: normalizeStringArray(wt.emotions),
    actors: normalizeStringArray(wt.actors),
    threatLevel:
      wt.threatLevel === 'low' ||
      wt.threatLevel === 'medium' ||
      wt.threatLevel === 'high' ||
      wt.threatLevel === 'none'
        ? wt.threatLevel
        : 'none',
    threatScore: typeof wt.threatScore === 'number' ? wt.threatScore : undefined,
    ragAnchors: Array.isArray(wt.ragAnchors) ? (wt.ragAnchors as WeaverTags['ragAnchors']) : [],
    model: 'gemini-1.5-pro',
    journalEntryId: typeof wt.journalEntryId === 'string' ? wt.journalEntryId : '',
  };
}

/** Säker normalisering — legacy Firestore-rader får inte krascha list-UI. */
export function normalizeVaultLogFields(
  log: VaultLog & { id: string; weaverTags?: unknown },
): VaultLog & { id: string; weaverTags?: WeaverTags } {
  const { weaverTags: _rawWeaver, bodySignals: _rawSignals, ...rest } = log;
  const weaverTags = normalizeWeaverTags(_rawWeaver);
  return {
    ...rest,
    truth: typeof log.truth === 'string' ? log.truth : String(log.truth ?? ''),
    bodySignals: normalizeStringArray(_rawSignals ?? log.bodySignals),
    ...(weaverTags ? { weaverTags } : {}),
  };
}
