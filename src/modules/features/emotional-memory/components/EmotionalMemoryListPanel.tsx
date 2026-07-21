import { Loader2, Lock } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { listEmotionalMemories } from '@/core/firebase/emotionalMemoryFirestore';
import type { EmotionalMemoryRow, EmotionalMemoryType } from '@/core/types/firestore';
import { EmptyState } from '@/core/ui/EmptyState';
import { formatDisplayDate } from '@/shared/utils/dateHelpers';

const MEMORY_TYPE_LABELS: Record<EmotionalMemoryType, string> = {
  freeform: 'Fritt',
  feeling: 'Känsla',
  reflection: 'Reflektion',
  identity: 'Identitet',
};

const COPY = {
  title: 'Mina känslominnen',
  lead: 'Skrivskyddade poster — kan inte ändras (WORM).',
  loading: 'Hämtar minnen…',
  empty: 'Inga sparade minnen ännu.',
  emptyTitle: 'Tomt här',
  login: 'Logga in med verifierad e-post för att se dina minnen.',
} as const;

type EmotionalMemoryListPanelProps = {
  userId: string | undefined;
  limit?: number;
  /** Öka efter nytt sparat minne för att ladda om listan. */
  refreshToken?: number;
  compact?: boolean;
};

export function EmotionalMemoryListPanel({
  userId,
  limit = 10,
  refreshToken = 0,
  compact = false,
}: EmotionalMemoryListPanelProps) {
  const [entries, setEntries] = useState<EmotionalMemoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshEntries = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await listEmotionalMemories(userId, { limit });
      setEntries(rows);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    void refreshEntries();
  }, [refreshEntries, refreshToken]);

  if (!userId) {
    return <EmptyState message={COPY.login} className={compact ? 'p-4' : undefined} />;
  }

  return (
    <section
      className={`calm-card flex flex-col gap-3 ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
      aria-busy={loading}
      aria-label={COPY.title}
    >
      <header className="flex flex-col gap-1">
        <h3 className="font-display-serif text-[11px] font-medium tracking-[0.2em] text-accent uppercase">
          {COPY.title}
        </h3>
        {!compact ? (
          <p className="font-sans text-xs leading-relaxed text-text-muted">{COPY.lead}</p>
        ) : null}
      </header>

      {loading ? (
        <div className="flex min-h-11 items-center gap-2 font-sans text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
          {COPY.loading}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          title={COPY.emptyTitle}
          message={COPY.empty}
          className="border-0 bg-transparent p-0 shadow-none"
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-border/40 bg-surface-2/50 px-4 py-3 shadow-[0_1px_0_color-mix(in_srgb,var(--accent-light)_6%,transparent)_inset]"
            >
              <div className="flex flex-wrap items-center gap-2 font-sans text-xs text-text-dim">
                <span>{MEMORY_TYPE_LABELS[entry.memoryType]}</span>
                <span aria-hidden>·</span>
                <span>Styrka {entry.intensity}</span>
                {entry.createdAt ? (
                  <>
                    <span aria-hidden>·</span>
                    <time dateTime={entry.createdAt}>{formatDisplayDate(entry.createdAt)}</time>
                  </>
                ) : null}
                <Lock className="ml-auto h-3 w-3 text-accent/70" aria-label="Skrivskyddat" />
              </div>
              <p className="mt-2 font-sans text-sm leading-relaxed whitespace-pre-wrap text-text">
                {entry.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
