import { buildSevenDayTrend, readNutritionEntries } from '../lib/mabraNutritionIntakeStorage';
import { NUTRITION_QUALITY_LABELS } from '../lib/mabraNutritionIntakeTypes';

type Props = {
  storageUid: string;
};

function formatDayLabel(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString('sv-SE', { weekday: 'short' });
}

export function MabraNutritionTrendPanel({ storageUid }: Props) {
  const trend = buildSevenDayTrend(readNutritionEntries(storageUid));
  const maxTotal = Math.max(1, ...trend.map((d) => d.total));

  return (
    <div className="mt-4 rounded-xl border border-border-strong bg-surface/40 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wider text-text-dim">7 dagar — översikt</p>
      <p className="mt-1 text-xs text-text-dim">
        {NUTRITION_QUALITY_LABELS.good} · {NUTRITION_QUALITY_LABELS.ok} ·{' '}
        {NUTRITION_QUALITY_LABELS.poor}
      </p>

      <ul className="mt-4 space-y-2" aria-label="Näringsintag senaste veckan">
        {trend.map((day) => (
          <li key={day.dateKey} className="flex items-center gap-3">
            <span className="w-8 shrink-0 text-xs text-text-dim">{formatDayLabel(day.dateKey)}</span>
            <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
              {day.good > 0 ? (
                <div
                  className="h-full bg-success/80"
                  style={{ width: `${(day.good / maxTotal) * 100}%` }}
                  title={`${day.good} bra`}
                />
              ) : null}
              {day.ok > 0 ? (
                <div
                  className="h-full bg-accent-dim/60"
                  style={{ width: `${(day.ok / maxTotal) * 100}%` }}
                  title={`${day.ok} okej`}
                />
              ) : null}
              {day.poor > 0 ? (
                <div
                  className="h-full bg-accent-secondary/50"
                  style={{ width: `${(day.poor / maxTotal) * 100}%` }}
                  title={`${day.poor} tungt`}
                />
              ) : null}
            </div>
            <span className="w-6 shrink-0 text-right text-xs tabular-nums text-text-dim">
              {day.total || '—'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
