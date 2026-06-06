import type { MabraSession, VitEntryKind, VitEntryRow } from '@/core/types/firestore';
import { MABRA_PROJECTS, type MabraProjectId } from '../constants/mabraProjects';

export type VitHubStats = {
  totalEntries: number;
  activeProjectIds: MabraProjectId[];
  projectCounts: Partial<Record<MabraProjectId, number>>;
  kindCounts: Record<VitEntryKind, number>;
  /** Unika dagar med aktivitet — inte streak/gamification. */
  activeDays: number;
  recentEntries: VitEntryRow[];
  sessionCount: number;
  symptomCounts: Record<string, number>;
};

const VIT_PROJECT_IDS = new Set<string>(MABRA_PROJECTS.map((p) => p.id));

function dateKeyFromEntry(entry: VitEntryRow): string {
  if (entry.cardDateKey) return entry.cardDateKey;
  return entry.createdAt ? entry.createdAt.slice(0, 10) : '';
}

/** Deterministisk statistik — ingen LLM, ingen streak. */
export function computeVitHubStats(params: {
  entries: VitEntryRow[];
  activeProjectIds?: string[];
  sessions?: Pick<MabraSession, 'hubSymptom'>[];
}): VitHubStats {
  const kindCounts: Record<VitEntryKind, number> = {
    card: 0,
    memory: 0,
    chat_turn: 0,
  };
  const projectCounts: Partial<Record<MabraProjectId, number>> = {};
  const dayKeys = new Set<string>();

  for (const entry of params.entries) {
    kindCounts[entry.kind] = (kindCounts[entry.kind] ?? 0) + 1;
    if (VIT_PROJECT_IDS.has(entry.projectId)) {
      const pid = entry.projectId as MabraProjectId;
      projectCounts[pid] = (projectCounts[pid] ?? 0) + 1;
    }
    const dk = dateKeyFromEntry(entry);
    if (dk) dayKeys.add(dk);
  }

  const symptomCounts: Record<string, number> = {};
  for (const session of params.sessions ?? []) {
    const key = session.hubSymptom?.trim() || 'ovrigt';
    symptomCounts[key] = (symptomCounts[key] ?? 0) + 1;
  }

  const activeFromHub = (params.activeProjectIds ?? []).filter((id): id is MabraProjectId =>
    VIT_PROJECT_IDS.has(id),
  );
  const activeFromEntries = Object.keys(projectCounts).filter((id): id is MabraProjectId =>
    VIT_PROJECT_IDS.has(id),
  );
  const activeProjectIds = [...new Set([...activeFromHub, ...activeFromEntries])];

  return {
    totalEntries: params.entries.length,
    activeProjectIds,
    projectCounts,
    kindCounts,
    activeDays: dayKeys.size,
    recentEntries: params.entries.slice(0, 3),
    sessionCount: params.sessions?.length ?? 0,
    symptomCounts,
  };
}

export function vitProjectTitle(projectId: string): string {
  return MABRA_PROJECTS.find((p) => p.id === projectId)?.title ?? projectId;
}
