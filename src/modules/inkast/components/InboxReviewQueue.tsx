import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '../../core/store';
import {
  confirmInbox,
  dismissInbox,
  fetchInboxQueue,
  type InboxQueueItem,
} from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { createPlanningTask } from '@/features/admin/planning/api/planningTasksApi';
import { usePlanningEmailRules } from '@/features/admin/planning/hooks/usePlanningEmailRules';
import { PLANERING_HANDLING_LINK } from '@/modules/inkast/api/inkastService';
import {
  classifyInboxItemForHandling,
  isPlaneringInboxItem,
} from '@/modules/inkast/planeringInboxItem';
import {
  inboxQueueDisplayStatus,
  inboxQueueStatusBadgeClass,
  inboxQueueStatusLabel,
  sortInboxForValvSamla,
} from '@/modules/capture/reviewQueuePipeline';
import {
  InkastBarnenValvBridge,
  resolveInkastChildAlias,
  type InkastBarnenBridgePayload,
} from './InkastBarnenValvBridge';
import {
  InkastDagbokWeaveBridge,
  inboxDagbokWeaveProps,
  type InkastDagbokWeavePayload,
} from './InkastDagbokWeaveBridge';

type Props = {
  compact?: boolean;
  /** Valv Samla: sortera bevis/review först */
  prioritizeBevis?: boolean;
  /** Efter bekräftad routing till reality_vault */
  onBevisConfirmed?: (docId: string) => void;
  onBack?: () => void;
};

/** G10 HITL-kö — godkänn/avvisa innan material når Valv eller Kunskap (U1). */

function collectionLabel(collection: string): string {
  if (collection === 'reality_vault') return 'bevis';
  if (collection === 'children_logs') return 'barnloggar';
  if (collection === 'journal') return 'dagbok';
  if (collection === 'kampspar' || collection === 'kb_docs') return 'kunskap';
  return collection;
}

