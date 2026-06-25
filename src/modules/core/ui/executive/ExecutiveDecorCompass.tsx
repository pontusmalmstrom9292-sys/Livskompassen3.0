import { clsx } from 'clsx';
import { useId } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'dock' | 'dock-lg';

const SIZE_CLASS: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  dock: 'h-[2.65rem] w-[2.65rem]',
  'dock-lg': 'h-[2.65rem] w-[2.65rem]',
};

type Props = {
  className?: string;
  size?: Size;
};

/** Dekorativ kompass-ros — 8-spetsig guld (Midnight Executive). */
export function ExecutiveDecorCompass({ className = '', size = 'md' }: Props) {
  const uid = useId().replace(/:/g, '');
  const gold = `execGold-${uid}`;
  const goldDeep = `execGoldDeep-${uid}`;
  const orb = `execOrb-${uid}`;
  const glow = `execGlow-${uid}`;

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
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="22%" stopColor="#f5e6a8" />
          <stop offset="48%" stopColor="#e8c84a" />
          <stop offset="72%" stopColor="#c9a66b" />
          <stop offset="100%" stopColor="#6b4f1a" />
        </linearGradient>
        <linearGradient id={goldDeep} x1="40" y1="8" x2="40" y2="72">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#7a5c1a" />
        </linearGradient>
        <radialGradient id={orb} cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="rgba(253, 230, 138, 0.22)" />
          <stop offset="55%" stopColor="rgba(201, 166, 107, 0.06)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
        </radialGradient>
        <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#d4af37" floodOpacity="0.28" />
        </filter>
      </defs>

      <circle cx="40" cy="40" r="36" fill={`url(#${orb})`} />
      <circle cx="40" cy="40" r="34" stroke={`url(#${gold})`} strokeWidth="1.75" fill="none" filter={`url(#${glow})`} />

      {/* Kardinalspetsar */}
      <path
        d="M40 8 L44.5 30 L40 40 L35.5 30 Z M40 72 L44.5 50 L40 40 L35.5 50 Z M8 40 L30 35.5 L40 40 L30 44.5 Z M72 40 L50 35.5 L40 40 L50 44.5 Z"
        fill={`url(#${gold})`}
        filter={`url(#${glow})`}
      />
      {/* Diagonalspetsar */}
      <path
        d="M40 40 L54 26 L48 34 Z M40 40 L54 54 L48 46 Z M40 40 L26 54 L34 46 Z M40 40 L26 26 L34 34 Z"
        fill={`url(#${goldDeep})`}
        filter={`url(#${glow})`}
        opacity="0.95"
      />

      <circle cx="40" cy="40" r="5.5" fill="#fde68a" filter={`url(#${glow})`} />
      <circle cx="40" cy="40" r="2.75" fill="#7a5c1a" />
    </svg>
  );
}
