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
  type InboxRouting,
} from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { createPlanningTask } from '@/features/admin/planning/api/planningTasksApi';
import { usePlanningEmailRules } from '@/features/admin/planning/hooks/usePlanningEmailRules';
import { useInboxRules } from '@/features/admin/inboxRules/hooks/useInboxRules';
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
import {
  inboxReviewQueueDomainHint,
  inboxReviewQueueHitlBadge,
  inboxReviewQueueRoutingLine,
  isProposedRoutingButton,
} from '../inboxReviewQueueCopy';
import { UnifiedHitlPreview } from './UnifiedHitlPreview';
import { ROUTING_LABELS } from '../api/inkastService';
import {
  INKAST_SILO_DESCRIPTIONS,
  INKAST_SILO_LABELS,
  routingToUiSilo,
} from '../constants/inkastSiloOptions';
import { highlightPatterns } from '@/features/lifeJournal/evidence/vault/utils/vaultPatternHighlight';

type InboxConfirmRouting = 'kunskap' | 'bevis' | 'barnen' | 'dagbok';

function inboxProposedConfirmAction(
  item: InboxQueueItem,
): { type: 'routing'; routing: InboxConfirmRouting } | { type: 'planering' } | { type: 'manual' } {
  if (isPlaneringInboxItem(item)) return { type: 'planering' };
  const routing = item.proposedRouting;
  if (routing === 'bevis' || routing === 'dagbok' || routing === 'kunskap' || routing === 'barnen') {
    return { type: 'routing', routing };
  }
  return { type: 'manual' };
}

function inboxUiSiloLabel(item: InboxQueueItem): string {
  if (isPlaneringInboxItem(item)) return 'Planering (Handling)';
  const routing = item.proposedRouting as keyof typeof ROUTING_LABELS;
  return ROUTING_LABELS[routing] ?? 'Granska manuellt';
}

function inboxUiSiloHint(item: InboxQueueItem): string | undefined {
  if (isPlaneringInboxItem(item)) return INKAST_SILO_LABELS.planering;
  const routing = item.proposedRouting as InboxRouting;
  if (routing === 'review' || routing === 'planning') return undefined;
  return INKAST_SILO_LABELS[routingToUiSilo(routing)];
}

