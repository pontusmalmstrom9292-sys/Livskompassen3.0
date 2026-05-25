import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type {
  BudgetSavingsRow,
  EconomyFixedBillRow,
  EconomyLedgerRow,
  EconomyLedgerType,
  PayslipSnapshotRow,
  TimeEntryRow,
} from '../types/firestore';
import {
  computeHoursWorkedOnClockOut,
  computeWeekFlexDetail,
} from '../../ekonomi/rules/payTimeRules';
import {
  computePeriodEconomySummary,
  type PeriodEconomySummary,
} from '../../ekonomi/rules/periodSummary';
import { getPayslipPeriodForPayday } from '../../ekonomi/rules/generatePayslipCore';
import type { TimeEntryLike, WeekFlexDetail } from '../../ekonomi/rules/payTimeRules';
import {
  buildCategoryName,
  categoryBase,
  DEFAULT_BREAK_MINUTES,
  DEFAULT_HELDAG,
  DEFAULT_SCOPE_PERCENT,
  eachDateInclusive,
  emptyWeekCalendar,
  formatDateLocal,
  formatTimeLocal,
  getMonday,
  getWeekNumber,
  normalizeClock,
  parseDateOnly,
} from '../utils/timeMath';

export type { WeekFlexDetail, PeriodEconomySummary };

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

async function getAllTimeEntries(userId: string): Promise<TimeEntryRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.time_entries);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs
    .map((d) => mapTimeEntry(d.id, d.data() as FirestorePayload, userId))
    .sort((a, b) => `${b.date}${b.clockIn}`.localeCompare(`${a.date}${a.clockIn}`));
}

export async function recordTimeIn(userId: string, category = 'Arbete') {
  const open = await getOpenTimeEntry(userId);
  if (open) throw new Error('Du är redan instämplad.');

  const profile = await getEconomyProfileExtended(userId);
  const breakMinutes = profile.defaultBreakMinutes ?? DEFAULT_BREAK_MINUTES;

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

export async function recordTimeOut(userId: string, entryId?: string) {
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

export async function getOpenTimeEntry(userId: string): Promise<TimeEntryRow | null> {
  const rows = await getAllTimeEntries(userId);
  return rows.find((r) => r.clockOut == null) ?? null;
}

/** Stänger öppna pass utan clockOut (äldre data med isOpen:false). */
export async function repairOpenTimeEntryFlags(userId: string): Promise<number> {
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

export async function deleteTimeEntry(userId: string, entryId: string) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.time_entries, entryId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Pass hittades inte.');
  await deleteDoc(ref);
}

export async function getRecentTimeEntries(userId: string, limit = 50): Promise<TimeEntryRow[]> {
  const rows = await getAllTimeEntries(userId);
  return rows.slice(-limit).reverse();
}

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

export async function getWeekFlexDetail(
  userId: string,
  referenceDate = new Date(),
): Promise<WeekFlexDetail> {
  const rows = await getAllTimeEntries(userId);
  return computeWeekFlexDetail(rows.map(toTimeEntryLike), referenceDate);
}

/** @deprecated flexTarget ignoreras — veckomål från payTimeRules (jämn/ojämn ISO-vecka). */
export async function getFlexHoursRemaining(userId: string, _flexTarget?: number) {
  const detail = await getWeekFlexDetail(userId);
  return detail.flexLeft;
}

// ─── Economy profile (extended) ─────────────────────────────────────────────

export async function getEconomyProfileExtended(userId: string) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return {
      weeklyBudgetSek: 500,
      mealBoxPresetSek: 85,
      monthlySalarySek: 0,
      hourlyRateSek: 0,
      flexHoursTarget: 40,
      defaultBreakMinutes: DEFAULT_BREAK_MINUTES,
    };
  }
  const data = snap.data();
  return {
    weeklyBudgetSek: Number(data.weeklyBudgetSek ?? 500),
    mealBoxPresetSek: Number(data.mealBoxPresetSek ?? 85),
    monthlySalarySek: Number(data.monthlySalarySek ?? 0),
    hourlyRateSek: Number(data.hourlyRateSek ?? 0),
    flexHoursTarget: Number(data.flexHoursTarget ?? 40),
    defaultBreakMinutes: Number(data.defaultBreakMinutes ?? DEFAULT_BREAK_MINUTES),
  };
}

export async function setEconomyProfileExtended(
  userId: string,
  profile: {
    weeklyBudgetSek?: number;
    mealBoxPresetSek?: number;
    monthlySalarySek?: number;
    hourlyRateSek?: number;
    flexHoursTarget?: number;
    defaultBreakMinutes?: number;
  },
) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