export function InboxReviewQueue({
  compact = false,
  prioritizeBevis = false,
  onBevisConfirmed,
  onBack,
}: Props) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const userId = useStore((s) => s.user?.uid);
  const { rules } = usePlanningEmailRules();
  const [items, setItems] = useState<InboxQueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [barnenBridge, setBarnenBridge] = useState<InkastBarnenBridgePayload | null>(null);
  const [dagbokWeave, setDagbokWeave] = useState<InkastDagbokWeavePayload | null>(null);
  const [handlingLink, setHandlingLink] = useState(false);

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
    routing: 'kunskap' | 'bevis' | 'barnen' | 'dagbok',
  ) => {
    setBusyId(item.id);
    setError(null);
    setLastAction(null);
    setBarnenBridge(null);
    setDagbokWeave(null);
    setHandlingLink(false);
    try {
      const result = await confirmInbox(
        item.id,
        routing,
        routing === 'barnen' ? item.childAlias ?? 'Kasper' : undefined,
      );
      setLastAction(`Skickat till ${collectionLabel(result.collection)} · ${result.docId.slice(0, 8)}…`);
      if (routing === 'bevis' && result.collection === 'reality_vault' && result.docId) {
        onBevisConfirmed?.(result.docId);
      }
      if (routing === 'barnen' && result.collection === 'children_logs' && result.docId) {
        setBarnenBridge({
          childrenLogId: result.docId,
          childAlias: resolveInkastChildAlias(item.childAlias ?? undefined),
          observation: item.summary || item.fileName,
          category: item.category || 'vardag',
        });
      }
      if (routing === 'dagbok') {
        const weaveProps = inboxDagbokWeaveProps({
          collection: result.collection,
          docId: result.docId,
          summary: item.summary || item.fileName,
          analysisExcerpt: item.analysisExcerpt,
        });
        if (weaveProps) setDagbokWeave(weaveProps);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bekräftelse misslyckades.');
    } finally {
      setBusyId(null);
    }
  };

  const handlePlanering = async (item: InboxQueueItem) => {
    if (!userId) {
      setError('Logga in för att skapa uppgift.');
      return;
    }
    const classification = classifyInboxItemForHandling(item, rules);
    if (classification.routeToHamn) {
      setError('Ex/konflikt — skicka till Trygg Hamn, inte Handling.');
      return;
    }
    setBusyId(item.id);
    setError(null);
    setLastAction(null);
    setHandlingLink(false);
    try {
      await createPlanningTask(userId, {
        title: classification.title,
        summary: classification.summary,
        status: classification.suggestedStatus,
        dueAt: classification.dueAt,
        source: 'manual',
        sourceRef: `inbox_queue:${item.id}`,
      });
      await dismissInbox(item.id);
      setLastAction('Skickat till Handling · ATT GÖRA');
      setHandlingLink(true);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skapa uppgift.');
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
      setLastAction('Avvisad — sparades inte i något arkiv.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Avvisning misslyckades.');
    } finally {
      setBusyId(null);
    }
  };

  if (!isAuthenticated) return null;

  const displayItems = prioritizeBevis ? sortInboxForValvSamla(items) : items;

  return (
    <BentoCard
      title={compact ? 'Granskningskö' : prioritizeBevis ? 'Granskningskö · Samla' : 'Inkorg — granska'}
      description="Granska innan sparning i Dagbok, Valv eller Kunskap"
      icon={<Inbox className="h-4 w-4 text-accent" />}
    >
      {onBack && (
        <button type="button" className="btn-pill--ghost mb-3 text-xs" onClick={onBack}>
          ← Tillbaka till logga
        </button>
      )}
      {!compact && (
        <p className="mb-3 text-xs text-text-dim">
          Drive och oklara filer hamnar här. Bekräfta vart det ska sparas — separata arkiv.
          {prioritizeBevis ? ' Arkivförslag visas först.' : ''}
        </p>
      )}

      {loading && <p className="text-sm text-text-muted">Laddar…</p>}
      {error && <p className="text-sm text-amber-400/90">{error}</p>}
      {lastAction && <p className="mb-2 text-xs text-success">{lastAction}</p>}
      {handlingLink && (
        <Link
          to={PLANERING_HANDLING_LINK}
          className="mb-2 inline-block text-xs text-accent underline-offset-2 hover:underline"
        >
          Öppna Handling (Kanban)
        </Link>
      )}
      {barnenBridge && userId && (
        <InkastBarnenValvBridge
          userId={userId}
          {...barnenBridge}
          onDone={() => setBarnenBridge(null)}
        />
      )}
      {dagbokWeave && (
        <InkastDagbokWeaveBridge {...dagbokWeave} onDone={() => setDagbokWeave(null)} />
      )}

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
            <span
              className={`mt-1 inline-block ${inboxQueueStatusBadgeClass(inboxQueueDisplayStatus(item))}`}
            >
              {inboxQueueStatusLabel(item)}
            </span>
            <p className="mt-1 text-xs text-text-muted">
              {item.traumaSensitive ? 'Trauma · ' : ''}
              Säkerhet {Math.round((typeof item.confidence === 'number' ? item.confidence : 0) * 100)}%
            </p>
            <p className="mt-2 text-xs text-text-dim line-clamp-2">{item.summary}</p>
            {isPlaneringInboxItem(item) && (
              <p className="mt-1 text-[10px] uppercase tracking-widest text-accent/80">
                Planering · kan bli uppgift i Handling
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === item.id}
                className="btn-pill--secondary text-xs"
                onClick={() => handleConfirm(item, 'bevis')}
              >
                → Arkiv
              </button>
              <button
                type="button"
                disabled={busyId === item.id}
                className="btn-pill--secondary text-xs"
                onClick={() => handleConfirm(item, 'dagbok')}
              >
                → Dagbok
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
                className="btn-pill--accent text-xs"
                onClick={() => void handlePlanering(item)}
              >
                → Handling
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
