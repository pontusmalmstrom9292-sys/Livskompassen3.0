import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useEmotionalMemoryStore } from '@/features/emotional-memory/store/useEmotionalMemoryStore';

export function MemoryInputView() {
  const updateContent = useEmotionalMemoryStore((state) => state.updateContent);
  const [draft, setDraft] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setDraft(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    updateContent(draft.trim());
  };

  const isEmpty = draft.trim().length === 0;

  return (
    <form
      onSubmit={handleSubmit}
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
        className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 font-sans text-text placeholder:text-text-dim focus:border-accent/40 focus:outline-none"
      />

      <button
        type="submit"
        disabled={isEmpty}
        className="self-end rounded-xl border border-border bg-surface-3 px-5 py-2 font-sans text-sm text-accent-light transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Spara minne
      </button>
    </form>
  );
}
