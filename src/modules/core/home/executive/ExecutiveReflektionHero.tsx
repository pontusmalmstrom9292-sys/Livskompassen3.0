import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '@/core/store';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';
import { getCompassAdvice } from '@/features/dailyLife/wellbeing/compasses/utils/compassAdvice';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import { EXEC_REFLEKTION_BG, formatJournalDateKey, journalEntryDate } from './execJournalUtils';

export function ExecutiveReflektionHero() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const { entries, refreshEntries } = useJournalFlow({ userId: user?.uid });

  useEffect(() => {
    if (!user) return;
    refreshEntries().catch(() => undefined);
  }, [user, refreshEntries]);

  const todayKey = formatJournalDateKey(new Date());
  const activeEntry = entries.find((e) => formatJournalDateKey(journalEntryDate(e)) === todayKey);

  const compassPrompt = (() => {
    try {
      return getCompassAdvice(getDefaultCompassByTime(), new Date());
    } catch {
      return 'Du är den trygga hamnen — ett steg i taget.';
    }
  })();

  const goWrite = () => navigate('/hjartat?tab=reflektion&write=true');

  return (
    <section
      className="exec-reflektion-hero relative overflow-hidden rounded-[2rem] border border-accent/20 min-h-[12.5rem] p-5"
      style={{
        backgroundImage: EXEC_REFLEKTION_BG,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label="Dagens reflektion"
    >
      <div className="exec-reflektion-hero__grid relative z-[1] grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0 space-y-2">
          <p className="exec-home-label">DAGENS REFLEKTION</p>
          {activeEntry ? (
            <p className="text-sm font-medium italic leading-relaxed text-text line-clamp-3">
              &ldquo;{activeEntry.text}&rdquo;
            </p>
          ) : (
            <>
              <h2 className="font-display-serif text-xl tracking-wide text-text">
                Stanna upp. Känn efter.
              </h2>
              <p className="text-xs text-text-muted">
                En stund för dig själv är aldrig bortkastad.
              </p>
            </>
          )}
          <button
            type="button"
            className="exec-reflektion-hero__cta mt-2 inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-accent transition-colors hover:border-accent/60 hover:bg-accent/5"
            onClick={goWrite}
          >
            <PenLine className="h-3.5 w-3.5" strokeWidth={1.5} />
            Skriv nu
          </button>
        </div>

        <div className="exec-reflektion-hero__aside flex max-w-[11rem] flex-col items-center gap-2 sm:items-end">
          <span
            className={clsx(
              'flex h-11 w-11 items-center justify-center rounded-full border border-accent/35',
              'bg-accent/10 text-accent shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_28%,transparent)]',
            )}
            aria-hidden
          >
            <Star className="h-5 w-5 fill-accent/30" strokeWidth={1.5} />
          </span>
          <p className="text-center text-[10px] leading-snug text-text-muted sm:text-right">
            {compassPrompt}
          </p>
        </div>
      </div>
    </section>
  );
}
