import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { ROUTING_LABELS } from '../inkast/api/inkastService';
import { VALV_SAMLA_GRANSKA_LINK } from '../inkast/api/inkastService';
import { listDraftsByStatus, type CaptureDraft } from './draftQueue';

function draftSummary(d: CaptureDraft): string {
  const preview = d.text.slice(0, 80);
  return preview.length < d.text.length ? `${preview}…` : preview;
}

export function ReviewQueuePanel() {
  const [reviewDrafts, setReviewDrafts] = useState<CaptureDraft[]>([]);
  const [failedDrafts, setFailedDrafts] = useState<CaptureDraft[]>([]);

  const refresh = useCallback(async () => {
    const [review, failed] = await Promise.all([
      listDraftsByStatus('review'),
      listDraftsByStatus('failed'),
    ]);
    setReviewDrafts(review);
    setFailedDrafts(failed);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const total = reviewDrafts.length + failedDrafts.length;
  if (total === 0) return null;

  return (
    <BentoCard title="Väntar lokalt" icon={<Inbox className="h-4 w-4" />}>
      <p className="mb-3 text-sm text-text-muted">
        Utkast som behöver granskning eller misslyckad sync. Molnet:{' '}
        <Link to={VALV_SAMLA_GRANSKA_LINK} className="text-gold underline-offset-2 hover:underline">
          Arkiv → granska
        </Link>
      </p>
      <ul className="space-y-2 text-sm">
        {reviewDrafts.map((d) => (
          <li key={d.id} className="rounded-xl border border-border/60 bg-surface/40 px-3 py-2">
            <span className="text-xs text-gold">
              {d.syncResult
                ? (ROUTING_LABELS[d.syncResult.classification.routing] ?? 'Granska')
                : 'Granska'}
            </span>
            <p className="text-text-muted">{draftSummary(d)}</p>
          </li>
        ))}
        {failedDrafts.map((d) => (
          <li key={d.id} className="rounded-xl border border-rose-500/30 bg-surface/40 px-3 py-2">
            <span className="text-xs text-rose-300">Misslyckades</span>
            <p className="text-text-muted">{d.errorMessage ?? draftSummary(d)}</p>
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