// ─── Economy ledger ─────────────────────────────────────────────────────────

function mapLedger(id: string, data: FirestorePayload, userId: string): EconomyLedgerRow {
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    date: String(data.date ?? ''),
    category: String(data.category ?? ''),
    description: String(data.description ?? ''),
    amountSek: Number(data.amountSek ?? 0),
    type: (data.type as EconomyLedgerType) ?? 'utgift',
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: data.updatedAt ? normalizeCreatedAt(data.updatedAt) : undefined,
  };
}

export async function addEconomyLedgerEntry(
  userId: string,
  entry: {
    date: string;
    category: string;
    description: string;
    amountSek: number;
    type: EconomyLedgerType;
  },
) {
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_ledger);
  const docRef = await addDoc(ref, withUserId(userId, entry));
  return docRef.id;
}

export async function deleteEconomyLedgerEntry(userId: string, entryId: string) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_ledger, entryId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Rad hittades inte.');
  await deleteDoc(ref);
}

export async function getEconomyLedgerEntries(userId: string, limit = 100): Promise<EconomyLedgerRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_ledger);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs
    .map((d) => mapLedger(d.id, d.data() as FirestorePayload, userId))
    .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))
    .slice(0, limit);
}

export async function getMonthEconomySummary(userId: string) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const rows = await getEconomyLedgerEntries(userId, 500);
  let inkomster = 0;
  let utgifter = 0;
  let antal = 0;

  for (const row of rows) {
    const d = parseDateOnly(row.date);
    if (d.getMonth() !== month || d.getFullYear() !== year) continue;
    antal += 1;
    if (row.type === 'inkomst') inkomster += row.amountSek;
    else utgifter += row.amountSek;
  }

  const manader = [
    'januari', 'februari', 'mars', 'april', 'maj', 'juni',
    'juli', 'augusti', 'september', 'oktober', 'november', 'december',
  ];

  return {
    manad: manader[month],
    inkomster: Math.round(inkomster),
    utgifter: Math.round(utgifter),
    netto: Math.round(inkomster - utgifter),
    antal,
  };
}

export async function getPeriodEconomySummary(
  userId: string,
  period?: { from: string; to: string },
): Promise<PeriodEconomySummary> {
  const [profile, bills, ledger] = await Promise.all([
    getEconomyProfileExtended(userId),
    getEconomyFixedBills(userId),
    getEconomyLedgerEntries(userId, 500),
  ]);

  const payslipPeriod = period
    ? {
        from: period.from,
        to: period.to,
        label: `${period.from} – ${period.to}`,
      }
    : getPayslipPeriodForPayday();

  return computePeriodEconomySummary({
    period: payslipPeriod,
    monthlySalarySek: profile.monthlySalarySek || 0,
    fixedBillsSumSek: bills.reduce((s, b) => s + b.amountSek, 0),
    ledgerRows: ledger.map((r) => ({
      date: r.date,
      category: r.category,
      amountSek: r.amountSek,
      type: r.type,
    })),
  });
}

export async function getEconomyOverview(userId: string) {
  const [profile, bills, ledger] = await Promise.all([
    getEconomyProfileExtended(userId),
    getEconomyFixedBills(userId),
    getEconomyLedgerEntries(userId, 500),
  ]);

  const fastaSumma = bills.reduce((s, b) => s + b.amountSek, 0);
  let appUtgifter = 0;
  let appInkomster = 0;
  let rorliga = 0;

  for (const row of ledger) {
    if (row.type === 'inkomst') appInkomster += row.amountSek;
    else {
      appUtgifter += row.amountSek;
      if (row.category.toLowerCase().includes('rörl') || row.category === 'Rörliga') {
        rorliga += row.amountSek;
      }
    }
  }

  const lon = profile.monthlySalarySek;
  const saldo = Math.round(lon - fastaSumma - appUtgifter + appInkomster);

  const flexDetail = computeWeekFlexDetail(
    (await getAllTimeEntries(userId)).map(toTimeEntryLike),
  );

  return {
    lon,
    fastaSumma: Math.round(fastaSumma),
    saldo,
    appUtgifter: Math.round(appUtgifter),
    appInkomster: Math.round(appInkomster),
    rorligaUtgifter: Math.round(rorliga),
    flex: flexDetail.flexLeft,
    flexTarget: flexDetail.flexTarget,
    weekTypeLabel: flexDetail.weekTypeLabel,
    vecka: getWeekNumber(),
  };
}

// ─── Fixed bills ────────────────────────────────────────────────────────────

function mapFixedBill(id: string, data: FirestorePayload, userId: string): EconomyFixedBillRow {
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    name: String(data.name ?? ''),
    amountSek: Number(data.amountSek ?? 0),
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: data.updatedAt ? normalizeCreatedAt(data.updatedAt) : undefined,
  };
}

