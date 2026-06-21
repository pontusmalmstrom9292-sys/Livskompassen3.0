"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupSickEpisodes = groupSickEpisodes;
exports.countKarensDaysInLookback = countKarensDaysInLookback;
exports.shouldWaiveKarens = shouldWaiveKarens;
exports.computeAbsenceAdjustments = computeAbsenceAdjustments;
/**
 * Frånvaro — sjuk, VAB, karens (365 dagar). Port PontusArbetsapp Fas 2.
 */
const timeMath_1 = require("./timeMath");
const livsmedel2026_1 = require("./livsmedel2026");
function isSjukCategory(cat) {
    const base = (0, timeMath_1.categoryBase)(cat);
    return base === 'Sjuk' || base === 'Sjuk dag 15+';
}
function isVabCategory(cat) {
    return (0, timeMath_1.categoryBase)(cat) === 'VAB';
}
function isSjukDay15Plus(cat) {
    return (0, timeMath_1.categoryBase)(cat) === 'Sjuk dag 15+';
}
/** Konsekutiva sjukdagar grupperade till episoder. */
function groupSickEpisodes(dates) {
    const sorted = [...new Set(dates)].sort();
    const episodes = [];
    let current = [];
    for (const d of sorted) {
        if (current.length === 0) {
            current.push(d);
            continue;
        }
        const prev = (0, timeMath_1.parseDateOnly)(current[current.length - 1]);
        const curr = (0, timeMath_1.parseDateOnly)(d);
        const nextDay = new Date(prev);
        nextDay.setDate(nextDay.getDate() + 1);
        if (curr.getTime() === nextDay.getTime()) {
            current.push(d);
        }
        else {
            episodes.push(current);
            current = [d];
        }
    }
    if (current.length)
        episodes.push(current);
    return episodes;
}
/** Antal karensdagar (första dagen per sjukepisod) inom lookback. */
function countKarensDaysInLookback(entries, referenceDate = new Date()) {
    const cutoff = new Date(referenceDate);
    cutoff.setDate(cutoff.getDate() - livsmedel2026_1.SICK_LOOKBACK_DAYS);
    const sickDates = entries
        .filter((e) => isSjukCategory(e.category) && !isSjukDay15Plus(e.category))
        .map((e) => e.date)
        .filter((d) => (0, timeMath_1.parseDateOnly)(d) >= cutoff);
    const episodes = groupSickEpisodes(sickDates);
    return episodes.length;
}
function shouldWaiveKarens(entries, referenceDate = new Date()) {
    return countKarensDaysInLookback(entries, referenceDate) >= livsmedel2026_1.SICK_KARENS_WAIVER_AFTER_DAYS;
}
function sickDayIndexInEpisode(date, episode) {
    return episode.indexOf(date) + 1;
}
function computeAbsenceAdjustments(entries, periodFrom, periodTo, referenceDate = new Date(), hourlyRate = livsmedel2026_1.HOURLY_RATE_SEK) {
    const periodDates = new Set((0, timeMath_1.eachDateInclusive)(periodFrom, periodTo));
    const inPeriod = entries.filter((e) => periodDates.has(e.date));
    const allSickDates = entries
        .filter((e) => isSjukCategory(e.category) && !isSjukDay15Plus(e.category))
        .map((e) => e.date);
    const episodes = groupSickEpisodes(allSickDates);
    const waiveKarens = shouldWaiveKarens(entries, referenceDate);
    const lines = [];
    let totalDeductionSek = 0;
    let totalExpectedIncomeSek = 0;
    for (const entry of inPeriod) {
        const cat = (0, timeMath_1.categoryBase)(entry.category);
        const hours = entry.hoursWorked;
        if (isVabCategory(entry.category)) {
            const deduction = Math.round(hours * hourlyRate * 100) / 100;
            const expected = Math.round(hours * hourlyRate * livsmedel2026_1.VAB_NET_REPLACEMENT_FRACTION * 100) / 100;
            lines.push({
                date: entry.date,
                category: cat,
                description: 'VAB — 100 % avdrag, simulerad FK-ersättning',
                deductionSek: deduction,
                expectedIncomeSek: expected,
            });
            totalDeductionSek += deduction;
            totalExpectedIncomeSek += expected;
            continue;
        }
        if (isSjukDay15Plus(entry.category)) {
            const deduction = livsmedel2026_1.DAILY_RATE_SEK;
            lines.push({
                date: entry.date,
                category: cat,
                description: 'Sjuk dag 15+ — dagsavdrag (FK)',
                deductionSek: deduction,
                expectedIncomeSek: 0,
            });
            totalDeductionSek += deduction;
            continue;
        }
        if (isSjukCategory(entry.category)) {
            const episode = episodes.find((ep) => ep.includes(entry.date));
            const dayIndex = episode ? sickDayIndexInEpisode(entry.date, episode) : 1;
            if (dayIndex === 1) {
                if (!waiveKarens) {
                    const karensHours = Math.min(livsmedel2026_1.SICK_KARENS_HOURS, hours || livsmedel2026_1.SICK_KARENS_HOURS);
                    const deduction = Math.round(karensHours * hourlyRate * 100) / 100;
                    lines.push({
                        date: entry.date,
                        category: cat,
                        description: 'Sjuk dag 1 — karens (0 kr utbetalning)',
                        deductionSek: deduction,
                        expectedIncomeSek: 0,
                    });
                    totalDeductionSek += deduction;
                }
                else {
                    lines.push({
                        date: entry.date,
                        category: cat,
                        description: 'Sjuk dag 1 — karens upphävd (≥10 karensdagar/365 d)',
                        deductionSek: 0,
                        expectedIncomeSek: 0,
                    });
                }
                continue;
            }
            if (dayIndex >= 2 && dayIndex <= 14) {
                const h = hours > 0 ? hours : livsmedel2026_1.SICK_KARENS_HOURS;
                const deduction = Math.round(h * hourlyRate * livsmedel2026_1.SICK_DAY2_14_EMPLOYER_LOSS_FRACTION * 100) / 100;
                lines.push({
                    date: entry.date,
                    category: cat,
                    description: `Sjuk dag ${dayIndex} — 20 % nettotapp (80 % sjuklön)`,
                    deductionSek: deduction,
                    expectedIncomeSek: 0,
                });
                totalDeductionSek += deduction;
                continue;
            }
            if (dayIndex >= 15) {
                const deduction = livsmedel2026_1.DAILY_RATE_SEK;
                lines.push({
                    date: entry.date,
                    category: cat,
                    description: `Sjuk dag ${dayIndex} — dagsavdrag`,
                    deductionSek: deduction,
                    expectedIncomeSek: 0,
                });
                totalDeductionSek += deduction;
            }
        }
    }
    return {
        lines,
        totalDeductionSek: Math.round(totalDeductionSek * 100) / 100,
        totalExpectedIncomeSek: Math.round(totalExpectedIncomeSek * 100) / 100,
    };
}
//# sourceMappingURL=payAbsenceRules.js.map