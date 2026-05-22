import { COMPASS_DAY_CHIPS, getDailyCompassTip } from './dailyCompassTips';
import { useStore } from '../store';

/** F-02 — ett kort, deterministiskt råd + chips. */
export function DailyCompassAdvice() {
  const load = useStore((s) => s.ui.cognitiveLoad);
  const tip = getDailyCompassTip(load);

  return (
    <section className="daily-compass-advice glass-card p-4" aria-label="Kompassråd för dagen">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Kompassråd · idag</p>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{tip}</p>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Påminnelser">
        {COMPASS_DAY_CHIPS.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-text-dim"
          >
            {chip}
          </li>
        ))}
      </ul>
    </section>
  );
}
