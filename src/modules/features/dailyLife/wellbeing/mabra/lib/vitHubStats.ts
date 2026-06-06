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
  /** Senaste N kalenderveckor — deterministisk aktivitet, ingen streak. */
  weeklyActivity: VitWeekBucket[];
};

export type VitWeekBucket = {
  weekKey: string;
  label: string;
  count: number;
};

const VIT_PROJECT_IDS = new Set<string>(MABRA_PROJECTS.map((p) => p.id));

function dateKeyFromEntry(entry: VitEntryRow): string {
  if (entry.cardDateKey) return entry.cardDateKey;
  return entry.createdAt ? entry.createdAt.slice(0, 10) : '';
}

function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function weekLabel(date: Date, weeksAgo: number): string {
  if (weeksAgo === 0) return 'Denna v.';
  if (weeksAgo === 1) return 'Förra v.';
  return `v.${isoWeekKey(date).slice(-2)}`;
}

/** Senaste kalenderveckor — räknar vit_entries per vecka, ingen streak. */
export function computeVitWeeklyActivity(
  entries: VitEntryRow[],
  weekCount = 4,
): VitWeekBucket[] {
  const now = new Date();
  const buckets = new Map<string, VitWeekBucket>();

  for (let i = weekCount - 1; i >= 0; i -= 1) {
    const anchor = new Date(now);
    anchor.setDate(anchor.getDate() - i * 7);
    const key = isoWeekKey(anchor);
    buckets.set(key, { weekKey: key, label: weekLabel(anchor, i), count: 0 });
  }

  for (const entry of entries) {
    const dk = dateKeyFromEntry(entry);
    if (!dk) continue;
    const entryDate = new Date(`${dk}T12:00:00`);
    const key = isoWeekKey(entryDate);
    const bucket = buckets.get(key);
    if (bucket) bucket.count += 1;
  }

  return [...buckets.values()];
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
    weeklyActivity: computeVitWeeklyActivity(params.entries),
  };
}

export function vitProjectTitle(projectId: string): string {
  return MABRA_PROJECTS.find((p) => p.id === projectId)?.title ?? projectId;
}