function inboxUiSiloDescription(item: InboxQueueItem): string | undefined {
  if (isPlaneringInboxItem(item)) return INKAST_SILO_DESCRIPTIONS.planering;
  const routing = item.proposedRouting as InboxRouting;
  if (routing === 'review' || routing === 'planning') return undefined;
  return INKAST_SILO_DESCRIPTIONS[routingToUiSilo(routing)];
}

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
  const { rules: inboxRules } = useInboxRules();
  const [items, setItems] = useState<InboxQueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [barnenBridge, setBarnenBridge] = useState<InkastBarnenBridgePayload | null>(null);
  const [dagbokWeave, setDagbokWeave] = useState<InkastDagbokWeavePayload | null>(null);
  const [handlingLink, setHandlingLink] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
        item.tags,
        item.category
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

  const applyInboxRules = (list: InboxQueueItem[]) => {
    if (!inboxRules || inboxRules.length === 0) return list;
    return list.map((item) => {
      const newItem = { ...item };
      for (const rule of inboxRules) {
        if (!rule.enabled) continue;
        const match = rule.matchType === 'exact' 
          ? newItem.fileName.toLowerCase() === rule.pattern.toLowerCase()
          : newItem.fileName.toLowerCase().includes(rule.pattern.toLowerCase());
        
        if (match) {
          if (rule.targetTags.length > 0) {
            newItem.tags = Array.from(new Set([...newItem.tags, ...rule.targetTags]));
          }
          if (rule.targetCategory) {
            newItem.category = rule.targetCategory;
          }
          if (rule.targetRouting) {
            newItem.proposedRouting = rule.targetRouting;
          }
        }
      }
      return newItem;
    });
  };

  const baseItems = prioritizeBevis ? sortInboxForValvSamla(items) : items;
  const displayItems = applyInboxRules(baseItems);

  return (
    <BentoCard
      title={compact ? 'Granskningskö · HITL' : prioritizeBevis ? 'Granskningskö · Samla · HITL' : 'Inkorg — granska · HITL'}
      description="HITL — du godkänner varje post innan Dagbok, Arkiv, Kunskap eller Barnen"
      icon={<Inbox className="h-4 w-4 text-accent" />}
    >
      {onBack && (
        <button type="button" className="btn-pill--ghost mb-3 text-xs" onClick={onBack}>
          ← Tillbaka till logga
        </button>
      )}
      {!compact && (
        <p className="mb-3 text-xs text-text-dim">
          Drive och oklara filer hamnar här. DCAP före AI — du väljer silo. Separata arkiv, ingen
          auto-promote barn→Valv.
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
        {displayItems.map((item) => {
          const domainHint = inboxReviewQueueDomainHint(item);
          const routingBtnClass = (routing: 'kunskap' | 'bevis' | 'barnen' | 'dagbok') =>
            isProposedRoutingButton(routing, item)
              ? 'btn-pill--accent text-xs ring-1 ring-accent/40'
              : 'btn-pill--secondary text-xs';

          return (
          <li
            key={item.id}
            className="rounded-lg border border-border/60 bg-surface/40 px-3 py-3 text-sm"
          >
            <p className="font-medium leading-relaxed text-text">
              {highlightPatterns(item.fileName).map((span, i) => (
                <span key={i} className={span.className}>
                  {span.text}
                </span>
              ))}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-block ${inboxQueueStatusBadgeClass(inboxQueueDisplayStatus(item))}`}
              >
                {inboxQueueStatusLabel(item)}
              </span>
              <span className="review-queue-status review-queue-status--review">
                {inboxReviewQueueHitlBadge(item)}
              </span>
            </div>
            <p className="mt-1 text-xs text-accent/90">{inboxReviewQueueRoutingLine(item)}</p>
            {domainHint && (
              <p className="mt-1 text-xs text-text-dim">{domainHint}</p>
            )}
            <p className="mt-1 text-xs text-text-muted">
              {item.traumaSensitive ? 'Trauma · ' : ''}
              Säkerhet {Math.round((typeof item.confidence === 'number' ? item.confidence : 0) * 100)}%
              {item.childAlias ? ` · Barn: ${item.childAlias}` : ''}
              {item.tags.length > 0 && ` · Taggar: ${item.tags.join(', ')}`}
            </p>
            <p className="mt-2 text-xs text-text-dim line-clamp-2">{item.summary}</p>
            {isPlaneringInboxItem(item) && (
              <p className="mt-1 text-[10px] uppercase tracking-widest text-accent/80">
                Planering · kan bli uppgift i Handling
              </p>
            )}
            {editingId === item.id ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === item.id}
                  className={routingBtnClass('bevis')}
                  onClick={() => {
                    void handleConfirm(item, 'bevis').then(() => setEditingId(null));
                  }}
                >
                  → Arkiv
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  className={routingBtnClass('dagbok')}
                  onClick={() => {
                    void handleConfirm(item, 'dagbok').then(() => setEditingId(null));
                  }}
                >
                  → Dagbok
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  className={routingBtnClass('kunskap')}
                  onClick={() => {
                    void handleConfirm(item, 'kunskap').then(() => setEditingId(null));
                  }}
                >
                  → Kunskap
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  className={routingBtnClass('barnen')}
                  onClick={() => {
                    void handleConfirm(item, 'barnen').then(() => setEditingId(null));
                  }}
                >
                  → Barnen
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  className="btn-pill--accent text-xs"
                  onClick={() => {
                    void handlePlanering(item).then(() => setEditingId(null));
                  }}
                >
                  → Handling
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  className="btn-pill--ghost text-xs"
                  onClick={() => setEditingId(null)}
                >
                  Tillbaka
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <UnifiedHitlPreview
                  hitlBadge={inboxReviewQueueHitlBadge(item)}
                  siloLabel={inboxUiSiloLabel(item)}
                  siloHint={inboxUiSiloHint(item)}
                  siloDescription={inboxUiSiloDescription(item)}
                  confidencePct={Math.round(
                    (typeof item.confidence === 'number' ? item.confidence : 0) * 100,
                  )}
                  summary={item.summary}
                  busy={busyId === item.id}
                  onConfirm={() => {
                    const action = inboxProposedConfirmAction(item);
                    if (action.type === 'routing') {
                      void handleConfirm(item, action.routing);
                      return;
                    }
                    if (action.type === 'planering') {
                      void handlePlanering(item);
                      return;
                    }
                    setEditingId(item.id);
                  }}
                  onEdit={() => setEditingId(item.id)}
                  onDismiss={() => void handleDismiss(item)}
                  panelClass="bg-surface/30"
                />
              </div>
            )}
          </li>
          );
        })}
      </ul>
    </BentoCard>
  );
}
