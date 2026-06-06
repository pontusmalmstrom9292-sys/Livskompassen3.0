import type { VitEntryKind, VitEntryRow } from '@/core/types/firestore';
import type { MabraProjectId } from '../constants/mabraProjects';

export type VitKindFilter = 'all' | VitEntryKind;

export type VitEntryFilter = {
  kind: VitKindFilter;
  projectId: MabraProjectId | 'all';
};

export const DEFAULT_VIT_ENTRY_FILTER: VitEntryFilter = {
  kind: 'all',
  projectId: 'all',
};

const VALID_KINDS = new Set<VitEntryKind>(['card', 'memory', 'chat_turn']);
const VALID_PROJECTS = new Set<string>([
  'self_esteem',
  'emotional_memory',
  'learn_together',
  'who_am_i',
]);

export function parseVitKindFilter(raw: string | null): VitKindFilter {
  if (raw && VALID_KINDS.has(raw as VitEntryKind)) return raw as VitEntryKind;
  return 'all';
}

export function parseVitProjectFilter(raw: string | null): MabraProjectId | 'all' {
  if (raw && VALID_PROJECTS.has(raw)) return raw as MabraProjectId;
  return 'all';
}

export function filterVitEntries(entries: VitEntryRow[], filter: VitEntryFilter): VitEntryRow[] {
  return entries.filter((entry) => {
    if (filter.kind !== 'all' && entry.kind !== filter.kind) return false;
    if (filter.projectId !== 'all' && entry.projectId !== filter.projectId) return false;
    return true;
  });
}

export function countByKind(entries: VitEntryRow[]): Record<VitEntryKind, number> {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.kind] = (acc[entry.kind] ?? 0) + 1;
      return acc;
    },
    { card: 0, memory: 0, chat_turn: 0 } as Record<VitEntryKind, number>,
  );
}
