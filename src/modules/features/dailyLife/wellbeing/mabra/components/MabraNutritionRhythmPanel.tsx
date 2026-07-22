import {
  computeNutritionRhythmInsights,
  formatIntakeTime,
  intakeSummaryLabel,
} from '../lib/mabraNutritionRhythmAnalysis';
import { entriesForDate, readNutritionEntries } from '../lib/mabraNutritionIntakeStorage';
import { nutritionDateKey } from '../lib/mabraNutritionDayStorage';

type Props = {
  storageUid: string;
};

export function MabraNutritionRhythmPanel({ storageUid }: Props) {
  const entries = readNutritionEntries(storageUid);
  const insights = computeNutritionRhythmInsights(entries);

  return (
    <div className="mabra-insight-card mt-4 rounded-xl border border-border-strong bg-surface/40 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Måltidsrytm</p>
      <div className="gs-hub-card__progress mt-3" role="presentation" aria-hidden>
        <span className="gs-hub-card__progress-fill mabra-insight-card__progress-fill" />
      </div>
      <ul className="mt-3 space-y-2">
        {insights.map((item) => (
          <li key={item.id} className="mabra-insight-card__line text-sm leading-relaxed text-text-muted">
            {item.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

type TodayProps = Props & {
  refreshKey?: number;
};

export function MabraNutritionTodayList({ storageUid }: TodayProps) {
  const today = entriesForDate(readNutritionEntries(storageUid), nutritionDateKey())
    .slice(0, 8);

  if (today.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-border bg-surface-2/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Idag</p>
      <ul className="mt-2 space-y-2">
        {today.map((entry) => (
          <li key={entry.id} className="flex items-start justify-between gap-2 text-sm text-text-muted">
            <span className="leading-relaxed">{intakeSummaryLabel(entry)}</span>
            <span className="shrink-0 text-xs tabular-nums text-text-muted">
              {formatIntakeTime(entry.at)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
