import type { NutritionIntakeEntry } from './mabraNutritionIntakeTypes';
import { NUTRITION_QUALITY_LABELS } from './mabraNutritionIntakeTypes';
import { entriesForDate, entriesInLastDays } from './mabraNutritionIntakeStorage';
import { nutritionDateKey } from './mabraNutritionDayStorage';

export type NutritionRhythmInsight = {
  id: string;
  message: string;
};

function hourFromIso(iso: string): number {
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60;
}

function formatHour(h: number): string {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function computeNutritionRhythmInsights(
  entries: NutritionIntakeEntry[],
  days = 7,
  now = new Date(),
): NutritionRhythmInsight[] {
  const week = entriesInLastDays(entries, days, now);
  const food = week.filter((e) => e.kind === 'food');
  const insights: NutritionRhythmInsight[] = [];

  if (food.length === 0) {
    return [
      {
        id: 'no-food',
        message: 'Ingen mat loggad senaste veckan. Ett litet intag räcker för att se mönster.',
      },
    ];
  }

  const firstMealHours: number[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayFood = entriesForDate(food, nutritionDateKey(d))
      .slice()
      .sort((a, b) => a.at.localeCompare(b.at));
    if (dayFood[0]) firstMealHours.push(hourFromIso(dayFood[0].at));
  }

  if (firstMealHours.length >= 2) {
    const avg = firstMealHours.reduce((a, b) => a + b, 0) / firstMealHours.length;
    insights.push({
      id: 'first-meal',
      message: `Första maten brukar loggas runt ${formatHour(avg)} — ingen prestation, bara rytm.`,
    });
  }

  const todayFood = entriesForDate(food, nutritionDateKey(now))
    .slice()
    .sort((a, b) => a.at.localeCompare(b.at));
  for (let i = 1; i < todayFood.length; i += 1) {
    const gapH = hourFromIso(todayFood[i].at) - hourFromIso(todayFood[i - 1].at);
    if (gapH >= 6) {
      insights.push({
        id: 'long-gap-today',
        message: `Lång paus idag (${Math.round(gapH)} h mellan mat). Ett litet mellanmål kan stabilisera energin.`,
      });
      break;
    }
  }

  const poor = week.filter((e) => e.quality === 'poor').length;
  const good = week.filter((e) => e.quality === 'good').length;
  if (week.length >= 3) {
    if (poor > good) {
      insights.push({
        id: 'quality-balance',
        message: `${poor} tunga val vs ${good} bra energi denna vecka. Planera en enkel måltid du gillar — utan skuld.`,
      });
    } else if (good >= poor && good > 0) {
      insights.push({
        id: 'quality-positive',
        message: `${good} bra energi-loggar denna vecka. Fortsätt i din takt.`,
      });
    }
  }

  const drinks = week.filter((e) => e.kind === 'drink').length;
  if (drinks > food.length * 2 && drinks >= 4) {
    insights.push({
      id: 'drink-heavy',
      message: 'Mest dryck loggad — kom ihåg att vätska inte ersätter mat helt.',
    });
  }

  return insights.slice(0, 3);
}

export function formatIntakeTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

export function intakeSummaryLabel(entry: NutritionIntakeEntry): string {
  const kind = entry.kind === 'drink' ? 'Dryck' : 'Mat';
  const note = entry.note.trim();
  const quality = NUTRITION_QUALITY_LABELS[entry.quality];
  return note ? `${kind}: ${note} · ${quality}` : `${kind} · ${quality}`;
}
