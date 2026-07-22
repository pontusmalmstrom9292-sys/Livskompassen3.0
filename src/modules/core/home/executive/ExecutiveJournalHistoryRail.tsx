import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronUp } from 'lucide-react';
import { useStore } from '@/core/store';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';
import { formatRelativeJournalDate, journalEntryDate } from './execJournalUtils';

export function ExecutiveJournalHistoryRail() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const { entries, refreshEntries } = useJournalFlow({ userId: user?.uid });

  useEffect(() => {
    if (!user) return;
    refreshEntries().catch(() => undefined);
  }, [user, refreshEntries]);

  const recent = entries.slice(0, 8);

  if (!user) return null;

  return (
    <section className="exec-journal-rail" aria-label="Tidigare anteckningar">
      <div className="exec-journal-rail__head">
        <h3 className="exec-home-label mb-0">TIDIGARE ANTECKNINGAR</h3>
        <button
          type="button"
          className="exec-journal-rail__all min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          onClick={() => navigate('/hjartat?tab=reflektion')}
        >
          Visa alla
          <ChevronUp className="h-3 w-3" strokeWidth={2} aria-hidden />
        </button>
      </div>
      {recent.length === 0 ? (
        <p className="px-1 text-xs text-text-muted italic">Inga tidigare anteckningar.</p>
      ) : (
        <div className="exec-journal-rail__scroll mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {recent.map((entry) => {
            const date = journalEntryDate(entry);
            const titleText = entry.mood
              ? entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1).toLowerCase()
              : 'Dagbok';
            return (
              <button
                key={entry.id}
                type="button"
                className="exec-journal-rail__card min-h-11 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
                onClick={() => navigate('/hjartat?tab=reflektion')}
                aria-label={`Öppna anteckning: ${titleText}`}
              >
                <span className="exec-journal-rail__icon" aria-hidden>
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className="exec-journal-rail__title">{titleText}</span>
                <span className="exec-journal-rail__date">{formatRelativeJournalDate(date)}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
