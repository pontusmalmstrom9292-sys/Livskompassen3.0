import { VIT_HUB_MOOD_HINT } from '@/features/dailyLife/wellbeing/mabra/lib/vitHubCopy';
import type { VitHubStats } from '@/features/dailyLife/wellbeing/mabra/lib/vitHubStats';

const SYMPTOM_LABELS: Record<string, string> = {
  panic_rsd: 'Panik / RSD',
  self_critical: 'Självkritik',
  find_self: 'Hitta mig',
  ovrigt: 'Övrigt',
};

type Props = {
  stats: VitHubStats;
};

/** P5 — MåBra-pass per symptom (senaste 30), deterministisk — inte humör-skala. */
export function VitMabraPassPanel({ stats }: Props) {
  if (stats.sessionCount === 0) return null;

  const entries = Object.entries(stats.symptomCounts).sort(([, a], [, b]) => b - a);
  const maxCount = Math.max(1, ...entries.map(([, c]) => c));

  return (
    <section className="rounded-xl border border-border bg-surface/30 p-4" aria-label="MåBra-pass">
      <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">
        MåBra-pass (symptom)
      </h2>
      <p className="mt-1 text-[10px] text-text-dim">{VIT_HUB_MOOD_HINT}</p>
      <ul className="mt-3 space-y-2">
        {entries.map(([key, count]) => {
          const widthPct = Math.max(8, (count / maxCount) * 100);
          return (
            <li key={key}>
              <div className="flex items-center justify-between gap-2 text-xs text-text-muted">
                <span>{SYMPTOM_LABELS[key] ?? key}</span>
                <span className="tabular-nums text-text-dim">{count}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-accent/40"
                  style={{ width: `${widthPct}%` }}
                  aria-hidden
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
