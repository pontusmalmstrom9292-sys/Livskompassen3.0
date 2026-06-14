import type { VaultLog } from '@/core/types/firestore';
import type { ChildrenLogEntry } from '@/features/family/children/types';
import type { DossierCandidateDoc, DossierSourceKey, GenerateDossierInput } from '../types';

export function isoDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

export function inDateRange(createdAt: string | undefined, from: string, to: string): boolean {
  if (!createdAt) return false;
  const day = isoDateOnly(createdAt);
  return day >= from && day <= to;
}

export function defaultDateRange(): { dateFrom: string; dateTo: string } {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);
  return {
    dateFrom: from.toISOString().slice(0, 10),
    dateTo: to.toISOString().slice(0, 10),
  };
}

export function shiftMonths(isoDate: string, months: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function vaultTitle(log: VaultLog & { id: string }): string {
  return log.category?.trim() || log.action || 'Valv-post';
}

function vaultPreview(log: VaultLog): string {
  const parts = [log.truth, log.myReality, log.theirVersion].filter(Boolean);
  const text = parts.join(' · ') || log.childrenImpact || '';
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}

export function vaultToCandidate(log: VaultLog & { id: string }): DossierCandidateDoc {
  return {
    id: log.id,
    kind: 'reality_vault',
    createdAt: log.createdAt,
    title: vaultTitle(log),
    preview: vaultPreview(log),
    category: log.category,
  };
}

export function childrenToCandidate(log: ChildrenLogEntry): DossierCandidateDoc {
  const title = [log.childAlias, log.category || log.action].filter(Boolean).join(' · ') || 'Barnlogg';
  const preview =
    log.observation || log.truth || log.childrenImpact || 'Fysiologi/logg';
  return {
    id: log.id,
    kind: 'children_logs',
    createdAt: log.createdAt ?? '',
    title,
    preview: preview.length > 160 ? `${preview.slice(0, 160)}…` : preview,
    category: log.category,
  };
}

export function journalToCandidate(entry: {
  id: string;
  mood?: string;
  text?: string;
  createdAt?: string;
}): DossierCandidateDoc {
  const mood = entry.mood ? `Humör: ${entry.mood}. ` : '';
  const text = String(entry.text ?? '');
  return {
    id: entry.id,
    kind: 'journal',
    createdAt: entry.createdAt ?? '',
    title: 'Dagbok',
    preview: `${mood}${text}`.slice(0, 160),
  };
}

export function filterCandidates(
  docs: DossierCandidateDoc[],
  dateFrom: string,
  dateTo: string,
  enabledSources: Record<DossierSourceKey, boolean>,
  categoryFilter: string[],
  techniqueFilter: string[] = [],
  techniquesByVaultId?: ReadonlyMap<string, readonly string[]>,
): DossierCandidateDoc[] {
  return docs.filter((doc) => {
    if (!enabledSources[doc.kind]) return false;
    if (!inDateRange(doc.createdAt, dateFrom, dateTo)) return false;
    if (categoryFilter.length > 0 && doc.category) {
      if (!categoryFilter.some((tag) => doc.category?.toLowerCase().includes(tag.toLowerCase()))) {
        return false;
      }
    } else if (categoryFilter.length > 0 && !doc.category) {
      return false;
    }
    if (techniqueFilter.length > 0) {
      if (doc.kind !== 'reality_vault') return false;
      const techniques = techniquesByVaultId?.get(doc.id) ?? [];
      if (!techniqueFilter.some((t) => techniques.includes(t))) return false;
    }
    return true;
  });
}

export function collectTechniqueTags(
  techniquesByVaultId: ReadonlyMap<string, readonly string[]>,
): string[] {
  const tags = new Set<string>();
  for (const techniques of techniquesByVaultId.values()) {
    for (const t of techniques) tags.add(t);
  }
  return [...tags].sort((a, b) => a.localeCompare(b, 'sv'));
}

export function collectCategoryTags(docs: DossierCandidateDoc[]): string[] {
  const tags = new Set<string>();
  for (const doc of docs) {
    if (doc.category?.trim()) tags.add(doc.category.trim());
  }
  return [...tags].sort((a, b) => a.localeCompare(b, 'sv'));
}

export function groupIncludedIds(
  docs: DossierCandidateDoc[],
  included: Set<string>,
): GenerateDossierInput['includedDocIds'] {
  const ids: GenerateDossierInput['includedDocIds'] = {
    reality_vault: [],
    children_logs: [],
    journal: [],
  };
  for (const doc of docs) {
    if (!included.has(doc.id)) continue;
    ids[doc.kind].push(doc.id);
  }
  return ids;
}
