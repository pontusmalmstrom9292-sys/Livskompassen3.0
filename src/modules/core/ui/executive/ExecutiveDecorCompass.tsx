import { clsx } from 'clsx';
import { useId } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'dock' | 'dock-lg' | 'hero';

const SIZE_CLASS: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  dock: 'h-[2.65rem] w-[2.65rem]',
  'dock-lg': 'h-[2.65rem] w-[2.65rem]',
  hero: 'h-[6rem] w-[6rem]',
};

const TEXTURED_SIZES = new Set<Size>(['dock', 'dock-lg', 'hero', 'lg']);

type Props = {
  className?: string;
  size?: Size;
};

/** Dekorativ kompass-ros — texturerad kanon-asset på dock/hero, SVG på små ytor. */
export function ExecutiveDecorCompass({ className = '', size = 'md' }: Props) {
  const uid = useId().replace(/:/g, '');
  const gold = `execGold-${uid}`;
  const goldDeep = `execGoldDeep-${uid}`;
  const glow = `execGlow-${uid}`;

  if (TEXTURED_SIZES.has(size)) {
    return (
      <img
        src="/icons/b1-kanon-ros.svg"
        alt=""
        aria-hidden
        className={clsx(
          SIZE_CLASS[size],
          'exec-decor-compass--textured object-contain',
          className,
        )}
      />
    );
  }

  return (
    <svg
      className={clsx(SIZE_CLASS[size], className)}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gold} x1="12" y1="10" x2="68" y2="70">
          <stop offset="0%" stopColor="var(--accent-light)" />
          <stop offset="48%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 55%, #000)" />
        </linearGradient>
        <linearGradient id={goldDeep} x1="40" y1="8" x2="40" y2="72">
          <stop offset="0%" stopColor="var(--accent-light)" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 65%, #000)" />
        </linearGradient>
        <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="var(--accent)" floodOpacity="0.22" />
        </filter>
      </defs>

      <circle cx="40" cy="40" r="34" stroke={`url(#${gold})`} strokeWidth="1.75" fill="none" filter={`url(#${glow})`} />
      <path
        d="M40 8 L44.5 30 L40 40 L35.5 30 Z M40 72 L44.5 50 L40 40 L35.5 50 Z M8 40 L30 35.5 L40 40 L30 44.5 Z M72 40 L50 35.5 L40 40 L50 44.5 Z"
        fill={`url(#${gold})`}
        filter={`url(#${glow})`}
      />
      <path
        d="M40 40 L54 26 L48 34 Z M40 40 L54 54 L48 46 Z M40 40 L26 54 L34 46 Z M40 40 L26 26 L34 34 Z"
        fill={`url(#${goldDeep})`}
        filter={`url(#${glow})`}
        opacity="0.95"
      />
      <circle cx="40" cy="40" r="5.5" fill="var(--accent-light)" filter={`url(#${glow})`} />
      <circle cx="40" cy="40" r="2.75" fill="color-mix(in srgb, var(--accent) 65%, #000)" />
    </svg>
  );
}
