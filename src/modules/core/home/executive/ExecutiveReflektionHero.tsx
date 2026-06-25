import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, PenLine, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '@/core/store';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';
import { EXEC_REFLEKTION_BG, formatJournalDateKey, journalEntryDate } from './execJournalUtils';

const DEFAULT_ASIDE = {
  lead: 'Du är den trygga hamnen — även när världen känns splittrad.',
  prompt: 'Vad var roligast med Kasper idag — en sak?',
  foot: 'Ett minne i taget räcker. Du behöver inte bevisa att du är en bra pappa varje kväll.',
};

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

  const goWrite = () => navigate('/hjartat?tab=reflektion&write=true');

  return (
    <section
      className="exec-reflektion-hero relative overflow-hidden rounded-[2rem] border border-accent/15 min-h-[14.5rem] p-5"
      style={{
        backgroundImage: EXEC_REFLEKTION_BG,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label="Dagens reflektion"
    >
      <div className="exec-reflektion-hero__watermark" aria-hidden />
      <div className="exec-reflektion-hero__grid relative z-[1] grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0 space-y-2">
          <p className="exec-home-label">DAGENS REFLEKTION</p>
          {activeEntry ? (
            <p className="text-sm font-medium italic leading-relaxed text-text line-clamp-3">
              &ldquo;{activeEntry.text}&rdquo;
            </p>
          ) : (
            <>
              <h2 className="font-display-serif text-xl tracking-wide text-text capitalize">
                Stanna upp. Känn efter.
              </h2>
              <p className="text-xs text-text-muted">
                En stund för dig själv är aldrig bortkastad.
              </p>
            </>
          )}
          <button
            type="button"
            className="exec-reflektion-hero__cta exec-home-btn exec-home-btn--primary"
            onClick={goWrite}
          >
            <PenLine className="h-3.5 w-3.5" strokeWidth={1.5} />
            Skriv nu
          </button>
        </div>

        <aside className="exec-reflektion-hero__aside flex max-w-[12.5rem] flex-col items-center gap-2 sm:items-end">
          <span
            className={clsx(
              'exec-reflektion-hero__badge relative flex h-11 w-11 items-center justify-center rounded-full border border-accent/35',
              'bg-accent/10 text-accent shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_28%,transparent)]',
            )}
          >
            <Star className="h-5 w-5 fill-accent/30" strokeWidth={1.5} aria-hidden />
            <Heart
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-accent/40 text-accent"
              strokeWidth={1.5}
              aria-hidden
            />
          </span>
          <p className="text-center text-[10px] leading-snug text-text-muted sm:text-right">
            {DEFAULT_ASIDE.lead}
          </p>
          <p className="text-center text-[10px] font-medium leading-snug text-accent sm:text-right">
            {DEFAULT_ASIDE.prompt}
          </p>
          <p className="text-center text-[9px] leading-snug text-text-dim sm:text-right">
            {DEFAULT_ASIDE.foot}
          </p>
        </aside>
      </div>
    </section>
  );
}
