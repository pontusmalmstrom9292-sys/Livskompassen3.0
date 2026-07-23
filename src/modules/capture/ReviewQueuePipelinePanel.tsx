import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Inbox } from 'lucide-react';
import { Button, Badge } from '@/design-system';
import { EmptyState } from '@/core/ui/EmptyState';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { useStore } from '@/core/store';
import { fetchInboxQueue, type InboxQueueItem } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import {
  inkastDestinationLink,
  PLANERING_HANDLING_LINK,
  primaryInkastItem,
  VALV_SAMLA_GRANSKA_LINK,
} from '@/modules/inkast/api/inkastService';
import { isPlaneringInboxItem, sortInboxForPlaneringInkorg } from '@/modules/inkast/planeringInboxItem';
import { retryCaptureDraft } from './captureDraftSync';
import { CalmBreathingCircle } from './components/CalmBreathingCircle';
import { listDraftsByStatus, type CaptureDraft } from './draftQueue';
import {
  draftFailedStatusLabel,
  draftPendingStatusLabel,
  draftRoutingLabel,
  inboxQueueDisplayStatus,
  inboxQueueStatusBadgeVariant,
  inboxQueueStatusLabel,
} from './reviewQueuePipeline';

const CLOUD_PREVIEW_LIMIT = 3;

function draftSummary(d: CaptureDraft): string {
  const preview = d.text.slice(0, 80);
  return preview.length < d.text.length ? `${preview}…` : preview;
}

export type ReviewQueuePipelineMode = 'summary' | 'local-only';

type Props = {
  /** summary = Hem (molnet + lokalt); local-only = bakåtkompat wrapper */
  mode?: ReviewQueuePipelineMode;
  /** Öka efter nytt inkast så listan uppdateras. */
  refreshToken?: number;
  /** Planering: visa alltid sektionen även när kön är tom (tom-state + Valv-länk). */
  showWhenEmpty?: boolean;
  /** Planering inkorg: planering-taggade poster först i molnet-preview. */
  prioritizePlanering?: boolean;
};

/**
 * Enhetlig G10 review-kö UX på Hem — molnet hanteras canonical i VaultSamlaHub.
 * Ingen duplicerad InboxReviewQueue utanför Valv Samla.
 */
