import { Loader2, Lock } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { isVerifiedEmailUser } from '@/core/auth/requireEmailAuth';
import { saveEmotionalMemory } from '@/core/firebase/emotionalMemoryFirestore';
import { OfflineWriteBlockedError } from '@/core/firebase/offlineWritePolicy';
import { useStore } from '@/core/store';
import {
  useCapacityScore,
  useIsCapacityLoading,
  useListenToCapacityState,
} from '@/core/store/useCapacityGate';
import type { EmotionalMemoryType } from '@/core/types/firestore';
import { EmptyState } from '@/core/ui/EmptyState';
import { Button } from '@/design-system/components/Button';
import { useEmotionalMemoryStore } from '@/features/emotional-memory/store/useEmotionalMemoryStore';

const COPY = {
  title: 'Känslominne',
  lead: 'Skriv hur det kändes — ett steg i taget. Sparat minne kan inte ändras (WORM).',
  login: 'Logga in med verifierad e-post för att spara minnet.',
  loading: 'Läser kapacitet…',
  error: 'Kunde inte spara just nu. Försök igen när nätverket finns.',
  intensityLabel: 'Styrka (1–10)',
  typeLabel: 'Typ',
  saved: 'Minnet är sparat och skrivskyddat.',
  newEntry: 'Starta nytt minne',
  save: 'Spara minne',
  saving: 'Sparar…',
  placeholder: 'Skriv ner minnet här …',
  lowCapacityHint: 'Förenklad vy — bara text och spara.',
} as const;

const MEMORY_TYPE_OPTIONS: ReadonlyArray<{ value: EmotionalMemoryType; label: string }> = [
  { value: 'freeform', label: 'Fritt' },
  { value: 'feeling', label: 'Känsla' },
  { value: 'reflection', label: 'Reflektion' },
  { value: 'identity', label: 'Identitet' },
];

const ADVANCED_CONTROLS_THRESHOLD = 0.5;

type EmotionalMemoryComponentProps = {
  onSaved?: (docId: string) => void;
  defaultMemoryType?: EmotionalMemoryType;
  compact?: boolean;
};

function isEmotionalMemoryType(value: string): value is EmotionalMemoryType {
  return MEMORY_TYPE_OPTIONS.some((option) => option.value === value);
}

function resolveSaveError(err: unknown): string {
  if (err instanceof OfflineWriteBlockedError) {
    return err.message;
  }
  if (err instanceof FirebaseError && err.code === 'permission-denied') {
    return COPY.login;
  }
  return COPY.error;
}