export async function getEconomyFixedBills(userId: string): Promise<EconomyFixedBillRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_fixed_bills);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs.map((d) => mapFixedBill(d.id, d.data() as FirestorePayload, userId));
}

export async function setEconomyFixedBill(
  userId: string,
  bill: { id?: string; name: string; amountSek: number },
) {
  if (bill.id) {
    const ref = doc(db, FIRESTORE_COLLECTIONS.economy_fixed_bills, bill.id);
    await updateDoc(ref, {
      name: bill.name,
      amountSek: bill.amountSek,
      updatedAt: serverTimestamp(),
    });
    return bill.id;
  }
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_fixed_bills);
  const docRef = await addDoc(ref, withUserId(userId, { name: bill.name, amountSek: bill.amountSek }));
  return docRef.id;
}

export async function deleteEconomyFixedBill(userId: string, billId: string) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_fixed_bills, billId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Rad hittades inte.');
  await deleteDoc(ref);
}

// ─── Budget savings ─────────────────────────────────────────────────────────

function mapSavings(id: string, data: FirestorePayload, userId: string): BudgetSavingsRow {
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    title: String(data.title ?? ''),
    targetSek: Number(data.targetSek ?? 0),
    currentSek: Number(data.currentSek ?? 0),
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: data.updatedAt ? normalizeCreatedAt(data.updatedAt) : undefined,
  };
}

export async function getBudgetSavings(userId: string): Promise<BudgetSavingsRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.budget_savings);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs.map((d) => mapSavings(d.id, d.data() as FirestorePayload, userId));
}

export async function setBudgetSaving(
  userId: string,
  goal: { id?: string; title: string; targetSek: number; currentSek: number },
) {
  if (goal.id) {
    const ref = doc(db, FIRESTORE_COLLECTIONS.budget_savings, goal.id);
    await updateDoc(ref, {
      title: goal.title,
      targetSek: goal.targetSek,
      currentSek: goal.currentSek,
      updatedAt: serverTimestamp(),
    });
    return goal.id;
  }
  const ref = collection(db, FIRESTORE_COLLECTIONS.budget_savings);
  const docRef = await addDoc(
    ref,
    withUserId(userId, {
      title: goal.title,
      targetSek: goal.targetSek,
      currentSek: goal.currentSek,
    }),
  );
  return docRef.id;
}

export async function deleteBudgetSaving(userId: string, goalId: string) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.budget_savings, goalId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Sparmål hittades inte.');
  await deleteDoc(ref);
}

// ─── Payslip snapshots (WORM — läs via klient, skriv via generatePayslip) ───

function mapPayslipSnapshot(id: string, data: FirestorePayload, userId: string): PayslipSnapshotRow {
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    payslipId: String(data.payslipId ?? id),
    periodFrom: String(data.periodFrom ?? ''),
    periodTo: String(data.periodTo ?? ''),
    periodLabel: String(data.periodLabel ?? ''),
    baseSalarySek: Number(data.baseSalarySek ?? 0),
    grossBeforeDeductionsSek: Number(data.grossBeforeDeductionsSek ?? 0),
    absenceDeductionSek: Number(data.absenceDeductionSek ?? 0),
    taxableGrossSek: Number(data.taxableGrossSek ?? 0),
    taxSek: Number(data.taxSek ?? 0),
    netSalarySek: Number(data.netSalarySek ?? 0),
    expectedIncomeAdjustmentSek: Number(data.expectedIncomeAdjustmentSek ?? 0),
    hourlyRateSek: Number(data.hourlyRateSek ?? 0),
    pbb2026Sek: Number(data.pbb2026Sek ?? 0),
    karensDaysLast365: Number(data.karensDaysLast365 ?? 0),
    karensWaived: Boolean(data.karensWaived),
    absenceLines: Array.isArray(data.absenceLines) ? (data.absenceLines as PayslipSnapshotRow['absenceLines']) : [],
    taxTable: Number(data.taxTable ?? 32),
    taxColumn: Number(data.taxColumn ?? 1),
    isLocked: Boolean(data.isLocked),
    status: String(data.status ?? 'ready'),
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

export async function getLatestPayslipSnapshot(userId: string): Promise<PayslipSnapshotRow | null> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.payslip_snapshots);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  if (snap.empty) return null;
  const rows = snap.docs
    .map((d) => mapPayslipSnapshot(d.id, d.data() as FirestorePayload, userId))
    .sort((a, b) => b.periodTo.localeCompare(a.periodTo));
  return rows[0] ?? null;
}
