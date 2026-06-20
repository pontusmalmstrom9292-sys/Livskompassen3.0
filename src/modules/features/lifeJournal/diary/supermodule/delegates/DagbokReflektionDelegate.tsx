import { useEffect } from 'react';
import { useStore } from '@/core/store';
import { hasVaultGate } from '@/core/auth/sessionService';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { JournalArchiveReadonly } from '@/features/lifeJournal/diary/diary/components/JournalArchiveReadonly';
import { ConfirmStep } from '@/features/lifeJournal/diary/diary/components/ConfirmStep';
import { DagbokWizardErrorBoundary } from '@/features/lifeJournal/diary/diary/components/DagbokWizardErrorBoundary';
import { MoodStep } from '@/features/lifeJournal/diary/diary/components/MoodStep';
import { ReflectionStep } from '@/features/lifeJournal/diary/diary/components/ReflectionStep';
import { SavedStep } from '@/features/lifeJournal/diary/diary/components/SavedStep';
import { JOURNAL_CATEGORIES } from '@/features/lifeJournal/diary/diary/constants/journalCategories';
import { JOURNAL_STEPS } from '@/features/lifeJournal/diary/diary/constants/moods';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';

export type DagbokReflektionDelegateProps = {
  onSaved?: () => void;
};

/**
 * Fas 11C — Reflektion wizard (mood → text → confirm → saved).
 * B3 — primär: wizard. Sekundär: tips (CalmCollapsible).
 * Thin wrapper — all WORM writes via useJournalFlow (skrivskyddad kärna).
 */
export function DagbokReflektionDelegate({ onSaved }: DagbokReflektionDelegateProps) {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();

  const {
    step,
    mood,
    text,
    tags,
    category,
    pendingMemoryFile,
    memoryError,
    saving,
    error,
    weaveToKampspar,
    lastSavedEntryId,
    setWeaveToKampspar,
    setCategory,
    setPendingMemoryFile,
    setMemoryError,
    lowEnergyBridge,
    setMood,
    setText,
    toggleTag,
    goToStep,
    handleSave,
    handleSaveMoodOnly,
    handleSaveWithoutText,
    resetFlow,
  } = useJournalFlow({ userId: user?.uid });

  if (!user) {
    return (
      <p className="text-sm text-text-muted p-4 text-center">
        Logga in för att spara i dagboken.
      </p>
    );
  }

  const categoryLabel = category
    ? JOURNAL_CATEGORIES.find((c) => c.id === category)?.label
    : null;

  useEffect(() => {
    if (step === 'done') {
      onSaved?.();
    }
  }, [step, onSaved]);

  return (
    <div className="dagbok-delegate dagbok-delegate--reflektion" data-write-target="journal_worm">
      <header className="mb-4">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Reflektera
        </p>
      </header>

      <DagbokWizardErrorBoundary
        onReset={() => {
          resetFlow();
        }}
      >
        <div className="reflektion-wizard" aria-live="polite">
          <p className="sr-only">
            Steg {JOURNAL_STEPS.findIndex((s) => s.key === step) + 1} av {JOURNAL_STEPS.length}:{' '}
            {JOURNAL_STEPS.find((s) => s.key === step)?.label}
          </p>

          {step === 'mood' && (
            <MoodStep
              mood={mood}
              onMoodChange={setMood}
              onContinue={() => goToStep('text')}
              lowEnergyBridge={lowEnergyBridge}
              saving={saving}
              onSaveMoodOnly={handleSaveMoodOnly}
              showMoodOnlyButton
            />
          )}

          {step === 'text' && (
            <ReflectionStep
              text={text}
              mood={mood}
              category={category}
              memoryFile={pendingMemoryFile}
              memoryError={memoryError}
              onTextChange={setText}
              onCategoryChange={setCategory}
              onMemoryFileChange={setPendingMemoryFile}
              onMemoryValidationError={setMemoryError}
              onBack={() => goToStep('mood')}
              onContinue={() => goToStep('save')}
              lowEnergyBridge={lowEnergyBridge}
              onSaveWithoutText={lowEnergyBridge ? handleSaveWithoutText : undefined}
              saving={saving}
            />
          )}

          {step === 'save' && (
            <ConfirmStep
              mood={mood}
              text={text}
              memoryFileName={pendingMemoryFile?.name}
              memoryError={memoryError}
              categoryLabel={categoryLabel}
              saving={saving}
              weaveToKampspar={weaveToKampspar}
              showWeaveOptIn={Boolean(user.uid)}
              onWeaveToKampsparChange={setWeaveToKampspar}
              tags={tags}
              onToggleTag={toggleTag}
              onBack={() => goToStep('text')}
              onSave={handleSave}
            />
          )}

          {step === 'done' && (
            <SavedStep
              onNewEntry={() => {
                resetFlow();
              }}
              journalContext={{ mood, text: text.trim() }}
              userId={user.uid}
              journalEntryId={lastSavedEntryId}
              showWeaverApproval={vaultSessionOpen}
            />
          )}

          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </div>
      </DagbokWizardErrorBoundary>

      <CalmCollapsible
        title="Tips & låg energi"
        meta="Valfritt"
        defaultOpen={false}
        glow="gold"
      >
        <div className="space-y-2 text-xs text-text-dim">
          <p>Ta det lugnt — ett litet steg i taget. Inget måste bli perfekt.</p>
          <p>
            Du kan spara bara känslan, skriva tre ord, eller hoppa över text helt när energin är låg.
          </p>
          <p>Dagboken är din — formellt bevis sparas separat i Valv när du väljer det.</p>
        </div>
      </CalmCollapsible>
    </div>
  );
}

/** Fas 11C — read-only minneslista (arkiv-läge). */
export function DagbokArkivDelegate() {
  const user = useStore((s) => s.user);
  const { entries, error, refreshEntries } = useJournalFlow({ userId: user?.uid });

  useEffect(() => {
    if (!user) return;
    refreshEntries().catch(() => undefined);
  }, [user, refreshEntries]);

  if (!user) {
    return (
      <p className="text-sm text-text-muted p-4 text-center">
        Logga in för att se din minneslista.
      </p>
    );
  }

  return (
    <div className="dagbok-delegate dagbok-delegate--arkiv" data-write-target="read_only">
      <header className="mb-4 space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Minneslista
        </p>
        <p className="text-xs text-text-dim">
          Dina sparade tankar — läs bara, inget att ändra.
        </p>
      </header>
      <JournalArchiveReadonly
        entries={entries}
        bare
        intro="Dina sparade tankar — läs bara, inget att ändra."
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
