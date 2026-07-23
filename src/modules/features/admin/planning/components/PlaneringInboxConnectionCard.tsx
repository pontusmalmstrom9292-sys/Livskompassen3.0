import type { LucideIcon } from 'lucide-react';
import { Button } from '@/design-system';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import {
  PLANERING_INBOX_PROVIDER_META,
  type PlaneringInboxProvider,
  type PlaneringProviderConnection,
} from '../planeringInboxConnections';

type Props = {
  provider: PlaneringInboxProvider;
  icon: LucideIcon;
  connection: PlaneringProviderConnection;
  disabled?: boolean;
  onPrepare: () => void;
  onDisconnect: () => void;
};

export function PlaneringInboxConnectionCard({
  provider,
  icon: Icon,
  connection,
  disabled,
  onPrepare,
  onDisconnect,
}: Props) {
  const meta = PLANERING_INBOX_PROVIDER_META[provider];
  const prepared = connection.phase === 'prepared';

  return (
    <article
      className={clsx(
        'planering-inbox-connect',
        prepared && 'planering-inbox-connect--prepared',
      )}
    >
      <div className="planering-inbox-connect__head">
        <span className="planering-inbox-connect__icon" aria-hidden>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="planering-inbox-connect__title">{meta.title}</h3>
          <p className="planering-inbox-connect__lead">{meta.lead}</p>
        </div>
        <span
          className={clsx(
            'planering-inbox-connect__status',
            prepared && 'planering-inbox-connect__status--on',
          )}
        >
          {prepared ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              Förberedd
            </>
          ) : (
            <>
              <Circle className="h-3.5 w-3.5" aria-hidden />
              Ej kopplad
            </>
          )}
        </span>
      </div>

      {prepared && connection.accountHint ? (
        <p className="planering-inbox-connect__account">{connection.accountHint}</p>
      ) : null}

      <p className="planering-inbox-connect__note">{meta.syncNote}</p>

      {!prepared ? (
        <Button
          type="button"
          variant="accent"
          className="mt-3 w-full disabled:opacity-50 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={disabled}
          onClick={onPrepare}
        >
          {disabled ? (
            <>
              <Loader2 className="mr-1 inline h-4 w-4 animate-spin" aria-hidden />
              Logga in först
            </>
          ) : (
            'Förbered med Google-konto'
          )}
        </Button>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="planering-inbox-connect__badge">Synk kommer snart</span>
          <Button type="button" variant="ghost" size="sm" className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={onDisconnect}>
            Koppla bort
          </Button>
        </div>
      )}
    </article>
  );
}