export function ReviewQueuePipelinePanel({
  mode = 'summary',
  refreshToken = 0,
  showWhenEmpty = false,
  prioritizePlanering = false,
}: Props) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [cloudItems, setCloudItems] = useState<InboxQueueItem[]>([]);
  const [pendingDrafts, setPendingDrafts] = useState<CaptureDraft[]>([]);
  const [reviewDrafts, setReviewDrafts] = useState<CaptureDraft[]>([]);
  const [failedDrafts, setFailedDrafts] = useState<CaptureDraft[]>([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [pending, review, failed] = await Promise.all([
      listDraftsByStatus('pending'),
      listDraftsByStatus('review'),
      listDraftsByStatus('failed'),
    ]);
    setPendingDrafts(pending);
    setReviewDrafts(review);
    setFailedDrafts(failed);

    if (mode === 'summary' && isAuthenticated) {
      setLoadingCloud(true);
      setCloudError(null);
      try {
        setCloudItems(await fetchInboxQueue());
      } catch (err) {
        setCloudItems([]);
        setCloudError(err instanceof Error ? err.message : 'Kunde inte ladda molnet.');
      } finally {
        setLoadingCloud(false);
      }
    }
  }, [isAuthenticated, mode]);

  useEffect(() => {
    void refresh();
  }, [refresh, refreshToken]);

  const handleRetry = useCallback(
    async (draftId: string) => {
      setRetryingId(draftId);
      try {
        await retryCaptureDraft(draftId);
        await refresh();
      } finally {
        setRetryingId(null);
      }
    },
    [refresh],
  );

  const localTotal = pendingDrafts.length + reviewDrafts.length + failedDrafts.length;
  const cloudTotal = cloudItems.length;
  const grandTotal = localTotal + (mode === 'summary' ? cloudTotal : 0);
  const sortedCloudItems = prioritizePlanering
    ? sortInboxForPlaneringInkorg(cloudItems)
    : cloudItems;
  const cloudPreview = sortedCloudItems.slice(0, CLOUD_PREVIEW_LIMIT);
  const planeringCloudCount = cloudItems.filter(isPlaneringInboxItem).length;

  if (grandTotal === 0 && !loadingCloud && !showWhenEmpty && !cloudError) return null;

  return (
    <section id="planering-inkast-ko" className="scroll-mt-28">
      <BentoCard
        title="Granskningskö · G10"
        description="Lokalt utkast + molnet (HITL i Valv Samla)"
        icon={<Inbox className="h-4 w-4 text-accent" />}
        glow="gold"
      >
      {mode === 'summary' && isAuthenticated && (
        <section className="mb-4 rounded-xl border border-border/40 bg-surface/30 px-3 py-3">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted">
            <Cloud className="h-3.5 w-3.5 text-accent/80" aria-hidden />
            Molnet
          </div>
          {loadingCloud && <p className="text-sm text-text-muted">Laddar molnet…</p>}
          {cloudError && !loadingCloud && (
            <p className="text-sm text-amber-400/90" role="alert">
              {cloudError}
            </p>
          )}
          {!loadingCloud && !cloudError && cloudTotal === 0 && (
            <EmptyState
              title="Tom kö"
              message="Inget väntar just nu. Nya inkast från Planering hamnar här tills du bekräftar i Valv → Samla eller skapar uppgift via → Handling."
              action={
                <Link
                  to={VALV_SAMLA_GRANSKA_LINK}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  Öppna Valv → Samla
                </Link>
              }
            />
          )}
          {!loadingCloud && cloudTotal > 0 && (
            <>
              <p className="mb-2 text-sm text-text-muted">
                {cloudTotal} post{cloudTotal === 1 ? '' : 'er'} väntar bekräftelse.
                {prioritizePlanering && planeringCloudCount > 0
                  ? ` ${planeringCloudCount} planering${planeringCloudCount === 1 ? '' : 'ar'}.`
                  : ''}{' '}
                Bekräfta silo eller{' '}
                <strong className="font-medium text-text">→ Handling</strong> i{' '}
                <Link
                  to={VALV_SAMLA_GRANSKA_LINK}
                  className="font-medium text-accent underline-offset-2 hover:underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  Valv → Samla → granskningskö
                </Link>
                .
              </p>
              {prioritizePlanering && planeringCloudCount > 0 && (
                <Link
                  to={PLANERING_HANDLING_LINK}
                  className="mb-2 inline-block text-xs text-accent underline-offset-2 hover:underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  Öppna Handling (Kanban)
                </Link>
              )}
              <ul className="relative space-y-0 border-l border-border/40 pl-4">
                {cloudPreview.map((item) => {
                  const displayStatus = inboxQueueDisplayStatus(item);
                  return (
                    <li key={item.id} className="relative pb-3 last:pb-0">
                      <span
                        className="absolute -left-[9px] top-3 h-2 w-2 rounded-full bg-accent/70"
                        aria-hidden
                      />
                      <TimelineEntry
                        as="div"
                        meta={`${inboxQueueStatusLabel(item)} · ${displayStatus}`}
                        body={item.fileName}
                        truncateAt={120}
                      />
                    </li>
                  );
                })}
              </ul>
              {cloudTotal > CLOUD_PREVIEW_LIMIT && (
                <Link
                  to={VALV_SAMLA_GRANSKA_LINK}
                  className="mt-2 inline-block text-xs text-accent underline-offset-2 hover:underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  Visa alla ({cloudTotal}) i Valv
                </Link>
              )}
            </>
          )}
        </section>
      )}

      {localTotal > 0 && (
        <section className="rounded-xl border border-border/40 bg-surface/30 px-3 py-3">
          <p className="mb-2 text-xs uppercase tracking-wider text-text-muted">Lokalt på enheten</p>
          <ul className="space-y-2 text-sm">
            {pendingDrafts.map((d) => (
              <li key={d.id} className="rounded-xl border border-accent/20 bg-surface/40 px-3 py-2">
                <Badge variant={inboxQueueStatusBadgeVariant('review')} className="text-[10px] uppercase tracking-wider">
                  {draftPendingStatusLabel()}
                </Badge>
                <p className="mt-1 text-text-muted">{draftSummary(d)}</p>
                {d.errorMessage && (
                  <p className="mt-1 text-xs text-amber-400/90">{d.errorMessage}</p>
                )}
                {retryingId === d.id ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-text-muted">
                    <CalmBreathingCircle size="sm" label="Synkar" />
                    Synkar…
                  </span>
                ) : (
                  <Button variant="ghost" size="sm" className="mt-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={() => void handleRetry(d.id)}>
                    Försök igen
                  </Button>
                )}
              </li>
            ))}
            {reviewDrafts.map((d) => {
              const primary = d.syncResult ? primaryInkastItem(d.syncResult) : null;
              const destinationLink = primary ? inkastDestinationLink(primary) : null;
              return (
                <li key={d.id} className="rounded-xl border border-border/60 bg-surface/40 px-3 py-2">
                  <span className="text-xs text-accent">
                    {primary
                      ? draftRoutingLabel(primary.classification.routing)
                      : 'Granska'}
                  </span>
                  <p className="text-text-muted">{draftSummary(d)}</p>
                  {destinationLink && (
                    <Link
                      to={{ pathname: destinationLink.pathname, search: destinationLink.search }}
                      className="mt-1 inline-block text-xs text-accent underline-offset-2 hover:underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      {destinationLink.label}
                    </Link>
                  )}
                </li>
              );
            })}
            {failedDrafts.map((d) => (
              <li key={d.id} className="rounded-xl border border-danger/20 bg-danger/5 px-3 py-2">
                <Badge variant={inboxQueueStatusBadgeVariant('rejected')} className="text-[10px] uppercase tracking-wider">
                  {draftFailedStatusLabel()}
                </Badge>
                <p className="mt-1 text-text-muted">{d.errorMessage ?? draftSummary(d)}</p>
                {retryingId === d.id ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-text-muted">
                    <CalmBreathingCircle size="sm" label="Synkar" />
                    Synkar…
                  </span>
                ) : (
                  <Button variant="ghost" size="sm" className="mt-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={() => void handleRetry(d.id)}>
                    Försök igen
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </BentoCard>
    </section>
  );
}
