/**
 * Fas C — föräldermilstolpar (Grey Rock / BIFF), lokal device only.
 * Hamn-data: manuell kryss + Hamn-besök. Ingen Barnen-RAG, ingen moln-ML.
 */

const STORAGE_KEY = 'lk.barnhub.parentMilestones.v1';

export type ParentMilestoneId =
  | 'skrift_idag'
  | 'biff_svar'
  | 'ingen_jade'
  | 'barn_forst'
  | 'speglar_vid_sveda';

export type ParentMilestoneDef = {
  id: ParentMilestoneId;
  label: string;
  hint: string;
  hamnLink?: boolean;
};

export const PARENT_MILESTONE_DEFS: readonly ParentMilestoneDef[] = [
  {
    id: 'skrift_idag',
    label: 'Höll mig till skrift idag',
    hint: 'Ingen impulsiv telefon — logistik på skrift.',
    hamnLink: true,
  },
  {
    id: 'biff_svar',
    label: 'Svarade via Hamn (BIFF)',
    hint: 'Öppnade Hamn och skrev ett kort svar.',
    hamnLink: true,
  },
  {
    id: 'ingen_jade',
    label: 'Ingen JADE',
    hint: 'Förklarade, argumenterade eller försvarade dig inte.',
  },
  {
    id: 'barn_forst',
    label: 'Barnet först',
    hint: 'Reglerade dig innan du mötte barnet.',
  },
  {
    id: 'speglar_vid_sveda',
    label: 'Använde Speglar vid sveda',
    hint: 'Tog smärtan till Speglar — inte till barnet.',
  },
];

export type ParentMilestoneState = {
  /** YYYY-MM-DD → set of milestone ids completed that day */
  byDay: Record<string, ParentMilestoneId[]>;
  /** Last day user opened Hamn from Barnhub */
  lastHamnVisitDay?: string;
};

/** Lokal kalenderdag (inte UTC) — undvik midnattsglapp. */
export function localDayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function empty(): ParentMilestoneState {
  return { byDay: {} };
}

export function loadParentMilestones(): ParentMilestoneState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<ParentMilestoneState>;
    return {
      byDay: parsed.byDay ?? {},
      lastHamnVisitDay: parsed.lastHamnVisitDay,
    };
  } catch {
    return empty();
  }
}

function save(state: ParentMilestoneState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function isMilestoneDoneToday(id: ParentMilestoneId, day = localDayKey()): boolean {
  const s = loadParentMilestones();
  return (s.byDay[day] ?? []).includes(id);
}

export function toggleMilestoneToday(id: ParentMilestoneId): boolean {
  const s = loadParentMilestones();
  const day = localDayKey();
  const cur = new Set(s.byDay[day] ?? []);
  if (cur.has(id)) cur.delete(id);
  else cur.add(id);
  s.byDay[day] = [...cur];
  save(s);
  return cur.has(id);
}

export function markHamnVisitedFromBarnhub(): void {
  const s = loadParentMilestones();
  s.lastHamnVisitDay = localDayKey();
  save(s);
}

/** Consecutive calendar days with ≥1 milestone (today or from yesterday if today empty). */
export function greyRockStreakDays(now = new Date()): number {
  const s = loadParentMilestones();
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if ((s.byDay[localDayKey(cursor)] ?? []).length === 0) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  for (let i = 0; i < 90; i++) {
    const key = localDayKey(cursor);
    if ((s.byDay[key] ?? []).length === 0) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function milestonesDoneTodayCount(): number {
  const day = localDayKey();
  return (loadParentMilestones().byDay[day] ?? []).length;
}
