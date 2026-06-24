import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, ChevronRight, Plus } from 'lucide-react';
import { clsx } from 'clsx';
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
import { useCapacityScore } from '@/core/store/useCapacityGate';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { isLowHomeCapacity } from '@/core/home/homeCapacityGate';

export type DagbokReflektionDelegateProps = {
  onSaved?: () => void;
};

/**
 * Fas 11C — Reflektion wizard (mood → text → confirm → saved) or Dashboard Hub.
 * B3 — primär: dashboard/wizard. Sekundär: tips (CalmCollapsible).
 * Thin wrapper — all WORM writes via useJournalFlow (skrivskyddad kärna).
 */
export function DagbokReflektionDelegate({ onSaved }: DagbokReflektionDelegateProps) {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();

  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const capacityScore = useCapacityScore();
  const lowCapacity = isLowHomeCapacity(evolutionDoc, capacityScore);

  const [searchParams, setSearchParams] = useSearchParams();
  const isWriting = searchParams.get('write') === 'true';

  const startWriting = () => {
    const next = new URLSearchParams(searchParams);
    next.set('write', 'true');
    setSearchParams(next, { replace: true });
  };

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
    validateOnly,
    lastSavedEntryId,
    setWeaveToKampspar,
    setValidateOnly,
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
    entries,
    refreshEntries,
  } = useJournalFlow({ userId: user?.uid });

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const getSwedishWeekday = (date: Date) => {
    const weekdays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    return weekdays[date.getDay()];
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [selectedDateKey, setSelectedDateKey] = useState(() => formatDateKey(new Date()));

  useEffect(() => {
    if (!user) return;
    refreshEntries().catch(() => undefined);
  }, [user, refreshEntries]);

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

  const formatEntryTime = (entry: any) => {
    if (!entry.createdAt) return '';
    const date = entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt);
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isWriting) {
    const dayEntries = entries.filter((e) => {
      if (!e.createdAt) return false;
      const entryDate = (e.createdAt as any).toDate 
        ? (e.createdAt as any).toDate() 
        : new Date(e.createdAt);
      return formatDateKey(entryDate) === selectedDateKey;
    });
    const activeEntry = dayEntries[0];

    return (
      <div className="dagbok-hub-dashboard" data-write-target="read_only">
        {/* Date picker strip */}
        <div className="flex justify-between items-center mb-6 py-2 px-1 overflow-x-auto gap-2">
          {days.map((date) => {
            const key = formatDateKey(date);
            const isSelected = key === selectedDateKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDateKey(key)}
                className="flex flex-col items-center flex-1 min-w-[48px] p-1.5 rounded-2xl focus:outline-none transition-all"
              >
                <span className={clsx(
                  "w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all",
                  isSelected ? "bg-accent text-[#050505] font-bold shadow-md shadow-accent/20" : "text-text-muted hover:text-text"
                )}>
                  {date.getDate()}
                </span>
                <span className="text-[10px] tracking-wider text-text-dim mt-1.5 uppercase font-medium">
                  {getSwedishWeekday(date)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dagens reflektion Hero Card */}
        {activeEntry ? (
          <div 
            className="relative overflow-hidden rounded-[2rem] border border-white/5 p-6 min-h-[190px] flex flex-col justify-between mb-8"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(12, 12, 14, 0.35), rgba(12, 12, 14, 0.9)), url('https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.2em] text-accent uppercase font-bold">
                DAGENS REFLEKTION
              </span>
              <p className="text-base text-white/90 font-medium leading-relaxed italic line-clamp-4">
                "{activeEntry.text}"
              </p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <span className="text-xs text-white/60 font-mono">
                Kl. {formatEntryTime(activeEntry)}
              </span>
              <span className="text-xs text-accent uppercase font-semibold tracking-wider">
                {activeEntry.mood || 'Reflektion'}
              </span>
            </div>
          </div>
        ) : (
          <div 
            className="relative overflow-hidden rounded-[2rem] border border-white/5 p-6 min-h-[190px] flex flex-col justify-between mb-8 cursor-pointer hover:border-accent/10 transition-colors"
            onClick={startWriting}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(12, 12, 14, 0.45), rgba(12, 12, 14, 0.95)), url('https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.2em] text-accent/80 uppercase font-bold">
                DAGENS REFLEKTION
              </span>
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                Ingen anteckning sparad för den här dagen. Ta en stund för att landa i dina tankar och känslor.
              </p>
            </div>
            <div className="mt-4">
              <span className="text-xs text-accent/60 uppercase font-semibold tracking-wider">
                + Skriv nu
              </span>
            </div>
          </div>
        )}

        {/* Tidigare anteckningar list */}
        <div className="space-y-4 mb-8">
          <h3 className="text-[10px] tracking-[0.2em] text-accent uppercase font-bold mb-3 px-1">
            TIDIGARE ANTECKNINGAR
          </h3>
          {entries.length === 0 ? (
            <p className="text-xs text-text-dim italic px-1">Inga tidigare anteckningar.</p>
          ) : (
            <div className="space-y-2.5">
              {entries.map((entry) => {
                const date = (entry.createdAt as any)?.toDate 
                  ? (entry.createdAt as any).toDate() 
                  : entry.createdAt 
                    ? new Date(entry.createdAt) 
                    : new Date();
                const dateString = date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
                const timeString = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div 
                    key={entry.id} 
                    className="calm-card-midnight flex items-center justify-between p-4 cursor-pointer hover:border-accent/20 transition-all active:scale-[0.99]"
                    onClick={() => {
                      setSelectedDateKey(formatDateKey(date));
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs tracking-wider font-semibold text-text uppercase">
                          {entry.mood ? entry.mood : 'Reflektion'}
                        </h4>
                        <p className="text-[10px] text-text-dim mt-0.5">
                          {dateString} kl. {timeString}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Capsule button for new entry */}
        <div className="flex justify-center pt-2 pb-6">
          <button
            type="button"
            onClick={startWriting}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-accent/40 text-accent text-xs font-semibold uppercase tracking-widest hover:bg-accent/5 hover:border-accent transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Ny anteckning
          </button>
        </div>
      </div>
    );
  }

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
              lowCapacity={lowCapacity}
              validateOnly={validateOnly}
              onValidateOnlyChange={setValidateOnly}
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
