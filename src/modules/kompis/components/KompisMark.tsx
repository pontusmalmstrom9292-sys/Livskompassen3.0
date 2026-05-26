import { useId } from 'react';

type Props = {
  className?: string;
};

/**
 * @locked ICON-M3 Fyrens själ — Kompis-avatar. Ändra endast med .context/locked-icons.md + smoke:locked-icons
 * Premium 2026-05-26.
 */
export function KompisMark({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const bg = `km-bg-${uid}`;
  const beam = `km-beam-${uid}`;
  const gold = `km-gold-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="80%" r="55%">
          <stop offset="0%" stopColor="#1a2830" />
          <stop offset="100%" stopColor="#060a0c" />
        </radialGradient>
        <linearGradient id={beam} x1="24" y1="8" x2="24" y2="36">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="50%" stopColor="#ffb74d" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8d5a0" />
          <stop offset="100%" stopColor="#b8942a" />
        </linearGradient>
      </defs>
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${bg})`}
        stroke={`url(#${gold})`}
        strokeWidth="0.85"
      />
      <path
        d="M24 10 L34 34 L24 30 L14 34 Z"
        fill={`url(#${beam})`}
        opacity="0.55"
      />
      <path
        d="M24 12 L30 32 L24 28 L18 32 Z"
        fill={`url(#${beam})`}
        opacity="0.75"
      />
      <rect x="20" y="30" width="8" height="10" rx="1" fill={`url(#${gold})`} opacity="0.5" />
      <circle cx="24" cy="26" r="3" fill="#fff8e0" opacity="0.95" />
    </svg>
  );
}
