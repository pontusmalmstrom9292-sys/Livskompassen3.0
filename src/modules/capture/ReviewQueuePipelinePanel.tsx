import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Inbox } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { fetchInboxQueue, type InboxQueueItem } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import {
  inkastDestinationLink,
  primaryInkastItem,
  VALV_SAMLA_GRANSKA_LINK,
} from '@/modules/inkast/api/inkastService';
import { listDraftsByStatus, type CaptureDraft } from './draftQueue';
import {
  draftFailedStatusLabel,
  draftRoutingLabel,
  inboxQueueDisplayStatus,
  inboxQueueStatusBadgeClass,
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
};

/**
 * Enhetlig G10 review-kö UX på Hem — molnet hanteras canonical i VaultSamlaHub.
 * Ingen duplicerad InboxReviewQueue utanför Valv Samla.
 */
export function ReviewQueuePipelinePanel({
  mode = 'summary',
  refreshToken = 0,
  showWhenEmpty = false,
}: Props) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [cloudItems, setCloudItems] = useState<InboxQueueItem[]>([]);
  const [reviewDrafts, setReviewDrafts] = useState<CaptureDraft[]>([]);
  const [failedDrafts, setFailedDrafts] = useState<CaptureDraft[]>([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [review, failed] = await Promise.all([
      listDraftsByStatus('review'),
      listDraftsByStatus('failed'),
    ]);
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

  const localTotal = reviewDrafts.length + failedDrafts.length;
  const cloudTotal = cloudItems.length;
  const grandTotal = localTotal + (mode === 'summary' ? cloudTotal : 0);

  if (grandTotal === 0 && !loadingCloud && !showWhenEmpty && !cloudError) return null;

  const cloudPreview = cloudItems.slice(0, CLOUD_PREVIEW_LIMIT);

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
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-text-dim">
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
            <p className="text-sm text-text-dim">
              Inget väntar just nu. Nya inkast från Planering hamnar här tills du bekräftar i{' '}
              <Link
                to={VALV_SAMLA_GRANSKA_LINK}
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                Valv → Samla
              </Link>
              .
            </p>
          )}
          {!loadingCloud && cloudTotal > 0 && (
            <>
              <p className="mb-2 text-sm text-text-muted">
                {cloudTotal} post{cloudTotal === 1 ? '' : 'er'} väntar bekräftelse. Bekräfta silo i{' '}
                <Link
                  to={VALV_SAMLA_GRANSKA_LINK}
                  className="font-medium text-accent underline-offset-2 hover:underline"
                >
                  Valv → Samla → granskningskö
                </Link>
                .
              </p>
              <ul className="space-y-2 text-sm">
                {cloudPreview.map((item) => {
                  const displayStatus = inboxQueueDisplayStatus(item);
                  return (
                    <li
                      key={item.id}
                      className="rounded-lg border border-border/50 bg-surface/40 px-3 py-2"
                    >
                      <p className="font-medium text-text">{item.fileName}</p>
                      <span className={`mt-1 inline-block ${inboxQueueStatusBadgeClass(displayStatus)}`}>
                        {inboxQueueStatusLabel(item)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {cloudTotal > CLOUD_PREVIEW_LIMIT && (
                <Link
                  to={VALV_SAMLA_GRANSKA_LINK}
                  className="mt-2 inline-block text-xs text-accent underline-offset-2 hover:underline"
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
          <p className="mb-2 text-xs uppercase tracking-wider text-text-dim">Lokalt på enheten</p>
          <ul className="space-y-2 text-sm">
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
                      className="mt-1 inline-block text-xs text-accent underline-offset-2 hover:underline"
                    >
                      {destinationLink.label}
                    </Link>
                  )}
                </li>
              );
            })}
            {failedDrafts.map((d) => (
              <li key={d.id} className="rounded-xl border border-rose-500/30 bg-surface/40 px-3 py-2">
                <span className={inboxQueueStatusBadgeClass('rejected')}>{draftFailedStatusLabel()}</span>
                <p className="mt-1 text-text-muted">{d.errorMessage ?? draftSummary(d)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </BentoCard>
    </section>
  );
}
