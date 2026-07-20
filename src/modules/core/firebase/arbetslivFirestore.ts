/**
 * arbetslivFirestore.ts
 *
 * Domänägt Firestore-lager för Arbetsliv-silon.
 * Ansvarar strikt för: TimeEntries (stämpelklocka), arbetsloggning, flex och veckostatus.
 *
 * ❌ Importera INTE ekonomifunktioner härifrån.
 * ✅ Konsumeras av: features/admin/stampla, features/dailyLife/arbetsliv
 *
 * Utdragen ur timeEconomyFirestore.ts (2026-06-13) som ett led i domänsiloarbetet.
 * Originalet är intakt och oförändrat under migreringen.
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { assertArchitectureWrite, db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { TimeEntryRow } from '../types/firestore';
import {
  computeHoursWorkedOnClockOut,
  computeWeekFlexDetail,
} from '@/features/dailyLife/wellbeing/economy/rules/payTimeRules';
import type { TimeEntryLike, WeekFlexDetail } from '@/features/dailyLife/wellbeing/economy/rules/payTimeRules';
import { formatDateLocal } from '@/shared/utils/dateHelpers';
import {
  buildCategoryName,
  categoryBase,
  DEFAULT_BREAK_MINUTES,
  DEFAULT_HELDAG,
  DEFAULT_SCOPE_PERCENT,
  eachDateInclusive,
  emptyWeekCalendar,
  formatTimeLocal,
  getMonday,
  getWeekNumber,
  normalizeClock,
  parseDateOnly,
} from '../utils/timeMath';

// ─── Re-exportera typer som konsumenter av den gamla filen kan behöva ─────────
export type { WeekFlexDetail };

// ─── Internt: delade Firestore-hjälpare ─────────────────────────────────────

type FirestorePayload = Record<string, unknown>;

function withUserId(userId: string, data: FirestorePayload): FirestorePayload {
  return { ...data, userId, ownerId: userId, createdAt: serverTimestamp() };
}

function ownerScopedQuery(ref: ReturnType<typeof collection>, ownerId: string) {
  return query(ref, where('ownerId', '==', ownerId));
}

function normalizeCreatedAt(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return '';
}

// ─── Internt: mappers ────────────────────────────────────────────────────────

function mapTimeEntry(id: string, data: FirestorePayload, userId: string): TimeEntryRow {
  const clockOutRaw = data.clockOut;
  const clockOut =
    clockOutRaw != null && String(clockOutRaw).trim() !== '' ? String(clockOutRaw) : null;
  /** Öppet pass = saknar utstämpling (källa: Pontus/äldre rader kan ha fel isOpen-flagga). */
  const isOpen = clockOut == null;

  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    date: String(data.date ?? ''),
    clockIn: normalizeClock(String(data.clockIn ?? '00:00')),
    clockOut: clockOut ? normalizeClock(clockOut) : null,
    category: String(data.category ?? 'Arbete'),
    breakMinutes: Number(data.breakMinutes ?? DEFAULT_BREAK_MINUTES),
    scopePercent: Number(data.scopePercent ?? DEFAULT_SCOPE_PERCENT),
    hoursWorked: Number(data.hoursWorked ?? 0),
    isOpen,
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: data.updatedAt ? normalizeCreatedAt(data.updatedAt) : undefined,
  };
}

function toTimeEntryLike(row: TimeEntryRow): TimeEntryLike {
  return {
    date: row.date,
    clockIn: row.clockIn,
    clockOut: row.clockOut,
    category: row.category,
    breakMinutes: row.breakMinutes,
    scopePercent: row.scopePercent,
    hoursWorked: row.hoursWorked,
  };
}

// ─── Intern bulk-hämtning (används av alla publika funktioner) ────────────────

async function getAllTimeEntries(userId: string): Promise<TimeEntryRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.time_entries);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs
    .map((d) => mapTimeEntry(d.id, d.data() as FirestorePayload, userId))
    .sort((a, b) => `${b.date}${b.clockIn}`.localeCompare(`${a.date}${a.clockIn}`));
}

// ─── Publika CRUD-funktioner: Stämpelklocka ──────────────────────────────────

/**
 * Startar ett nytt tidspass (instämpling).
 * Läser defaultBreakMinutes från ekonomiprofilen via en minimal fetch — utan att
 * importera getEconomyProfileExtended. Sätter till DEFAULT_BREAK_MINUTES om saknad.
 */
