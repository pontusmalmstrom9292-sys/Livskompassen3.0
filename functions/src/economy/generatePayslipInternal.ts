/**
 * Lönespec — Firestore WORM payslip_snapshots (Admin SDK).
 */
import { admin } from '../lib/firebaseAdmin';
import {
  buildMonthlyPayslip,
  getPayslipPeriodForPayday,
  type PayslipResult,
} from './vendor/generatePayslipCore';
import type { TimeEntryLike } from './vendor/payTimeRules';

const COLLECTION = 'payslip_snapshots';
const TIME_ENTRIES = 'time_entries';
const ECONOMY_PROFILES = 'economy_profiles';

function mapTimeEntry(id: string, data: FirebaseFirestore.DocumentData): TimeEntryLike {
  const clockOutRaw = data.clockOut;
  const clockOut =
    clockOutRaw != null && String(clockOutRaw).trim() !== '' ? String(clockOutRaw) : null;
  return {
    date: String(data.date ?? ''),
    clockIn: String(data.clockIn ?? '00:00'),
    clockOut,
    category: String(data.category ?? 'Arbete'),
    breakMinutes: Number(data.breakMinutes ?? 30),
    scopePercent: Number(data.scopePercent ?? 100),
    hoursWorked: Number(data.hoursWorked ?? 0),
  };
}

async function loadTimeEntries(uid: string): Promise<TimeEntryLike[]> {
  const snap = await admin
    .firestore()
    .collection(TIME_ENTRIES)
    .where('ownerId', '==', uid)
    .get();
  return snap.docs.map((d) => mapTimeEntry(d.id, d.data()));
}

async function loadMonthlySalary(uid: string): Promise<number | undefined> {
  const prof = await admin.firestore().collection(ECONOMY_PROFILES).doc(uid).get();
  if (!prof.exists) return undefined;
  const v = Number(prof.data()?.monthlySalarySek ?? 0);
  return v > 0 ? v : undefined;
}

export type GeneratePayslipOptions = {
  referenceDate?: Date;
  period?: { from: string; to: string };
};

export async function generatePayslipInternal(
  uid: string,
  options: GeneratePayslipOptions = {},
): Promise<{ payslipId: string; result: PayslipResult }> {
  const referenceDate = options.referenceDate ?? new Date();
  const period = options.period
    ? {
        from: options.period.from,
        to: options.period.to,
        label: `${options.period.from} – ${options.period.to}`,
      }
    : getPayslipPeriodForPayday(referenceDate);

  const [entries, monthlySalarySek] = await Promise.all([
    loadTimeEntries(uid),
    loadMonthlySalary(uid),
  ]);

  const result = buildMonthlyPayslip({
    entries,
    period,
    monthlySalarySek,
    referenceDate,
  });

  const payslipId = `${uid}_${period.from}_${period.to}`;
  const ref = admin.firestore().collection(COLLECTION).doc(payslipId);

  const existing = await ref.get();
  if (existing.exists) {
    console.log(`[generatePayslip] Snapshot finns redan: ${payslipId}`);
    return { payslipId, result };
  }

  await ref.set({
    ownerId: uid,
    userId: uid,
    payslipId,
    periodFrom: period.from,
    periodTo: period.to,
    periodLabel: period.label,
    baseSalarySek: result.baseSalarySek,
    grossBeforeDeductionsSek: result.grossBeforeDeductionsSek,
    absenceDeductionSek: result.absenceDeductionSek,
    taxableGrossSek: result.taxableGrossSek,
    taxSek: result.taxSek,
    netSalarySek: result.netSalarySek,
    expectedIncomeAdjustmentSek: result.expectedIncomeAdjustmentSek,
    hourlyRateSek: result.hourlyRateSek,
    pbb2026Sek: result.pbb2026Sek,
    karensDaysLast365: result.karensDaysLast365,
    karensWaived: result.karensWaived,
    absenceLines: result.absenceLines,
    taxTable: 32,
    taxColumn: 1,
    isLocked: true,
    status: 'ready',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(
    `[generatePayslip] uid=${uid} period=${period.label} net=${result.netSalarySek} tax=${result.taxSek}`,
  );

  return { payslipId, result };
}

/** Schemalagd körning: alla economy_profiles. */
export async function generatePayslipsForAllProfiles(referenceDate = new Date()): Promise<number> {
  const snap = await admin.firestore().collection(ECONOMY_PROFILES).get();
  let count = 0;
  for (const doc of snap.docs) {
    const uid = doc.id;
    if (doc.data()?.ownerId && doc.data().ownerId !== uid) continue;
    try {
      await generatePayslipInternal(uid, { referenceDate });
      count += 1;
    } catch (err) {
      console.error(`[generatePayslip] uid=${uid} fel:`, err);
    }
  }
  if (count === 0) {
    const envUid = process.env.PAYSLIP_DEFAULT_UID;
    if (envUid) {
      await generatePayslipInternal(envUid, { referenceDate });
      count = 1;
    }
  }
  return count;
}
