import { useCallback, useEffect, useState } from 'react';
import { listEmotionalMemories } from '@/core/firebase/emotionalMemoryFirestore';
import { useStore } from '@/core/store';
import type { EmotionalMemoryRow } from '@/core/types/firestore';
import { MemoryInputView } from '@/features/emotional-memory/components/MemoryInputView';
import { useEmotionalMemoryStore } from '@/features/emotional-memory/store/useEmotionalMemoryStore';

export function MemoryTestView() {
  const user = useStore((state) => state.user);
  const memoryContent = useEmotionalMemoryStore((state) => state.memoryContent);
  const resetMemory = useEmotionalMemoryStore((state) => state.resetMemory);
  const [entries, setEntries] = useState<EmotionalMemoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshEntries = useCallback(async () => {
    if (!user?.uid) {
      setEntries([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await listEmotionalMemories(user.uid, { limit: 10 });
      setEntries(rows);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void refreshEntries();
  }, [refreshEntries]);

  const isEmpty = memoryContent.trim().length === 0;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display-serif text-lg tracking-[0.2em] text-accent uppercase">
          Minnestest
        </h1>
        <p className="font-sans text-sm text-text-muted">
          Fristående testvy för känslomässig minnesinmatning (WORM).
        </p>
      </header>

      <MemoryInputView onSaved={() => void refreshEntries()} />

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-2 p-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-xs tracking-[0.2em] text-text-muted uppercase">
            Lokalt tillstånd
          </span>
          <button
            type="button"
            onClick={resetMemory}
            disabled={isEmpty}
            className="rounded-lg border border-border px-3 py-1 font-sans text-xs text-text-muted transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Återställ
          </button>
        </div>

        {isEmpty ? (
          <p className="font-sans text-sm text-text-dim italic">
            Inget minne i lokalt tillstånd ännu.
          </p>
        ) : (
          <p className="font-sans text-sm whitespace-pre-wrap text-text">
            {memoryContent}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-2 p-6">
        <span className="font-display text-xs tracking-[0.2em] text-text-muted uppercase">
          Senaste i Firestore
        </span>
        {loading ? (
          <p className="font-sans text-sm text-text-dim">Hämtar…</p>
        ) : entries.length === 0 ? (
          <p className="font-sans text-sm text-text-dim italic">
            Inga sparade minnen ännu.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-border/60 bg-surface px-4 py-3"
              >
                <p className="font-sans text-xs text-text-dim">
                  {entry.memoryType} · styrka {entry.intensity}
                </p>
                <p className="mt-1 font-sans text-sm whitespace-pre-wrap text-text">
                  {entry.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
