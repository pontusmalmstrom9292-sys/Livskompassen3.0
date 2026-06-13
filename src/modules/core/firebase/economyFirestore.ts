/**
 * economyFirestore.ts
 *
 * Domänägt Firestore-lager för Ekonomi-silon.
 * Ansvarar strikt för: transaktioner (ledger), budget-kuvert, sparande,
 * lönespecifikationer (WORM), impulskö och måltidsförberedelser.
 *
 * ❌ Importera INTE tidspassfunktioner härifrån. (Enda undantag: getEconomyOverview
 *    kallar getAllTimeEntriesForEconomyReadOnly från arbetslivFirestore — en godkänd
 *    läs-gränspunkt, ej en skrivkoppling.)
 * ✅ Konsumeras av: features/dailyLife/wellbeing/economy
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
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type {
  BudgetEnvelopeRow,
  BudgetSavingsRow,
  EconomyFixedBillRow,
  EconomyImpulseRow,
  EconomyLedgerRow,
  EconomyLedgerType,
  EconomyMealPrepItem,
  PayslipSnapshotRow,
} from '../types/firestore';
import {
  computeWeekFlexDetail,
} from '@/features/dailyLife/wellbeing/economy/rules/payTimeRules';
import type { TimeEntryLike } from '@/features/dailyLife/wellbeing/economy/rules/payTimeRules';
import {
  computePeriodEconomySummary,
  type PeriodEconomySummary,
} from '@/features/dailyLife/wellbeing/economy/rules/periodSummary';
import { getPayslipPeriodForPayday } from '@/features/dailyLife/wellbeing/economy/rules/generatePayslipCore';
import { getWeekNumber, parseDateOnly } from '../utils/timeMath';
import { getAllTimeEntriesForEconomyReadOnly } from './arbetslivFirestore';

// ─── Re-exportera typer ───────────────────────────────────────────────────────
export type { PeriodEconomySummary };

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

// ─── Internt: toTimeEntryLike-adapter (för getEconomyOverview) ──────────────

function toTimeEntryLike(row: {
  date: string;
  clockIn: string;
  clockOut?: string | null;
  category: string;
  breakMinutes: number;
  scopePercent: number;
  hoursWorked: number;
}): TimeEntryLike {
  return {
    date: row.date,
    clockIn: row.clockIn,
    clockOut: row.clockOut ?? null,
    category: row.category,
    breakMinutes: row.breakMinutes,
    scopePercent: row.scopePercent,
    hoursWorked: row.hoursWorked,
  };
}

// ─── Economy Profile ─────────────────────────────────────────────────────────

/** Hämtar (eller returnerar default) den utökade ekonomiprofilen. */
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
      defaultBreakMinutes: 30,
    };
  }
  const data = snap.data();
  return {
    weeklyBudgetSek: Number(data.weeklyBudgetSek ?? 500),
    mealBoxPresetSek: Number(data.mealBoxPresetSek ?? 85),
    monthlySalarySek: Number(data.monthlySalarySek ?? 0),
    hourlyRateSek: Number(data.hourlyRateSek ?? 0),
    flexHoursTarget: Number(data.flexHoursTarget ?? 40),
    defaultBreakMinutes: Number(data.defaultBreakMinutes ?? 30),
  };
}

/** Sparar (merge) den utökade ekonomiprofilen. */
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
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_profiles);
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

// ─── Economy Ledger (transaktionslogg) ───────────────────────────────────────

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

/** Lägger till en ny ledger-transaktion. */
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
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_ledger);
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_ledger);
  const docRef = await addDoc(ref, withUserId(userId, entry));
  return docRef.id;
}

/** Raderar en ledger-transaktion (ägarverifiering). */
export async function deleteEconomyLedgerEntry(userId: string, entryId: string) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_ledger);
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_ledger, entryId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Rad hittades inte.');
  await deleteDoc(ref);
}

/** Hämtar ledger-transaktioner, nyast först. */
export async function getEconomyLedgerEntries(userId: string, limit = 100): Promise<EconomyLedgerRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_ledger);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs
    .map((d) => mapLedger(d.id, d.data() as FirestorePayload, userId))
    .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))
    .slice(0, limit);
}

/** Inkomst/utgift-summering för innevarande månad. */
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

/** Löneperiodsummering (inkomst, fasta utgifter, flex). */
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

/**
 * Ekonomiöversikt: lön, fasta kostnader, saldo, rörliga kostnader och flex.
 * Hämtar tidsposter via den godkända läsgränsen från arbetslivFirestore.
 */
