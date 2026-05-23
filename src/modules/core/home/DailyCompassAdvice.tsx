import { COMPASS_DAY_CHIPS, getDailyCompassTip } from './dailyCompassTips';
import { useStore } from '../store';

/** F-02 — ett kort, deterministiskt råd + chips. */
export function DailyCompassAdvice() {
  const load = useStore((s) => s.ui.cognitiveLoad);
  const tip = getDailyCompassTip(load);

  return (
    <section className="daily-compass-advice glass-card" aria-label="Kompassråd för dagen">
      <p className="text-[9px] uppercase tracking-widest text-text-dim">Kompassråd · idag</p>
      <p className="mt-1.5 text-xs text-text-muted leading-snug">{tip}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Påminnelser">
        {COMPASS_DAY_CHIPS.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-px text-[9px] uppercase tracking-wider text-text-dim"
          >
            {chip}
          </li>
        ))}
      </ul>
    </section>
  );
}
