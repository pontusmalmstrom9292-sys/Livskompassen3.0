"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayslipPeriodForPayday = getPayslipPeriodForPayday;
exports.filterEntriesInPeriod = filterEntriesInPeriod;
exports.buildMonthlyPayslip = buildMonthlyPayslip;
/**
 * Lönespec — ren beräkning (ingen Firestore). Fas 2.
 */
const timeMath_1 = require("./timeMath");
const payAbsenceRules_1 = require("./payAbsenceRules");
const livsmedel2026_1 = require("./livsmedel2026");
const taxTable32_1 = require("./taxTable32");
/** Löneperiod: föregående månad 16 → innevarande månad 15 (körs 16:e). */
function getPayslipPeriodForPayday(referenceDate = new Date()) {
    const y = referenceDate.getFullYear();
    const m = referenceDate.getMonth();
    const from = new Date(y, m - 1, 16, 12, 0, 0);
    const to = new Date(y, m, 15, 12, 0, 0);
    const fromStr = (0, timeMath_1.formatDateLocal)(from);
    const toStr = (0, timeMath_1.formatDateLocal)(to);
    return {
        from: fromStr,
        to: toStr,
        label: `${fromStr} – ${toStr}`,
    };
}
function filterEntriesInPeriod(entries, from, to) {
    const start = (0, timeMath_1.parseDateOnly)(from);
    const end = (0, timeMath_1.parseDateOnly)(to);
    return entries.filter((e) => {
        const d = (0, timeMath_1.parseDateOnly)(e.date);
        return d >= start && d <= end;
    });
}
function buildMonthlyPayslip(params) {
    const referenceDate = params.referenceDate ?? new Date();
    const baseSalarySek = params.monthlySalarySek ?? livsmedel2026_1.BASE_SALARY_SEK;
    const absence = (0, payAbsenceRules_1.computeAbsenceAdjustments)(params.entries, params.period.from, params.period.to, referenceDate, livsmedel2026_1.HOURLY_RATE_SEK);
    const karensDays = (0, payAbsenceRules_1.countKarensDaysInLookback)(params.entries, referenceDate);
    const karensWaived = (0, payAbsenceRules_1.shouldWaiveKarens)(params.entries, referenceDate);
    const grossBeforeDeductionsSek = baseSalarySek;
    const taxableGrossSek = Math.max(0, Math.round((grossBeforeDeductionsSek - absence.totalDeductionSek) * 100) / 100);
    const taxSek = (0, taxTable32_1.getTaxAmount)(taxableGrossSek);
    const netSalarySek = Math.round((taxableGrossSek - taxSek) * 100) / 100;
    return {
        period: params.period,
        baseSalarySek,
        grossBeforeDeductionsSek,
        absenceDeductionSek: absence.totalDeductionSek,
        taxableGrossSek,
        taxSek,
        netSalarySek,
        expectedIncomeAdjustmentSek: absence.totalExpectedIncomeSek,
        hourlyRateSek: livsmedel2026_1.HOURLY_RATE_SEK,
        pbb2026Sek: livsmedel2026_1.PBB_2026_SEK,
        absenceLines: absence.lines,
        karensDaysLast365: karensDays,
        karensWaived,
    };
}
//# sourceMappingURL=generatePayslipCore.js.map