import { useCallback, useEffect, useState } from 'react';
import { Inbox } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import {
  confirmInbox,
  dismissInbox,
  fetchInboxQueue,
  type InboxQueueItem,
} from '../api/inboxService';

const ROUTING_LABELS: Record<string, string> = {
  kunskap: 'Kunskap',
  bevis: 'Bevis (Valv)',
  barnen: 'Barnen',
  review: 'Granska',
};

export function InboxQueueCard() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [items, setItems] = useState<InboxQueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchInboxQueue());
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda inkorgen.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirm = async (
    item: InboxQueueItem,
    routing: 'kunskap' | 'bevis' | 'barnen'
  ) => {
    setBusyId(item.id);
    setError(null);
    try {
      await confirmInbox(
        item.id,
        routing,
        routing === 'barnen' ? item.childAlias ?? 'Kasper' : undefined
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bekräftelse misslyckades.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDismiss = async (item: InboxQueueItem) => {
    setBusyId(item.id);
    setError(null);
    try {
      await dismissInbox(item.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Avvisning misslyckades.');
    } finally {
      setBusyId(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <BentoCard
      title="Inkorg — granska"
      description="G10 självsortering · HITL"
      icon={<Inbox className="h-4 w-4 text-accent" />}
    >
      <p className="mb-3 text-xs text-text-dim">
        Drive-filer med oklar silo eller trauma hamnar här. Bevis sparas aldrig automatiskt i
        Kunskap.
      </p>

      {loading && <p className="text-sm text-text-muted">Laddar…</p>}
      {error && <p className="text-sm text-amber-400/90">{error}</p>}

      {!loading && items.length === 0 && (
        <p className="text-sm text-text-dim">Ingen väntande post i inkorgen.</p>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-border/60 bg-surface/40 px-3 py-3 text-sm"
          >
            <p className="font-medium text-text">{item.fileName}</p>
            <p className="mt-1 text-xs text-text-muted">
              Förslag: {ROUTING_LABELS[item.proposedRouting] ?? item.proposedRouting}
              {item.traumaSensitive ? ' · trauma' : ''} · {Math.round(item.confidence * 100)}%
            </p>
            <p className="mt-2 text-xs text-text-dim line-clamp-2">{item.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === item.id}
                className="btn-pill--secondary text-xs"
                onClick={() => handleConfirm(item, 'bevis')}
              >
                → Bevis
              </button>
              <button
                type="button"
                disabled={busyId === item.id}
                className="btn-pill--secondary text-xs"
                onClick={() => handleConfirm(item, 'kunskap')}
              >
                → Kunskap
              </button>
              <button
                type="button"
                disabled={busyId === item.id}
                className="btn-pill--secondary text-xs"
                onClick={() => handleConfirm(item, 'barnen')}
              >
                → Barnen
              </button>
              <button
                type="button"
                disabled={busyId === item.id}
                className="btn-pill--ghost text-xs"
                onClick={() => handleDismiss(item)}
              >
                Avvisa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
