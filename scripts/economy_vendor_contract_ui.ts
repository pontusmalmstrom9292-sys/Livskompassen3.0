/**
 * UI-side golden vectors for economy vendor contract (stdout JSON).
 * Run: npx tsx scripts/economy_vendor_contract_ui.ts
 */
import golden from '../shared/economy/__fixtures__/sheet-golden.json';
import {
  buildMonthlyPayslip,
  getPayslipPeriodForPayday,
} from '../shared/economy/generatePayslipCore';
import { BASE_SALARY_SEK } from '../shared/economy/livsmedel2026';
import { getTaxAmount } from '../shared/economy/taxTable32';
import {
  computeDayFlexDelta,
  computeHoursWorkedOnClockOut,
  computeWeekFlexSummary,
  getWeekFlexTarget,
  isEvenISOWeek,
  resolveBreakMinutesOnClockOut,
  type TimeEntryLike,
} from '../shared/economy/payTimeRules';

const PAYDAY = new Date(2026, 4, 16);

const period = getPayslipPeriodForPayday(PAYDAY);
const payslip = buildMonthlyPayslip({
  entries: [],
  period,
  monthlySalarySek: BASE_SALARY_SEK,
});

const even = golden.weekTargets.evenWeekExample;
const odd = golden.weekTargets.oddWeekExample;
const longBreak = golden.autoBreak.longShiftNoBreak;
const shortBreak = golden.autoBreak.shortShiftNoBreak;

const longHours = computeHoursWorkedOnClockOut({
  date: longBreak.date,
  clockIn: longBreak.clockIn,
  clockOut: longBreak.clockOut,
  breakMinutes: longBreak.breakMinutesIn,
  scopePercent: 100,
});

const shortHours = computeHoursWorkedOnClockOut({
  date: shortBreak.date,
  clockIn: shortBreak.clockIn,
  clockOut: shortBreak.clockOut,
  breakMinutes: shortBreak.breakMinutesIn,
  scopePercent: 100,
});

const flexRef = new Date('2026-05-19');
const flexArbete = computeWeekFlexSummary(
  golden.flexWeek.arbeteOnly as TimeEntryLike[],
  flexRef,
);

process.stdout.write(
  JSON.stringify({
    payslipPeriod: { from: period.from, to: period.to },
    payslipTaxSek: payslip.taxSek,
    payslipNetSek: payslip.netSalarySek,
    taxTable32Base: getTaxAmount(BASE_SALARY_SEK),
    evenWeek: {
      isEven: isEvenISOWeek(new Date(even.isoDate)),
      flexTarget: getWeekFlexTarget(new Date(even.isoDate)),
    },
    oddWeek: {
      isEven: isEvenISOWeek(new Date(odd.isoDate)),
      flexTarget: getWeekFlexTarget(new Date(odd.isoDate)),
    },
    longBreakMinutes: resolveBreakMinutesOnClockOut({
      date: longBreak.date,
      clockIn: longBreak.clockIn,
      clockOut: longBreak.clockOut,
      breakMinutes: longBreak.breakMinutesIn,
    }),
    longHoursWorked: longHours.hoursWorked,
    shortHoursWorked: shortHours.hoursWorked,
    flexWorkHours: flexArbete.workHoursWeek,
    dayFlexEight: computeDayFlexDelta(golden.dayFlex.arbeteEightHours.entry as TimeEntryLike),
  }),
);