export function EmotionalMemoryComponent({
  onSaved,
  defaultMemoryType = 'freeform',
  compact = false,
}: EmotionalMemoryComponentProps) {
  const user = useStore((state) => state.user);
  const updateContent = useEmotionalMemoryStore((state) => state.updateContent);

  const listenToCapacityState = useListenToCapacityState();
  const isCapacityLoading = useIsCapacityLoading();
  const capacityScore = useCapacityScore();

  const [draft, setDraft] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [memoryType, setMemoryType] = useState<EmotionalMemoryType>(defaultMemoryType);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      return listenToCapacityState(user.uid);
    }
  }, [user?.uid, listenToCapacityState]);

  const showAdvancedControls = capacityScore >= ADVANCED_CONTROLS_THRESHOLD;
  const canSaveToWorm = isVerifiedEmailUser(
    user?.isAnonymous ?? true,
    user?.email,
    user?.emailVerified,
  );
  const inputExposed = canSaveToWorm && !isCapacityLoading;
  const inputsDisabled = isLocked || saving;
  const isEmpty = draft.trim().length === 0;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    if (inputsDisabled) return;
    setDraft(event.target.value);
    setError(null);
  };

  const handleIntensityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (inputsDisabled) return;
    setIntensity(Number(event.target.value));
    setError(null);
  };

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (inputsDisabled) return;
    const value = event.target.value;
    if (isEmotionalMemoryType(value)) {
      setMemoryType(value);
      setError(null);
    }
  };

  const handleStartNewEntry = (): void => {
    setDraft('');
    setIntensity(5);
    setMemoryType(defaultMemoryType);
    setIsLocked(false);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (inputsDisabled || !user?.uid) return;

    const trimmed = draft.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);
    try {
      const docId = await saveEmotionalMemory(user.uid, {
        memoryType: showAdvancedControls ? memoryType : 'freeform',
        content: trimmed,
        intensity: showAdvancedControls ? intensity : 5,
      });
      updateContent(trimmed);
      setIsLocked(true);
      onSaved?.(docId);
    } catch (err: unknown) {
      setError(resolveSaveError(err));
    } finally {
      setSaving(false);
    }
  };

  if (isCapacityLoading) {
    return (
      <div
        className={`calm-card flex items-center justify-center gap-2 border border-border bg-surface-primary ${
          compact ? 'rounded-2xl p-4' : 'rounded-3xl p-6'
        } text-sm text-text-muted`}
        aria-busy="true"
      >
        <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
        {COPY.loading}
      </div>
    );
  }

  if (!inputExposed) {
    return <EmptyState message={COPY.login} className={compact ? 'p-4' : 'p-6'} />;
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className={`calm-card glow-bottom-green flex flex-col gap-4 border border-border bg-surface-primary ${
        compact ? 'rounded-2xl p-4' : 'rounded-3xl p-6'
      }`}
      aria-readonly={isLocked}
    >
      {!compact ? (
        <header className="flex flex-col gap-1">
          <h2 className="font-display-serif text-[11px] font-medium tracking-[0.2em] text-accent uppercase">
            {COPY.title}
          </h2>
          <p className="font-sans text-xs leading-relaxed text-text-muted">{COPY.lead}</p>
        </header>
      ) : null}

      {isLocked ? (
        <div
          role="status"
          className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2"
        >
          <Lock className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          <p className="font-sans text-xs text-accent">{COPY.saved}</p>
        </div>
      ) : null}

      {!showAdvancedControls && !isLocked ? (
        <p className="font-sans text-xs text-text-dim">{COPY.lowCapacityHint}</p>
      ) : null}

      <label
        htmlFor="emotional-memory-input"
        className="font-display text-xs tracking-[0.2em] text-text-muted uppercase"
      >
        Minne
      </label>

      <textarea
        id="emotional-memory-input"
        value={draft}
        onChange={handleChange}
        readOnly={isLocked}
        rows={compact ? 4 : 6}
        placeholder={COPY.placeholder}
        disabled={inputsDisabled}
        className="w-full resize-none rounded-xl border border-border bg-surface-primary px-4 py-3 font-sans text-text placeholder:text-text-dim focus-visible:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 read-only:cursor-default read-only:opacity-90 disabled:opacity-50"
      />

      {showAdvancedControls ? (
        <>
          <label className="flex flex-col gap-2 font-sans text-xs text-text-muted">
            {COPY.intensityLabel}
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={intensity}
              onChange={handleIntensityChange}
              disabled={inputsDisabled}
              className="accent-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 disabled:opacity-50"
            />
            <span className="text-text-dim">{intensity}</span>
          </label>

          <label className="flex flex-col gap-2 font-sans text-xs text-text-muted">
            {COPY.typeLabel}
            <select
              value={memoryType}
              onChange={handleTypeChange}
              disabled={inputsDisabled}
              className="min-h-11 rounded-xl border border-border bg-surface-primary px-3 py-2 font-sans text-sm text-text focus-visible:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 disabled:opacity-50"
            >
              {MEMORY_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : null}

      <div className="flex justify-end gap-2">
        {isLocked ? (
          <Button type="button" variant="secondary" onClick={handleStartNewEntry}>
            {COPY.newEntry}
          </Button>
        ) : (
          <Button type="submit" variant="secondary" disabled={isEmpty || saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden />
                {COPY.saving}
              </>
            ) : (
              COPY.save
            )}
          </Button>
        )}
      </div>

      {error ? (
        <p role="alert" className="font-sans text-xs text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}
