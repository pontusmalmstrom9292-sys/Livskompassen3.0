import { Loader2 } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { saveEmotionalMemory } from '@/core/firebase/emotionalMemoryFirestore';
import { useStore } from '@/core/store';
import { useEmotionalMemoryStore } from '@/features/emotional-memory/store/useEmotionalMemoryStore';

const COPY = {
  login: 'Logga in med verifierad e-post för att spara minnet.',
  error: 'Kunde inte spara just nu. Försök igen när nätverket finns.',
  intensityLabel: 'Styrka (1–10)',
} as const;

type Props = {
  onSaved?: (docId: string) => void;
};

export function MemoryInputView({ onSaved }: Props) {
  const user = useStore((state) => state.user);
  const updateContent = useEmotionalMemoryStore((state) => state.updateContent);
  const [draft, setDraft] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setDraft(event.target.value);
    setSaved(false);
    setError(null);
  };

  const handleIntensityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIntensity(Number(event.target.value));
    setSaved(false);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !user?.uid) return;

    setSaving(true);
    setError(null);
    try {
      const docId = await saveEmotionalMemory(user.uid, {
        memoryType: 'freeform',
        content: trimmed,
        intensity,
      });
      updateContent(trimmed);
      setSaved(true);
      onSaved?.(docId);
    } catch {
      setError(COPY.error);
    } finally {
      setSaving(false);
    }
  };

  const isEmpty = draft.trim().length === 0;

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-2 p-6"
    >
      <label
        htmlFor="emotional-memory-input"
        className="font-display text-sm tracking-[0.2em] text-text-muted uppercase"
      >
        Minne
      </label>

      <textarea
        id="emotional-memory-input"
        value={draft}
        onChange={handleChange}
        rows={6}
        placeholder="Skriv ner minnet här …"
        disabled={!user?.uid || saving}
        className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 font-sans text-text placeholder:text-text-dim focus:border-accent/40 focus:outline-none disabled:opacity-50"
      />

      <label className="flex flex-col gap-2 font-sans text-xs text-text-muted">
        {COPY.intensityLabel}
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={intensity}
          onChange={handleIntensityChange}
          disabled={!user?.uid || saving}
          className="accent-accent"
        />
        <span className="text-text-dim">{intensity}</span>
      </label>

      {!user?.uid ? (
        <p className="text-xs text-text-dim">{COPY.login}</p>
      ) : (
        <button
          type="submit"
          disabled={isEmpty || saving}
          className="self-end rounded-xl border border-border bg-surface-3 px-5 py-2 font-sans text-sm text-accent-light transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden />
              Sparar…
            </>
          ) : (
            'Spara minne'
          )}
        </button>
      )}

      {saved ? (
        <p className="text-xs text-success">Minnet sparat — det kan inte ändras eller raderas.</p>
      ) : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </form>
  );
}
