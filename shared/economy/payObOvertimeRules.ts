/**
 * OB / övertid — max(OB, OT) per pass (minutsegmentering v1).
 */
import { parseClockOnDate } from './timeMath';
import type { PayProfileContext } from './payProfileContext';
import type { TimeEntryLike } from './payTimeRules';
import { PayslipLineType, type PayslipLineItem } from './payFkBenefits';

const OB_EVENING_RATE = 0.32;
const OB_NIGHT_RATE = 0.48;
const OT_RATE = 0.5;
const STANDARD_DAY_HOURS = 8;

type MinuteSegment = {
  minuteOfDay: number;
  isWeekend: boolean;
};

function isWeekend(dateStr: string): boolean {
  const d = new Date(`${dateStr}T12:00:00`);
  const day = d.getDay();
  return day === 0 || day === 6;
}

function obRateForMinute(seg: MinuteSegment): number {
  if (seg.isWeekend) return OB_EVENING_RATE;
  const hour = Math.floor(seg.minuteOfDay / 60);
  if (hour < 6 || hour >= 22) return OB_NIGHT_RATE;
  if (hour >= 18) return OB_EVENING_RATE;
  return 0;
}

function buildSegments(date: string, clockIn: string, clockOut: string): MinuteSegment[] {
  const start = parseClockOnDate(date, clockIn);
  const end = parseClockOnDate(date, clockOut);
  const weekend = isWeekend(date);
  const segs: MinuteSegment[] = [];
  for (let t = start.getTime(); t < end.getTime(); t += 60_000) {
    const d = new Date(t);
    segs.push({ minuteOfDay: d.getHours() * 60 + d.getMinutes(), isWeekend: weekend });
  }
  return segs;
}

/** max(OB, OT) per pass — returnerar vinnande tillägg. */
export function computeObOvertimeForEntry(
  profile: PayProfileContext,
  entry: TimeEntryLike,
): { obSek: number; otSek: number } {
  if (!entry.clockOut || entry.hoursWorked <= 0) return { obSek: 0, otSek: 0 };
  if (entry.category !== 'Arbete' && !entry.category.startsWith('Arbete')) {
    return { obSek: 0, otSek: 0 };
  }

  const hourly = profile.hourlyRateSek;
  const segments = buildSegments(entry.date, entry.clockIn, entry.clockOut);
  let ob = 0;
  for (const seg of segments) {
    ob += (hourly * obRateForMinute(seg)) / 60;
  }
  ob = Math.round(ob * 100) / 100;

  const overtimeHours = Math.max(0, entry.hoursWorked - STANDARD_DAY_HOURS);
  const ot = Math.round(overtimeHours * hourly * OT_RATE * 100) / 100;

  if (ot > ob) return { obSek: 0, otSek: ot };
  return { obSek: ob, otSek: 0 };
}

export function computeObOvertimeSupplements(params: {
  profile: PayProfileContext;
  entries: TimeEntryLike[];
  periodFrom: string;
  periodTo: string;
}): { obSek: number; otSek: number; lineItems: PayslipLineItem[] } {
  let obSek = 0;
  let otSek = 0;

  for (const entry of params.entries) {
    if (entry.date < params.periodFrom || entry.date > params.periodTo) continue;
    const { obSek: o, otSek: t } = computeObOvertimeForEntry(params.profile, entry);
    obSek += o;
    otSek += t;
  }

  obSek = Math.round(obSek * 100) / 100;
  otSek = Math.round(otSek * 100) / 100;

  const lineItems: PayslipLineItem[] = [];
  if (obSek > 0) {
    lineItems.push({
      type: PayslipLineType.OB_SUPPLEMENT,
      incomeSource: 'employer',
      label: 'OB-tillägg',
      amountSek: obSek,
    });
  }
  if (otSek > 0) {
    lineItems.push({
      type: PayslipLineType.OT_SUPPLEMENT,
      incomeSource: 'employer',
      label: 'Övertid',
      amountSek: otSek,
    });
  }

  return { obSek, otSek, lineItems };
}
