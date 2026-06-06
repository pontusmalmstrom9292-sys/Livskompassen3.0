import type { VitEntryRow } from '@/core/types/firestore';
import { vitProjectTitle } from '@/features/dailyLife/wellbeing/mabra/lib/vitHubStats';

const KIND_LABELS = {
  card: 'Frågekort',
  memory: 'Känslominne',
  chat_turn: 'Dialog',
} as const;

function formatEntryDate(entry: VitEntryRow): string {
  return entry.cardDateKey ?? entry.createdAt?.slice(0, 10) ?? '—';
}

type Props = {
  entries: VitEntryRow[];
  emptyMessage: string;
  maxHeightClass?: string;
};

export function VitEntryList({ entries, emptyMessage, maxHeightClass = 'max-h-80' }: Props) {
  if (entries.length === 0) {
    return <p className="mt-2 text-sm text-text-dim">{emptyMessage}</p>;
  }

  return (
    <ul className={`calm-scroll-island mt-3 space-y-2 overflow-y-auto pr-1 ${maxHeightClass}`}>
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="rounded-lg border border-border-strong/60 bg-surface-2/40 px-3 py-2 text-sm"
        >
          <p className="text-[10px] uppercase tracking-wide text-text-dim">
            {vitProjectTitle(entry.projectId)} · {KIND_LABELS[entry.kind]} · {entry.bankId} ·{' '}
            {formatEntryDate(entry)}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-text-muted">
            {entry.responseText?.trim() || '— (inget skrivet svar)'}
          </p>
        </li>
      ))}
    </ul>
  );
}