export async function getEconomyOverview(userId: string) {
  const [profile, bills, ledger, timeRows] = await Promise.all([
    getEconomyProfileExtended(userId),
    getEconomyFixedBills(userId),
    getEconomyLedgerEntries(userId, 500),
    getAllTimeEntriesForEconomyReadOnly(userId),
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

  const flexDetail = computeWeekFlexDetail(timeRows.map(toTimeEntryLike));

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

// ─── Fixed bills (fasta utgifter) ────────────────────────────────────────────

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

/** Hämtar alla fasta utgifter. */
export async function getEconomyFixedBills(userId: string): Promise<EconomyFixedBillRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_fixed_bills);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs.map((d) => mapFixedBill(d.id, d.data() as FirestorePayload, userId));
}

/** Skapar eller uppdaterar en fast utgift. */
export async function setEconomyFixedBill(
  userId: string,
  bill: { id?: string; name: string; amountSek: number },
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_fixed_bills);
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

/** Raderar en fast utgift (ägarverifiering). */
export async function deleteEconomyFixedBill(userId: string, billId: string) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_fixed_bills);
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_fixed_bills, billId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Rad hittades inte.');
  await deleteDoc(ref);
}

// ─── Budget Savings (sparmål) ────────────────────────────────────────────────

function mapSavings(id: string, data: FirestorePayload, userId: string): BudgetSavingsRow {
  const tagRaw = data.tag;
  const tag =
    tagRaw === 'family' || tagRaw === 'general' ? tagRaw : undefined;
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    title: String(data.title ?? ''),
    targetSek: Number(data.targetSek ?? 0),
    currentSek: Number(data.currentSek ?? 0),
    tag,
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: data.updatedAt ? normalizeCreatedAt(data.updatedAt) : undefined,
  };
}

/** Hämtar alla sparmål. */
export async function getBudgetSavings(userId: string): Promise<BudgetSavingsRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.budget_savings);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs.map((d) => mapSavings(d.id, d.data() as FirestorePayload, userId));
}

/** Skapar eller uppdaterar ett sparmål. */
export async function setBudgetSaving(
  userId: string,
  goal: {
    id?: string;
    title: string;
    targetSek: number;
    currentSek: number;
    tag?: 'family' | 'general';
  },
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.budget_savings);
  const payload: FirestorePayload = {
    title: goal.title,
    targetSek: goal.targetSek,
    currentSek: goal.currentSek,
    updatedAt: serverTimestamp(),
  };
  if (goal.tag) payload.tag = goal.tag;
  if (goal.id) {
    const ref = doc(db, FIRESTORE_COLLECTIONS.budget_savings, goal.id);
    await updateDoc(ref, payload);
    return goal.id;
  }
  const ref = collection(db, FIRESTORE_COLLECTIONS.budget_savings);
  const docRef = await addDoc(
    ref,
    withUserId(userId, {
      title: goal.title,
      targetSek: goal.targetSek,
      currentSek: goal.currentSek,
      ...(goal.tag ? { tag: goal.tag } : {}),
    }),
  );
  return docRef.id;
}

/** Raderar ett sparmål (ägarverifiering). */
export async function deleteBudgetSaving(userId: string, goalId: string) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.budget_savings);
  const ref = doc(db, FIRESTORE_COLLECTIONS.budget_savings, goalId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Sparmål hittades inte.');
  await deleteDoc(ref);
}

// ─── Payslip snapshots (WORM — läs via klient, skriv via generatePayslip) ────

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

/** Hämtar den senaste låsta lönespecifikationen (WORM-läsning). */
export async function getLatestPayslipSnapshot(userId: string): Promise<PayslipSnapshotRow | null> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.payslip_snapshots);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  if (snap.empty) return null;
  const rows = snap.docs
    .map((d) => mapPayslipSnapshot(d.id, d.data() as FirestorePayload, userId))
    .sort((a, b) => b.periodTo.localeCompare(a.periodTo));
  return rows[0] ?? null;
}

// ─── Impulse Parking (24h-regeln) ────────────────────────────────────────────

function mapImpulse(id: string, data: FirestorePayload, userId: string): EconomyImpulseRow {
  const statusRaw = data.status;
  const status =
    statusRaw === 'bought' || statusRaw === 'skipped' ? statusRaw : 'parked';
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    label: String(data.label ?? ''),
    parkedAt: normalizeCreatedAt(data.parkedAt ?? data.createdAt),
    remindAt: normalizeCreatedAt(data.remindAt),
    status,
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: data.updatedAt ? normalizeCreatedAt(data.updatedAt) : undefined,
  };
}

