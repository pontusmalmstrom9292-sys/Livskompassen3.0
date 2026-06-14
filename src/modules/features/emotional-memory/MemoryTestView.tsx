import { MemoryInputView } from '@/features/emotional-memory/components/MemoryInputView';
import { useEmotionalMemoryStore } from '@/features/emotional-memory/store/useEmotionalMemoryStore';

export function MemoryTestView() {
  const memoryContent = useEmotionalMemoryStore((state) => state.memoryContent);
  const resetMemory = useEmotionalMemoryStore((state) => state.resetMemory);

  const isEmpty = memoryContent.trim().length === 0;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display-serif text-lg tracking-[0.2em] text-accent uppercase">
          Minnestest
        </h1>
        <p className="font-sans text-sm text-text-muted">
          Fristående testvy för känslomässig minnesinmatning.
        </p>
      </header>

      <MemoryInputView />

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-2 p-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-xs tracking-[0.2em] text-text-muted uppercase">
            Aktuellt tillstånd
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
            Inget minne sparat ännu.
          </p>
        ) : (
          <p className="font-sans text-sm whitespace-pre-wrap text-text">
            {memoryContent}
          </p>
        )}
      </section>
    </div>
  );
}
