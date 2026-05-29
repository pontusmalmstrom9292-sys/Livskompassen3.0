import { useId } from 'react';
import { clsx } from 'clsx';
import { LivskompassMark } from './LivskompassMark';

type Props = {
  className?: string;
  /** Meny/header: ikon vänster, text höger. */
  layout?: 'stack' | 'inline';
  /** @deprecated Använd `layout="inline"` */
  compactScale?: boolean;
};

/** Guldlogga D1 — vertikal (stack) eller horisontell (header/meny). */
export function LivskompassBrandLockup({ className, layout, compactScale }: Props) {
  const uid = useId().replace(/:/g, '');
  const gold = `lk-lockup-gold-${uid}`;
  const resolvedLayout = layout ?? (compactScale ? 'inline' : 'stack');
  const isInline = resolvedLayout === 'inline';

  return (
    <div
      className={clsx(
        'livskompass-brand-lockup',
        isInline
          ? 'livskompass-brand-lockup--inline flex flex-row items-center gap-3 sm:gap-3.5'
          : 'flex flex-col items-center',
        className,
      )}
      aria-hidden
    >
      <LivskompassMark
        className={clsx(
          'livskompass-brand-lockup__mark shrink-0',
          isInline ? 'h-10 w-10 sm:h-11 sm:w-11' : 'h-9 w-9 sm:h-10 sm:w-10',
        )}
      />
      <span
        className={clsx(
          'livskompass-brand-lockup__title uppercase',
          isInline
            ? 'livskompass-brand-lockup__title--inline whitespace-nowrap text-[1.05rem] font-bold leading-none tracking-[0.26em] sm:text-[1.15rem] sm:tracking-[0.3em] md:text-[1.22rem] md:tracking-[0.34em]'
            : 'text-[0.62rem] font-light tracking-[0.22em] sm:text-[0.68rem]',
        )}
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
      >
        Livskompassen
      </span>
      {!isInline ? (
      <svg
        className="livskompass-brand-lockup__rule mt-0.5 h-2 w-[4.5rem] sm:w-[5rem]"
        viewBox="0 0 80 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#d4af37" />
            <stop offset="80%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="0" y1="4" x2="80" y2="4" stroke={`url(#${gold})`} strokeWidth="0.5" />
        <path d="M36 4 L38 2 L40 4 L38 6 Z" fill="#d4af37" />
        <path d="M32 4 L33.2 3 L34 4 L33.2 5 Z" fill="#d4af37" opacity="0.7" />
        <path d="M44 4 L45.2 3 L46 4 L45.2 5 Z" fill="#d4af37" opacity="0.7" />
      </svg>
      ) : null}
    </div>
  );
}
