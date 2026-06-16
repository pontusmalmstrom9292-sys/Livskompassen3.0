import { Link } from 'react-router-dom';
import { NAV_PATHS } from '@/core/navigation/navTruth';

/** Legacy dashboard widget — pekar på kanonisk Hjärtat-hub (ersätter diary supermodule-prototyp). */
export function LazyDiary() {
  return (
    <div className="calm-card glow-bottom-blue flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-2xl border border-border/30 p-6 text-center">
      <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">Hjärtat</p>
      <p className="text-sm text-text-muted">Reflektion och speglar finns i zonen Hjärtat.</p>
      <Link
        to={`${NAV_PATHS.HJARTAT}?tab=reflektion`}
        className="rounded-xl border border-accent/30 bg-surface-3 px-4 py-2 text-sm text-accent hover:border-accent/50"
      >
        Öppna reflektion
      </Link>
    </div>
  );
}
