import {
  EXPLORE_TASK_POOL,
  type ExploreFilter,
  type ExploreTaskMeta,
} from '../content/exploreTaskCatalog';

export type { ExploreFilter, ExploreKategori, ExploreTaskMeta } from '../content/exploreTaskCatalog';

export type ExploreQueueTask = Pick<
  ExploreTaskMeta,
  'id' | 'titel' | 'kategori' | 'budgetgrans' | 'isSocial'
>;

export type ExplorePickResult = {
  weekKey: string;
  availableTasks: ExploreQueueTask[];
  currentTask: ExploreTaskMeta | null;
  currentIndex: number;
};

const MAX_WEEK_TASKS = 6;
const MAX_SKIPS = 5;

/** FNV-1a — deterministisk hash (samma som pickDagligMix). */
function fnv1a(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** ISO-vecka `YYYY-Www` — lokal tid. */
export function isoWeekKey(date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function taskMatchesFilters(task: ExploreTaskMeta, filters: readonly ExploreFilter[]): boolean {
  if (filters.length === 0) return true;
  if (filters.includes(task.kategori as ExploreFilter)) return true;
  if (filters.includes('social_safe') && task.isSocial) return true;
  if (filters.includes('budget_low') && task.budgetgrans <= 1) return true;
  if (filters.includes('energy_low') && task.kategori === 'energy_low') return true;
  return false;
}

function pickFromPool<T>(pool: readonly T[], seed: string): T | null {
  if (pool.length === 0) return null;
  return pool[fnv1a(seed) % pool.length] ?? null;
}

function toQueueTask(task: ExploreTaskMeta): ExploreQueueTask {
  return {
    id: task.id,
    titel: task.titel,
    kategori: task.kategori,
    budgetgrans: task.budgetgrans,
    isSocial: task.isSocial,
  };
}

/**
 * Generera veckans tillgängliga uppgifter — deterministiskt per uid + vecka + filter.
 * Ingen streak, ingen Kunskap-RAG.
 */
export function buildWeeklyAvailableTasks(options: {
  uid: string;
  weekKey: string;
  filters: readonly ExploreFilter[];
  excludeIds?: readonly string[];
  count?: number;
}): ExploreQueueTask[] {
  const count = options.count ?? MAX_WEEK_TASKS;
  const exclude = new Set(options.excludeIds ?? []);
  const pool = EXPLORE_TASK_POOL.filter(
    (t) => !exclude.has(t.id) && taskMatchesFilters(t, options.filters),
  );
  if (pool.length === 0) return [];

  const picked: ExploreQueueTask[] = [];
  const used = new Set<string>();
  for (let i = 0; i < count && picked.length < pool.length; i += 1) {
    const seed = `${options.weekKey}|${options.uid}|explore|${options.filters.join(',')}|${i}`;
    const candidate = pickFromPool(pool, seed);
    if (!candidate || used.has(candidate.id)) continue;
    used.add(candidate.id);
    picked.push(toQueueTask(candidate));
  }
  return picked;
}

export function resolveExploreTaskById(id: string): ExploreTaskMeta | undefined {
  return EXPLORE_TASK_POOL.find((t) => t.id === id);
}

/**
 * Välj aktuell uppgift från kön — roterar vid skip (max 5).
 */
export function pickCurrentExploreTask(options: {
  availableTasks: readonly ExploreQueueTask[];
  completedIds: readonly string[];
  skipCount: number;
  uid: string;
  weekKey: string;
}): { task: ExploreTaskMeta | null; index: number } {
  const completed = new Set(options.completedIds);
  const open = options.availableTasks.filter((t) => !completed.has(t.id));
  if (open.length === 0) return { task: null, index: -1 };

  const cappedSkips = Math.min(Math.max(0, options.skipCount), MAX_SKIPS);
  const seed = `${options.weekKey}|${options.uid}|current|${cappedSkips}`;
  const index = fnv1a(seed) % open.length;
  const row = open[index];
  if (!row) return { task: null, index: -1 };
  const meta = resolveExploreTaskById(row.id);
  return { task: meta ?? null, index };
}

export function needsWeeklyRegeneration(
  lastGenerated: Date | null | undefined,
  now = new Date(),
): boolean {
  if (!lastGenerated) return true;
  return isoWeekKey(lastGenerated) !== isoWeekKey(now);
}

export const EXPLORE_MAX_SKIPS = MAX_SKIPS;