export async function recordTimeIn(userId: string, category = 'Arbete') {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.time_entries);
  assertArchitectureWrite(FIRESTORE_COLLECTIONS.time_entries, 'create');
  const open = await getOpenTimeEntry(userId);
  if (open) throw new Error('Du är redan instämplad.');

  // Minimal profilhämtning för att få defaultBreakMinutes utan cross-domain-import
  let breakMinutes = DEFAULT_BREAK_MINUTES;
  try {
    const profRef = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
    const profSnap = await getDoc(profRef);
    if (profSnap.exists()) {
      breakMinutes = Number(profSnap.data().defaultBreakMinutes ?? DEFAULT_BREAK_MINUTES);
    }
  } catch {
    // Fallback — stör ej stämpling
  }

  const now = new Date();
  const date = formatDateLocal(now);
  const clockIn = formatTimeLocal(now);
  const ref = collection(db, FIRESTORE_COLLECTIONS.time_entries);
  const docRef = await addDoc(
    ref,
    withUserId(userId, {
      date,
      clockIn,
      clockOut: null,
      category: category.trim() || 'Arbete',
      breakMinutes,
      scopePercent: DEFAULT_SCOPE_PERCENT,
      hoursWorked: 0,
      isOpen: true,
    }),
  );
  return { id: docRef.id, date, clockIn, category: category.trim() || 'Arbete' };
}

/** Avslutar pågående tidspass (utstämpling). */
export async function recordTimeOut(userId: string, entryId?: string) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.time_entries);
  assertArchitectureWrite(FIRESTORE_COLLECTIONS.time_entries, 'update');
  let open: TimeEntryRow | null = null;

  if (entryId) {
    const snap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.time_entries, entryId));
    if (snap.exists() && snap.data().ownerId === userId) {
      open = mapTimeEntry(entryId, snap.data() as FirestorePayload, userId);
      if (open.clockOut != null) open = null;
    }
  }

  if (!open) {
    open = await getOpenTimeEntry(userId);
  }
  if (!open) throw new Error('Ingen pågående stämpling att stämpla ut från.');

  const now = new Date();
  const clockOut = formatTimeLocal(now);
  const { breakMinutes, hoursWorked } = computeHoursWorkedOnClockOut({
    date: open.date,
    clockIn: open.clockIn,
    clockOut,
    breakMinutes: open.breakMinutes,
    scopePercent: open.scopePercent,
  });

  const ref = doc(db, FIRESTORE_COLLECTIONS.time_entries, open.id);
  await updateDoc(ref, {
    userId,
    ownerId: userId,
    clockOut,
    breakMinutes,
    hoursWorked,
    isOpen: false,
    updatedAt: serverTimestamp(),
  });
  return { id: open.id, hoursWorked, breakMinutes };
}

/** Returnerar öppet (pågående) tidspass eller null. */
export async function getOpenTimeEntry(userId: string): Promise<TimeEntryRow | null> {
  const rows = await getAllTimeEntries(userId);
  return rows.find((r) => r.clockOut == null) ?? null;
}

/** Stänger öppna pass utan clockOut (äldre data med isOpen:false). */
export async function repairOpenTimeEntryFlags(userId: string): Promise<number> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.time_entries);
  assertArchitectureWrite(FIRESTORE_COLLECTIONS.time_entries, 'update');
  const rows = await getAllTimeEntries(userId);
  const stuck = rows.filter((r) => r.clockOut == null && r.isOpen === false);
  await Promise.all(
    stuck.map((r) =>
      updateDoc(doc(db, FIRESTORE_COLLECTIONS.time_entries, r.id), {
        userId,
        ownerId: userId,
        isOpen: true,
        updatedAt: serverTimestamp(),
      }),
    ),
  );
  return stuck.length;
}

/** Skapar manuella tidsposter för ett datumintervall. */
export async function addManualTimeEntries(
  userId: string,
  input: {
    fromDate: string;
    toDate: string;
    clockIn?: string;
    clockOut?: string;
    category: string;
    breakMinutes?: number;
    scopePercent?: number;
  },
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.time_entries);
  assertArchitectureWrite(FIRESTORE_COLLECTIONS.time_entries, 'create');
  const dates = eachDateInclusive(input.fromDate, input.toDate);
  const clockIn = input.clockIn ?? DEFAULT_HELDAG.in;
  const clockOut = input.clockOut ?? DEFAULT_HELDAG.out;
  const breakMinutes = input.breakMinutes ?? DEFAULT_BREAK_MINUTES;
  const scopePercent = input.scopePercent ?? DEFAULT_SCOPE_PERCENT;
  const category = buildCategoryName(input.category, scopePercent);
  const ref = collection(db, FIRESTORE_COLLECTIONS.time_entries);
  const ids: string[] = [];

  for (const date of dates) {
    const { breakMinutes: resolvedBreak, hoursWorked } = computeHoursWorkedOnClockOut({
      date,
      clockIn,
      clockOut,
      breakMinutes,
      scopePercent,
    });
    const docRef = await addDoc(
      ref,
      withUserId(userId, {
        date,
        clockIn,
        clockOut,
        category,
        breakMinutes: resolvedBreak,
        scopePercent,
        hoursWorked,
        isOpen: false,
      }),
    );
    ids.push(docRef.id);
  }
  return ids;
}

