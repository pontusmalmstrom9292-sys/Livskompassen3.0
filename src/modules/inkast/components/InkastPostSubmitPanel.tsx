import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, Lock, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/design-system';
import {
  COLLECTION_LABELS,
  formatInkastResultMessage,
  inkastDestinationLink,
  primaryInkastItem,
  ROUTING_LABELS,
  VALV_SAMLA_GRANSKA_LINK,
  type SubmitInkastLiteResult,
} from '../api/inkastService';
import {
  classifyInkastOutcome,
  inkastOutcomeHeadline,
  type InkastOutcomeKind,
} from '../lib/inkastOutcome';

export type InkastPostSubmitTone = 'hem' | 'valv';

type Props = {
  result: SubmitInkastLiteResult;
  tone?: InkastPostSubmitTone;
  onOpenReviewQueue?: () => void;
  queueHintAsButton?: boolean;
  children?: ReactNode;
};

const OUTCOME_STYLES: Record<
  InkastOutcomeKind,
  { border: string; bg: string; icon: typeof Shield; iconClass: string }
> = {
  queued: {
    border: 'border-accent/30',
    bg: 'bg-surface-2/70',
    icon: Clock,
    iconClass: 'text-accent',
  },
  worm: {
    border: 'border-success/30',
    bg: 'bg-success/5',
    icon: Lock,
    iconClass: 'text-success',
  },
  persisted: {
    border: 'border-success/25',
    bg: 'bg-success/5',
    icon: CheckCircle2,
    iconClass: 'text-success',
  },
  failed: {
    border: 'border-danger/30',
    bg: 'bg-danger/5',
    icon: AlertCircle,
    iconClass: 'text-danger',
  },
  mixed: {
    border: 'border-accent/25',
    bg: 'bg-surface-2/60',
    icon: Shield,
    iconClass: 'text-accent',
  },
};

function OutcomeBody({
  kind,
  result,
  tone,
  onOpenReviewQueue,
  queueHintAsButton,
}: {
  kind: InkastOutcomeKind;
  result: SubmitInkastLiteResult;
  tone: InkastPostSubmitTone;
  onOpenReviewQueue?: () => void;
  queueHintAsButton?: boolean;
}) {
  const primary = primaryInkastItem(result);
  const destinationLink = inkastDestinationLink(primary);
  const detail = formatInkastResultMessage(result);
  const showQueueCta = result.queued > 0 || result.items.some((i) => i.action === 'queued');

  if (kind === 'queued') {
    return (
      <>
        <p className="text-xs leading-relaxed text-text-muted">
          Inget sparas i arkiv förrän du godkänner i granskningskö. Ta din tid — inga påminnelser.
        </p>
        <p className="text-xs text-text-muted">{detail}</p>
        {showQueueCta &&
          (queueHintAsButton && onOpenReviewQueue ? (
            <Button variant="secondary" size="sm" className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={onOpenReviewQueue}>
              Öppna granskningskö
            </Button>
          ) : (
            <Link
              to={VALV_SAMLA_GRANSKA_LINK}
              className="inline-block text-xs text-accent underline-offset-2 hover:underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {tone === 'valv' ? 'Granska i Samla' : 'Granska i Arkiv (efter PIN)'}
            </Link>
          ))}
      </>
    );
  }

  if (kind === 'worm') {
    return (
      <>
        <p className="text-xs leading-relaxed text-text-muted">
          Posten är låst permanent. Beteende och datum — kan inte raderas. Granska texten i arkivet om
          du vill dubbelkolla formuleringen.
        </p>
        <p className="text-xs text-text-muted">{detail}</p>
        {destinationLink && (
          <Link
            to={{ pathname: destinationLink.pathname, search: destinationLink.search }}
            className="inline-block text-xs text-accent underline-offset-2 hover:underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {destinationLink.label}
          </Link>
        )}
      </>
    );
  }

  if (kind === 'failed') {
    return (
      <>
        <p className="text-xs text-text-muted">Inget material nådde arkivet. Försök igen eller klistra in manuellt.</p>
        {result.errors.length > 0 && (
          <ul className="space-y-1 text-xs text-danger/90">
            {result.errors.map((e) => (
              <li key={`${e.fileName}-${e.error}`}>
                {e.fileName}: {e.error}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <>
      <p className="text-xs text-text-muted">{detail}</p>
      {result.queued > 0 && (
        <p className="text-xs text-text-muted">
          {result.queued} post{result.queued === 1 ? '' : 'er'} väntar fortfarande granskning.
        </p>
      )}
      {showQueueCta && result.queued > 0 && (
        <Link
          to={VALV_SAMLA_GRANSKA_LINK}
          className="inline-block text-xs text-accent underline-offset-2 hover:underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          Öppna granskningskö
        </Link>
      )}
      {destinationLink && primary.action === 'persisted' && (
        <Link
          to={{ pathname: destinationLink.pathname, search: destinationLink.search }}
          className="inline-block text-xs text-accent underline-offset-2 hover:underline min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {destinationLink.label}
        </Link>
      )}
      {kind === 'mixed' && result.items.length > 1 && (
        <ul className="mt-1 space-y-1 text-[11px] text-text-muted">
          {result.items.map((item) => {
            const dest =
              item.collection && COLLECTION_LABELS[item.collection]
                ? COLLECTION_LABELS[item.collection]
                : ROUTING_LABELS[item.classification.routing];
            const status = item.action === 'queued' ? 'väntar granskning' : `sparad (${dest})`;
            return (
              <li key={`${item.fileId}-${item.fileName}`}>
                {item.fileName}: {status}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/** Enhetlig post-upload-status efter submitInkastLite — queued vs WORM vs övrigt. */
export function InkastPostSubmitPanel({
  result,
  tone = 'hem',
  onOpenReviewQueue,
  queueHintAsButton = false,
  children,
}: Props) {
  const kind = classifyInkastOutcome(result);
  const styles = OUTCOME_STYLES[kind];
  const Icon = styles.icon;
  const headline = inkastOutcomeHeadline(result);

  return (
    <div
      className={clsx(
        'mt-3 space-y-2 rounded-xl border px-3 py-3',
        styles.border,
        styles.bg,
        tone === 'valv' ? 'text-xs' : 'text-sm',
      )}
      role="status"
    >
      <p className="flex items-start gap-2 font-medium text-text-muted">
        <Icon className={clsx('mt-0.5 h-4 w-4 shrink-0', styles.iconClass)} aria-hidden />
        <span>{headline}</span>
      </p>
      <OutcomeBody
        kind={kind}
        result={result}
        tone={tone}
        onOpenReviewQueue={onOpenReviewQueue}
        queueHintAsButton={queueHintAsButton}
      />
      {children}
    </div>
  );
}

/** Lugn toast-copy — ersätter förvirrande meddelanden i CapturePanel. */
export function toastMessageForInkastResult(result: SubmitInkastLiteResult): {
  level: 'info' | 'success' | 'error';
  text: string;
} {
  const kind = classifyInkastOutcome(result);
  if (kind === 'queued') {
    return { level: 'info', text: 'I granskningskö — inget arkiv förrän du godkänner.' };
  }
  if (kind === 'worm') {
    return { level: 'success', text: 'Bevis låst i arkivet.' };
  }
  if (kind === 'failed') {
    return { level: 'error', text: 'Inkast misslyckades — inget sparades.' };
  }
  if (kind === 'mixed') {
    return { level: 'info', text: 'Delvis klart — se status i panelen.' };
  }
  return { level: 'success', text: 'Sparat i rätt silo.' };
}
