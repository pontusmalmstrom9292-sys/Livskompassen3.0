/**
 * Frånvaro — sjuk, VAB, karens (365 dagar). Tar PayProfileContext.
 */
import { categoryBase, eachDateInclusive, parseDateOnly } from './timeMath';
import type { TimeEntryLike } from './payTimeRules';
import type { PayProfileContext } from './payProfileContext';
import { SICK_KARENS_HOURS, SICK_LOOKBACK_DAYS } from './livsmedel2026';

export type AbsenceLine = {
  date: string;
  category: string;
  description: string;
  deductionSek: number;
  expectedIncomeSek: number;
  sickDayIndex?: number;
  isFkPhase?: boolean;
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

/** Episoder — ny episod om > gapDays kalenderdagar mellan sjukdagar. */
export function groupSickEpisodesWithGap(dates: string[], gapDays: number): string[][] {
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
    const dayGap = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (dayGap <= gapDays + 1) {
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
  gapDays = 5,
): number {
  const cutoff = new Date(referenceDate);
  cutoff.setDate(cutoff.getDate() - SICK_LOOKBACK_DAYS);

  const sickDates = entries
    .filter((e) => isSjukCategory(e.category) && !isSjukDay15Plus(e.category))
    .map((e) => e.date)
    .filter((d) => parseDateOnly(d) >= cutoff);

  const episodes = groupSickEpisodesWithGap(sickDates, gapDays);
  return episodes.length;
}

export function shouldWaiveKarens(
  entries: TimeEntryLike[],
  referenceDate = new Date(),
  waiverAfterDays = 10,
  gapDays = 5,
): boolean {
  return countKarensDaysInLookback(entries, referenceDate, gapDays) >= waiverAfterDays;
}

function sickDayIndexInEpisode(date: string, episode: string[]): number {
  return episode.indexOf(date) + 1;
}

function findEpisodeForDate(
  date: string,
  episodes: string[][],
): string[] | undefined {
  return episodes.find((ep) => ep.includes(date));
}

export function computeAbsenceAdjustments(
  entries: TimeEntryLike[],
  periodFrom: string,
  periodTo: string,
  profile: PayProfileContext,
  referenceDate = new Date(),
): AbsenceSummary {
  const cfg = profile.agreementConfig;
  const hourlyRate = profile.hourlyRateSek;
  const dailyRate = profile.dailyRateSek;
  const karensDeduction = Math.round(profile.weeklySickPaySek * cfg.karensWeeklySickPayFraction * 100) / 100;
  const vabFraction = cfg.vabNetReplacementFraction;
  const employerLossFraction = cfg.sickDay2_14EmployerLossFraction;
  const gapDays = cfg.reSickGapDays;
  const waiverAfter = cfg.karensWaiverAfterDays;

  const periodDates = new Set(eachDateInclusive(periodFrom, periodTo));
  const inPeriod = entries.filter((e) => periodDates.has(e.date));

  const allSickDates = entries
    .filter((e) => isSjukCategory(e.category) && !isSjukDay15Plus(e.category))
    .map((e) => e.date);
  const episodes = groupSickEpisodesWithGap(allSickDates, gapDays);
  const waiveKarens = shouldWaiveKarens(entries, referenceDate, waiverAfter, gapDays);

  const lines: AbsenceLine[] = [];
  let totalDeductionSek = 0;
  let totalExpectedIncomeSek = 0;

  for (const entry of inPeriod) {
    const cat = categoryBase(entry.category);
    const hours = entry.hoursWorked;

    if (isVabCategory(entry.category)) {
      const deduction = Math.round(hours * hourlyRate * 100) / 100;
      const expected = Math.round(hours * hourlyRate * vabFraction * 100) / 100;
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
      const deduction = dailyRate;
      lines.push({
        date: entry.date,
        category: cat,
        description: 'Sjuk dag 15+ — dagsavdrag (FK)',
        deductionSek: deduction,
        expectedIncomeSek: 0,
        sickDayIndex: 15,
        isFkPhase: true,
      });
      totalDeductionSek += deduction;
      continue;
    }

    if (isSjukCategory(entry.category)) {
      const episode = findEpisodeForDate(entry.date, episodes);
      const dayIndex = episode ? sickDayIndexInEpisode(entry.date, episode) : 1;

      if (dayIndex === 1) {
        if (!waiveKarens) {
          const deduction = karensDeduction;
          lines.push({
            date: entry.date,
            category: cat,
            description: 'Sjuk dag 1 — karens (20 % veckosjuklön)',
            deductionSek: deduction,
            expectedIncomeSek: 0,
            sickDayIndex: 1,
          });
          totalDeductionSek += deduction;
        } else {
          lines.push({
            date: entry.date,
            category: cat,
            description: `Sjuk dag 1 — karens upphävd (≥${waiverAfter} karensdagar/365 d)`,
            deductionSek: 0,
            expectedIncomeSek: 0,
            sickDayIndex: 1,
          });
        }
        continue;
      }

      if (dayIndex >= 2 && dayIndex <= 14) {
        const h = hours > 0 ? hours : SICK_KARENS_HOURS;
        const deduction = Math.round(h * hourlyRate * employerLossFraction * 100) / 100;
        lines.push({
          date: entry.date,
          category: cat,
          description: `Sjuk dag ${dayIndex} — ${Math.round(employerLossFraction * 100)} % nettotapp (${Math.round((1 - employerLossFraction) * 100)} % sjuklön)`,
          deductionSek: deduction,
          expectedIncomeSek: 0,
          sickDayIndex: dayIndex,
        });
        totalDeductionSek += deduction;
        continue;
      }

      if (dayIndex >= 15) {
        const deduction = dailyRate;
        lines.push({
          date: entry.date,
          category: cat,
          description: `Sjuk dag ${dayIndex} — dagsavdrag (FK)`,
          deductionSek: deduction,
          expectedIncomeSek: 0,
          sickDayIndex: dayIndex,
          isFkPhase: true,
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
