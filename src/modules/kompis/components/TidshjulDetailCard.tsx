import { BentoCard } from '../../core/ui/BentoCard';
import type { KampsparEntryRow } from '../../core/types/firestore';
import { formatTidshjulLabel } from '../utils/tidshjulTimeline';

type Props = {
  entry: KampsparEntryRow | null;
};

export function TidshjulDetailCard({ entry }: Props) {
  if (!entry) {
    return (
      <BentoCard title="Post" description="Klicka en nod i Tidshjulet">
        <p className="text-sm text-text-dim">Välj en punkt på ringen för att läsa hela Minne-posten.</p>
      </BentoCard>
    );
  }

  return (
    <BentoCard
      title={entry.title}
      description={`${formatTidshjulLabel(entry)}${entry.category ? ` · ${entry.category}` : ''}`}
    >
      {entry.entryType && (
        <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">{entry.entryType}</p>
      )}
      <p className="whitespace-pre-wrap text-sm text-text-muted">{entry.content}</p>
      {entry.tags && entry.tags.length > 0 && (
        <p className="mt-3 text-xs text-text-dim">Taggar: {entry.tags.join(', ')}</p>
      )}
      {entry.source && (
        <p className="mt-1 text-xs text-text-dim">Källa: {entry.source}</p>
      )}
    </BentoCard>
  );
}
