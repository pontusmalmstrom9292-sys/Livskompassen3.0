import { clsx } from 'clsx';

type CalmBreathingCircleProps = {
  /** sm = knapp-rad; md = panel-centrerad */
  size?: 'sm' | 'md';
  className?: string;
  /** Visuellt dold men läsbar för skärmläsare */
  label?: string;
};

/**
 * Lågaffektiv box-andning 4-4-4-4 (16 s cykel) — Obsidian Calm, ingen snurr-spinner.
 */
export function CalmBreathingCircle({
  size = 'md',
  className,
  label = 'Sorterar',
}: CalmBreathingCircleProps) {
  const dim = size === 'sm' ? 'h-3 w-3' : 'h-10 w-10';

  return (
    <span
      className={clsx('inline-flex shrink-0 items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span
        className={clsx(
          'calm-breath-circle rounded-full border border-accent/25 bg-accent/10',
          dim,
        )}
        aria-hidden
      />
    </span>
  );
}