/** Uppdaterar ett befintligt tidspass. */
export async function updateTimeEntry(
  userId: string,
  entryId: string,
  patch: {
    category: string;
    clockIn: string;
    clockOut: string;
    breakMinutes: number;
    scopePercent: number;
  },
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.time_entries);
  assertArchitectureWrite(FIRESTORE_COLLECTIONS.time_entries, 'update');
  const ref = doc(db, FIRESTORE_COLLECTIONS.time_entries, entryId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Pass hittades inte.');

  const date = String(snap.data().date);
  const category = buildCategoryName(patch.category, patch.scopePercent);
  const { breakMinutes, hoursWorked } = computeHoursWorkedOnClockOut({
    date,
    clockIn: patch.clockIn,
    clockOut: patch.clockOut,
    breakMinutes: patch.breakMinutes,
    scopePercent: patch.scopePercent,
  });

  await updateDoc(ref, {
    category,
    clockIn: patch.clockIn,
    clockOut: patch.clockOut,
    breakMinutes,
    scopePercent: patch.scopePercent,
    hoursWorked,
    isOpen: false,
    updatedAt: serverTimestamp(),
  });
}

/** Raderar ett tidspass (ägarverifiering). */
export async function deleteTimeEntry(userId: string, entryId: string) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.time_entries);
  assertArchitectureWrite(FIRESTORE_COLLECTIONS.time_entries, 'delete');
  const ref = doc(db, FIRESTORE_COLLECTIONS.time_entries, entryId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Pass hittades inte.');
  await deleteDoc(ref);
}

// ─── Publika READ-funktioner: Statistik & Status ─────────────────────────────

/** Hämtar de senaste `limit` tidsposter, nyast först. */
export async function getRecentTimeEntries(userId: string, limit = 50): Promise<TimeEntryRow[]> {
  const rows = await getAllTimeEntries(userId);
  return rows.slice(-limit).reverse();
}

/** Nuläge för idag: instämplad, inTid, kategori, dagensTimmar, senasteUt. */
export async function getTodayTimeStatus(userId: string) {
  const today = formatDateLocal();
  const rows = await getAllTimeEntries(userId);
  const todayRows = rows.filter((r) => r.date === today);
  const open = rows.find((r) => r.clockOut == null) ?? null;
  const dagensTimmar = todayRows.reduce((sum, r) => sum + r.hoursWorked, 0);
  let senasteUt = '';
  for (const r of todayRows) {
    if (r.clockOut) senasteUt = r.clockOut;
  }

  return {
    instamplad: Boolean(open),
    inTid: open?.clockIn ?? '',
    kat: open?.category ?? '',
    dagensTimmar: Math.round(dagensTimmar * 10) / 10,
    senasteUt,
  };
}

/** Veckans ackumulerade timmar, per kategori och dagantal. */
export async function getWeekTimeStats(userId: string) {
  const monday = getMonday();
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const rows = await getAllTimeEntries(userId);
  const perKat: Record<string, number> = {};
  let total = 0;
  const seenDays = new Set<string>();

  for (const row of rows) {
    const d = parseDateOnly(row.date);
    if (d < monday || d > sunday) continue;
    const h = row.hoursWorked;
    const k = categoryBase(row.category) || 'Övrigt';
    perKat[k] = (perKat[k] ?? 0) + h;
    total += h;
    seenDays.add(row.date);
  }

  const perKatList = Object.entries(perKat)
    .map(([kat, timmar]) => ({ kat, timmar: Math.round(timmar * 10) / 10 }))
    .sort((a, b) => b.timmar - a.timmar);

  return {
    total: Math.round(total * 10) / 10,
    dagar: seenDays.size,
    vecka: getWeekNumber(),
    perKat: perKatList,
  };
}

/** Veckokalender: varje dag med timmar och antal pass. */
export async function getWeekTimeCalendar(userId: string) {
  const dagar = emptyWeekCalendar();
  const rows = await getAllTimeEntries(userId);
  const monday = getMonday();
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);

  for (const row of rows) {
    const d = parseDateOnly(row.date);
    if (d < monday || d > sunday) continue;
    const slot = dagar.find((x) => x.datum === row.date);
    if (!slot) continue;
    slot.timmar += row.hoursWorked;
    slot.pass += 1;
  }

  for (const d of dagar) {
    d.timmar = Math.round(d.timmar * 10) / 10;
  }

  return { dagar, vecka: getWeekNumber() };
}

/** Detaljerad flextidsanalys för veckan. */
export async function getWeekFlexDetail(
  userId: string,
  referenceDate = new Date(),
): Promise<WeekFlexDetail> {
  const rows = await getAllTimeEntries(userId);
  return computeWeekFlexDetail(rows.map(toTimeEntryLike), referenceDate);
}

/**
 * @deprecated flexTarget ignoreras — veckomål från payTimeRules (jämn/ojämn ISO-vecka).
 * Använd getWeekFlexDetail istället.
 */
export async function getFlexHoursRemaining(userId: string, _flexTarget?: number) {
  const detail = await getWeekFlexDetail(userId);
  return detail.flexLeft;
}

/**
 * Hämtar alla tidsposter för en användare (utan filtrering).
 * Exponeras för ekonomisilon om den behöver beräkna flex som del av en ekonomiöversikt —
 * detta är den enda tillåtna gränspunkten från economyFirestore till arbetslivFirestore.
 */
export async function getAllTimeEntriesForEconomyReadOnly(userId: string): Promise<TimeEntryRow[]> {
  return getAllTimeEntries(userId);
}
