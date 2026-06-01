import { useCallback, useEffect, useState } from 'react';
import { Inbox } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '../../core/store';
import {
  confirmInbox,
  dismissInbox,
  fetchInboxQueue,
  type InboxQueueItem,
} from '../../evidence/kompis/api/inboxService';

const ROUTING_LABELS: Record<string, string> = {
  kunskap: 'Kunskap',
  bevis: 'Bevis (Valv)',
  barnen: 'Barnen',
  review: 'Granska',
};

function queueStatusLabel(item: InboxQueueItem): string {
  const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
  if (item.proposedRouting === 'review' || confidence < 0.75) {
    return 'Status: granska';
  }
  return `Status: förslag → ${ROUTING_LABELS[item.proposedRouting] ?? item.proposedRouting}`;
}

type Props = {
  compact?: boolean;
  /** Valv Samla: sortera bevis/review först */
  prioritizeBevis?: boolean;
  /** Efter bekräftad routing till reality_vault */
  onBevisConfirmed?: (docId: string) => void;
  onBack?: () => void;
};

function sortForValvSamla(items: InboxQueueItem[]): InboxQueueItem[] {
  const score = (item: InboxQueueItem) => {
    const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
    if (item.proposedRouting === 'bevis') return 0;
    if (item.proposedRouting === 'review' || confidence < 0.75) return 1;
    if (item.traumaSensitive) return 2;
    return 3;
  };
  return [...items].sort((a, b) => score(a) - score(b));
}

/** G10 HITL-kö — godkänn/avvisa innan material når Valv eller Kunskap (U1). */
export function InboxReviewQueue({
  compact = false,
  prioritizeBevis = false,
  onBevisConfirmed,
  onBack,
}: Props) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [items, setItems] = useState<InboxQueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

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
    routing: 'kunskap' | 'bevis' | 'barnen',
  ) => {
    setBusyId(item.id);
    setError(null);
    setLastAction(null);
    try {
      const result = await confirmInbox(
        item.id,
        routing,
        routing === 'barnen' ? item.childAlias ?? 'Kasper' : undefined,
      );
      setLastAction(`Routed till ${result.collection} · ${result.docId.slice(0, 8)}…`);
      if (routing === 'bevis' && result.collection === 'reality_vault' && result.docId) {
        onBevisConfirmed?.(result.docId);
      }
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
    setLastAction(null);
    try {
      await dismissInbox(item.id);
      setLastAction('Avvisad — sparades inte i någon silo.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Avvisning misslyckades.');
    } finally {
      setBusyId(null);
    }
  };

  if (!isAuthenticated) return null;

  const displayItems = prioritizeBevis ? sortForValvSamla(items) : items;

  return (
    <BentoCard
      title={compact ? 'Granskningskö' : prioritizeBevis ? 'Granskningskö · Samla' : 'Inkorg — granska'}
      description="G10 · routed / review / rejected"
      icon={<Inbox className="h-4 w-4 text-accent" />}
    >
      {onBack && (
        <button type="button" className="btn-pill--ghost mb-3 text-xs" onClick={onBack}>
          ← Tillbaka till logga
        </button>
      )}
      {!compact && (
        <p className="mb-3 text-xs text-text-dim">
          Drive och oklara filer hamnar här. Bekräfta silo innan Valv eller Kunskap — ingen
          cross-RAG.
          {prioritizeBevis ? ' Bevis-förslag visas först.' : ''}
        </p>
      )}

      {loading && <p className="text-sm text-text-muted">Laddar…</p>}
      {error && <p className="text-sm text-amber-400/90">{error}</p>}
      {lastAction && <p className="mb-2 text-xs text-success">{lastAction}</p>}

      {!loading && displayItems.length === 0 && (
        <p className="text-sm text-text-dim">Ingen väntande post i granskningskön.</p>
      )}

      <ul className="space-y-3">
        {displayItems.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-border/60 bg-surface/40 px-3 py-3 text-sm"
          >
            <p className="font-medium text-text">{item.fileName}</p>
            <p className="mt-1 text-xs text-accent/90">{queueStatusLabel(item)}</p>
            <p className="mt-1 text-xs text-text-muted">
              {item.traumaSensitive ? 'Trauma · ' : ''}
              Säkerhet {Math.round((typeof item.confidence === 'number' ? item.confidence : 0) * 100)}%
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