/** Hämtar alla parkerade impulsinköp. */
export async function getEconomyImpulseQueue(userId: string): Promise<EconomyImpulseRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_impulse_queue);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs
    .map((d) => mapImpulse(d.id, d.data() as FirestorePayload, userId))
    .filter((row) => row.status === 'parked')
    .sort((a, b) => b.parkedAt.localeCompare(a.parkedAt));
}

/** Parkerar ett potentiellt impulsinköp med 24h påminnelse. */
export async function parkEconomyImpulse(userId: string, label: string) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_impulse_queue);
  const now = new Date();
  const remind = new Date(now);
  remind.setDate(remind.getDate() + 1);
  const ref = collection(db, FIRESTORE_COLLECTIONS.economy_impulse_queue);
  const docRef = await addDoc(
    ref,
    withUserId(userId, {
      label: label.trim(),
      parkedAt: now.toISOString(),
      remindAt: remind.toISOString(),
      status: 'parked',
    }),
  );
  return docRef.id;
}

/** Markerar ett impulsinköp som köpt eller hoppat. */
export async function resolveEconomyImpulse(
  userId: string,
  impulseId: string,
  status: 'bought' | 'skipped',
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_impulse_queue);
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_impulse_queue, impulseId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Parkering hittades inte.');
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
}

/** Raderar ett impulsinköp permanent. */
export async function deleteEconomyImpulse(userId: string, impulseId: string) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_impulse_queue);
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_impulse_queue, impulseId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Parkering hittades inte.');
  await deleteDoc(ref);
}

// ─── Neuro-Kost meal prep (economy_profiles) ─────────────────────────────────

const DEFAULT_MEAL_PREP: EconomyMealPrepItem[] = [
  { id: '1', text: 'Ugnsrostad kyckling (Dopamin-prekursor)', done: false },
  { id: '2', text: 'Kokt broccoli & spenat (Anti-inflammatoriskt)', done: false },
  { id: '3', text: 'Matlådor portionerade i kyl/frys', done: false },
];

/** Hämtar (eller returnerar default) matlådelistan. */
export async function getEconomyMealPrep(userId: string): Promise<EconomyMealPrepItem[]> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return DEFAULT_MEAL_PREP.map((item) => ({ ...item }));
  const raw = snap.data().mealPrepItems;
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_MEAL_PREP.map((item) => ({ ...item }));
  }
  return raw.map((item, index) => {
    const row = item as FirestorePayload;
    return {
      id: String(row.id ?? String(index + 1)),
      text: String(row.text ?? ''),
      done: Boolean(row.done),
    };
  });
}

/** Sparar matlådelistan. */
export async function setEconomyMealPrep(userId: string, items: EconomyMealPrepItem[]) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.economy_profiles);
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      mealPrepItems: items,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

// ─── Budget envelopes (kuvert) ───────────────────────────────────────────────

function mapBudgetEnvelope(id: string, data: FirestorePayload, userId: string): BudgetEnvelopeRow {
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    title: String(data.title ?? ''),
    allocatedSek: Number(data.allocatedSek ?? 0),
    spentSek: Number(data.spentSek ?? 0),
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: data.updatedAt ? normalizeCreatedAt(data.updatedAt) : undefined,
  };
}

/** Hämtar alla budgetkuvert. */
export async function getBudgetEnvelopes(userId: string): Promise<BudgetEnvelopeRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.budgets);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return snap.docs.map((d) => mapBudgetEnvelope(d.id, d.data() as FirestorePayload, userId));
}

/** Skapar eller uppdaterar ett budgetkuvert. */
export async function setBudgetEnvelope(
  userId: string,
  envelope: {
    id?: string;
    title: string;
    allocatedSek: number;
    spentSek: number;
  },
) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.budgets);
  if (envelope.id) {
    const ref = doc(db, FIRESTORE_COLLECTIONS.budgets, envelope.id);
    await updateDoc(ref, {
      title: envelope.title,
      allocatedSek: envelope.allocatedSek,
      spentSek: envelope.spentSek,
      updatedAt: serverTimestamp(),
    });
    return envelope.id;
  }
  const ref = collection(db, FIRESTORE_COLLECTIONS.budgets);
  const docRef = await addDoc(
    ref,
    withUserId(userId, {
      title: envelope.title,
      allocatedSek: envelope.allocatedSek,
      spentSek: envelope.spentSek,
    }),
  );
  return docRef.id;
}

/** Raderar ett budgetkuvert (ägarverifiering). */
export async function deleteBudgetEnvelope(userId: string, envelopeId: string) {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.budgets);
  const ref = doc(db, FIRESTORE_COLLECTIONS.budgets, envelopeId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerId !== userId) throw new Error('Kuvert hittades inte.');
  await deleteDoc(ref);
}
