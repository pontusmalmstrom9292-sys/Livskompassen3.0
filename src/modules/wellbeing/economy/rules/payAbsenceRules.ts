/**
 * Frånvaro — sjuk, VAB, karens (365 dagar). Port PontusArbetsapp Fas 2.
 */
import { categoryBase, eachDateInclusive, parseDateOnly } from '../../core/utils/timeMath';
import type { TimeEntryLike } from './payTimeRules';
import {
  DAILY_RATE_SEK,
  HOURLY_RATE_SEK,
  SICK_DAY2_14_EMPLOYER_LOSS_FRACTION,
  SICK_KARENS_HOURS,
  SICK_KARENS_WAIVER_AFTER_DAYS,
  SICK_LOOKBACK_DAYS,
  VAB_NET_REPLACEMENT_FRACTION,
} from './livsmedel2026';

export type AbsenceLine = {
  date: string;
  category: string;
  description: string;
  deductionSek: number;
  expectedIncomeSek: number;
};

export type AbsenceSummary = {
  lines: AbsenceLine[];
  totalDeductionSek: number;
  totalExpectedIncomeSek: number;
};

function isSjukCategory(cat: string): boolean {
  const base = categoryBase(cat);
  return base === 'Sjuk' || base === 'Sjuk dag 15+';
}

function isVabCategory(cat: string): boolean {
  return categoryBase(cat) === 'VAB';
}

function isSjukDay15Plus(cat: string): boolean {
  return categoryBase(cat) === 'Sjuk dag 15+';
}

/** Konsekutiva sjukdagar grupperade till episoder. */
export function groupSickEpisodes(dates: string[]): string[][] {
  const sorted = [...new Set(dates)].sort();
  const episodes: string[][] = [];
  let current: string[] = [];

  for (const d of sorted) {
    if (current.length === 0) {
      current.push(d);
      continue;
    }
    const prev = parseDateOnly(current[current.length - 1]);
    const curr = parseDateOnly(d);
    const nextDay = new Date(prev);
    nextDay.setDate(nextDay.getDate() + 1);
    if (curr.getTime() === nextDay.getTime()) {
      current.push(d);
    } else {
      episodes.push(current);
      current = [d];
    }
  }
  if (current.length) episodes.push(current);
  return episodes;
}

/** Antal karensdagar (första dagen per sjukepisod) inom lookback. */
export function countKarensDaysInLookback(
  entries: TimeEntryLike[],
  referenceDate = new Date(),
): number {
  const cutoff = new Date(referenceDate);
  cutoff.setDate(cutoff.getDate() - SICK_LOOKBACK_DAYS);

  const sickDates = entries
    .filter((e) => isSjukCategory(e.category) && !isSjukDay15Plus(e.category))
    .map((e) => e.date)
    .filter((d) => parseDateOnly(d) >= cutoff);

  const episodes = groupSickEpisodes(sickDates);
  return episodes.length;
}

export function shouldWaiveKarens(entries: TimeEntryLike[], referenceDate = new Date()): boolean {
  return countKarensDaysInLookback(entries, referenceDate) >= SICK_KARENS_WAIVER_AFTER_DAYS;
}

function sickDayIndexInEpisode(date: string, episode: string[]): number {
  return episode.indexOf(date) + 1;
}

export function computeAbsenceAdjustments(
  entries: TimeEntryLike[],
  periodFrom: string,
  periodTo: string,
  referenceDate = new Date(),
  hourlyRate = HOURLY_RATE_SEK,
): AbsenceSummary {
  const periodDates = new Set(eachDateInclusive(periodFrom, periodTo));
  const inPeriod = entries.filter((e) => periodDates.has(e.date));

  const allSickDates = entries
    .filter((e) => isSjukCategory(e.category) && !isSjukDay15Plus(e.category))
    .map((e) => e.date);
  const episodes = groupSickEpisodes(allSickDates);
  const waiveKarens = shouldWaiveKarens(entries, referenceDate);

  const lines: AbsenceLine[] = [];
  let totalDeductionSek = 0;
  let totalExpectedIncomeSek = 0;

  for (const entry of inPeriod) {
    const cat = categoryBase(entry.category);
    const hours = entry.hoursWorked;

    if (isVabCategory(entry.category)) {
      const deduction = Math.round(hours * hourlyRate * 100) / 100;
      const expected = Math.round(hours * hourlyRate * VAB_NET_REPLACEMENT_FRACTION * 100) / 100;
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
      const deduction = DAILY_RATE_SEK;
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
          const karensHours = Math.min(SICK_KARENS_HOURS, hours || SICK_KARENS_HOURS);
          const deduction = Math.round(karensHours * hourlyRate * 100) / 100;
          lines.push({
            date: entry.date,
            category: cat,
            description: 'Sjuk dag 1 — karens (0 kr utbetalning)',
            deductionSek: deduction,
            expectedIncomeSek: 0,
          });
          totalDeductionSek += deduction;
        } else {
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
        const h = hours > 0 ? hours : SICK_KARENS_HOURS;
        const deduction =
          Math.round(h * hourlyRate * SICK_DAY2_14_EMPLOYER_LOSS_FRACTION * 100) / 100;
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
        const deduction = DAILY_RATE_SEK;
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
