import type { VitEntryKind } from '@/core/types/firestore';
import {
  VIT_HUB_DEVELOPMENT_HINT,
  VIT_HUB_STAT_DAYS_HINT,
} from '@/features/dailyLife/wellbeing/mabra/lib/vitHubCopy';
import type { VitHubStats } from '@/features/dailyLife/wellbeing/mabra/lib/vitHubStats';

const KIND_LABELS: Record<VitEntryKind, string> = {
  card: 'Frågekort',
  memory: 'Känslominne',
  chat_turn: 'Dialog',
};

type Props = {
  stats: VitHubStats;
};

/** P5 — deterministisk veckoaktivitet + typ-fördelning, ingen streak/LLM. */
export function VitDevelopmentPanel({ stats }: Props) {
  const maxWeekCount = Math.max(1, ...stats.weeklyActivity.map((w) => w.count));
  const hasKindData = Object.values(stats.kindCounts).some((n) => n > 0);

  if (stats.totalEntries === 0 && stats.sessionCount === 0) {
    return null;
  }

  return (
    <section className="calm-card p-4 sm:p-5" aria-label="Utveckling">
      <h2 className="text-xs font-medium uppercase tracking-wider text-accent">Utveckling</h2>
      <p className="mt-1 text-[10px] text-text-dim">{VIT_HUB_DEVELOPMENT_HINT}</p>

      {stats.weeklyActivity.length > 0 ? (
        <div className="mt-4" role="img" aria-label="Aktivitet senaste fyra veckorna">
          <ul className="flex items-end justify-between gap-2">
            {stats.weeklyActivity.map((week) => {
              const heightPct = week.count > 0 ? Math.max(12, (week.count / maxWeekCount) * 100) : 4;
              return (
                <li key={week.weekKey} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] tabular-nums text-text-dim">{week.count || '—'}</span>
                  <div
                    className="w-full max-w-[2.5rem] rounded-t-md border border-border-strong/40 bg-accent/20 transition-[height]"
                    style={{ height: `${heightPct}px` }}
                    aria-hidden
                  />
                  <span className="truncate text-[9px] uppercase tracking-wide text-text-dim">
                    {week.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[10px] text-text-dim">{VIT_HUB_STAT_DAYS_HINT}</p>
        </div>
      ) : null}

      {hasKindData ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Fördelning per typ">
          {(Object.entries(stats.kindCounts) as [VitEntryKind, number][])
            .filter(([, count]) => count > 0)
            .map(([kind, count]) => (
              <li
                key={kind}
                className="rounded-full border border-border-strong px-3 py-1 text-xs text-text-muted"
              >
                {KIND_LABELS[kind]}: {count}
              </li>
            ))}
        </ul>
      ) : null}
    </section>
  );
}
