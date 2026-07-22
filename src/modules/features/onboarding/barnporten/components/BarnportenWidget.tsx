import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { clsx } from 'clsx';
import {
  type BarnportenWidgetVariant,
  BARNPORTEN_WIDGET_DEFAULT,
} from '../constants/barnportenWidgetVariant';
import { resolveBarnportenChildAlias } from '../constants/barnportenDeviceId';
import { useBarnportenWidgetActions } from '../hooks/useBarnportenWidgetActions';
import { useBarnportenWidgetVariant } from '../hooks/useBarnportenWidgetVariant';

type Props = {
  childAlias?: string;
  /** Override enhetsvariant (t.ex. i Storybook). */
  variant?: BarnportenWidgetVariant;
};

function BarnportenWidgetToast({ status }: { status: string | null }) {
  if (!status) return null;
  return (
    <p className="barnporten-widget__toast" role="status">
      {status}
    </p>
  );
}

function BarnportenCompassMini({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.25" opacity="0.85" />
      <path
        d="M12 5 L14.5 14.5 L12 12 L9.5 14.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Barn-widget CB1–CB4 (BARNPORTEN-SPEC).
 * Default CB2 hjärta-båge. Enkeltryck → /barnporten · långtryck → snabb avsig.
 * Monteras endast på barnporten-rutter — rör inte förälder W1 (FyrenWidgetBar).
 */
export function BarnportenWidget({ childAlias, variant: variantOverride }: Props) {
  const location = useLocation();
  const resolvedChild = childAlias ?? resolveBarnportenChildAlias();
  const { variant: storedVariant } = useBarnportenWidgetVariant();
  const variant = variantOverride ?? storedVariant ?? BARNPORTEN_WIDGET_DEFAULT;
  const { status, saving, onBarnportenRoute, longPress } = useBarnportenWidgetActions(resolvedChild);

  const { progress, isHolding, onClick, ...pressHandlers } = longPress;
  const holdStyle =
    progress > 0
      ? ({ '--barnporten-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
      : undefined;

  if (location.pathname.startsWith('/widget/inspelning')) {
    return null;
  }

  if (variant === 'none') return null;

  const tapLabel = onBarnportenRoute ? 'Håll för snabb avsig' : 'Öppna Barnporten';
  const holdClass = isHolding ? 'barnporten-widget__control--holding' : undefined;

  if (variant === 'cb2') {
    return (
      <div
        className="barnporten-widget barnporten-widget--cb2"
        aria-label="Barnporten-widget"
      >
        <BarnportenWidgetToast status={status} />
        <button
          type="button"
          disabled={saving}
          className={clsx('barnporten-widget__arc min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40', holdClass)}
          aria-label={tapLabel}
          aria-busy={saving || undefined}
          style={holdStyle}
          onClick={onClick}
          {...pressHandlers}
        >
          <Heart
            className="barnporten-widget__arc-icon h-5 w-5 fill-accent/40 text-accent-light"
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      </div>
    );
  }

  if (variant === 'cb3') {
    return (
      <div
        className="barnporten-widget barnporten-widget--cb3"
        aria-label="Barnporten-widget"
      >
        <BarnportenWidgetToast status={status} />
        <button
          type="button"
          disabled={saving}
          className={clsx('barnporten-widget__compass min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40', holdClass)}
          aria-label={tapLabel}
          aria-busy={saving || undefined}
          style={holdStyle}
          onClick={onClick}
          {...pressHandlers}
        >
          <BarnportenCompassMini className="h-4 w-4 text-accent-light" />
        </button>
      </div>
    );
  }

  return (
    <div className="barnporten-widget barnporten-widget--cb1" aria-label="Barnporten-widget">
      <BarnportenWidgetToast status={status} />
      <button
        type="button"
        disabled={saving}
        className={clsx('barnporten-widget__star min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40', holdClass)}
        aria-label={tapLabel}
        aria-busy={saving || undefined}
        style={holdStyle}
        onClick={onClick}
        {...pressHandlers}
      >
        <Star className="h-3.5 w-3.5 fill-accent/50 text-accent-light" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}
