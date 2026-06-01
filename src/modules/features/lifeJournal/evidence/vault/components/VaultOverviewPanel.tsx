import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, Clock, Inbox } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { listDraftsByStatus } from '@/modules/capture/draftQueue';

type Props = {
  pendingInbox: number | null;
  onOpenReview: () => void;
};

/** Arkiv-översikt — granskning + lokala utkast (en skärm, inga extra flikar). */
export function VaultOverviewPanel({ pendingInbox, onOpenReview }: Props) {
  const [localPending, setLocalPending] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        const [pending, review, failed] = await Promise.all([
          listDraftsByStatus('pending'),
          listDraftsByStatus('review'),
          listDraftsByStatus('failed'),
        ]);
        setLocalPending(pending.length + review.length + failed.length);
      } catch {
        setLocalPending(0);
      }
    })();
  }, [pendingInbox]);

  return (
    <BentoCard title="Arkiv-översikt" icon={<Archive className="h-4 w-4" />}>
      <ul className="space-y-2 text-sm text-text-muted">
        <li className="flex items-center gap-2">
          <Inbox className="h-3.5 w-3.5 text-gold" aria-hidden />
          Granskning i molnet
          {pendingInbox != null && pendingInbox > 0 ? (
            <button type="button" className="text-gold underline-offset-2 hover:underline" onClick={onOpenReview}>
              {pendingInbox} väntar
            </button>
          ) : (
            <span className="text-text-dim">— inget väntar</span>
          )}
        </li>
        {localPending > 0 && (
          <li className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-gold" aria-hidden />
            Lokala utkast: {localPending}
          </li>
        )}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Link to={vaultDrawerPath('monster')} className="text-accent/80 underline-offset-2 hover:underline">
          Mönster
        </Link>
        <Link to={vaultDrawerPath('orkester')} className="text-accent/80 underline-offset-2 hover:underline">
          Orkester
        </Link>
        <Link to={vaultDrawerPath('dossier')} className="text-accent/80 underline-offset-2 hover:underline">
          Rapporter
        </Link>
      </div>
    </BentoCard>
  );
}
