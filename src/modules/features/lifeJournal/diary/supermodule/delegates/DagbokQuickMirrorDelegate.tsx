import { useStore } from '@/core/store';
import { EmptyState } from '@/core/ui/EmptyState';
import { JournalQuickMode } from '@/features/lifeJournal/diary/diary/components/JournalQuickMode';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';

export type DagbokQuickMirrorDelegateProps = {
  onSaved?: () => void;
};

/**
 * Fas 11C — Snabb check-in + journalQuickMirror.
 * Thin wrapper — all WORM writes via useJournalFlow (skrivskyddad kärna).
 */
export function DagbokQuickMirrorDelegate({ onSaved }: DagbokQuickMirrorDelegateProps) {
  const user = useStore((s) => s.user);

  const {
    mood,
    tags,
    saving,
    error,
    quickJustSaved,
    quickMirror,
    quickMirrorLoading,
    setMood,
    toggleTag,
    handleQuickSave,
  } = useJournalFlow({ userId: user?.uid });

  if (!user) {
    return <EmptyState message="Logga in för att spara i dagboken." />;
  }

  const handleSave = async (
    quickText: string,
    options?: { alsoToArkiv?: boolean },
  ) => {
    await handleQuickSave(quickText, options);
    onSaved?.();
  };

  return (
    <div className="dagbok-delegate dagbok-delegate--quick-mirror" data-write-target="journal_worm">
      <header className="mb-4 space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Snabb spegling
        </p>
        <p className="text-xs text-text-dim">
          En snabb check-in — humör, valfria taggar, spara direkt. Spegling via journalQuickMirror.
        </p>
      </header>

      <div className="reflektion-wizard" aria-live="polite">
        <JournalQuickMode
          mood={mood}
          tags={tags}
          saving={saving}
          justSaved={quickJustSaved}
          mirror={quickMirror}
          mirrorLoading={quickMirrorLoading}
          onMoodChange={setMood}
          onToggleTag={toggleTag}
          onSave={handleSave}
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </div>
    </div>
  );
}
