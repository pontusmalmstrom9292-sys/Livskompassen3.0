import { useId } from 'react';

type Props = {
  className?: string;
};

/**
 * @locked ICON-D1 Helros — header, dock, hero. Ändra endast med .context/locked-icons.md + smoke:locked-icons
 * Livskompassen — Premium 2026-05-26.
 */
export function LivskompassMark({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const disk = `lk-disk-${uid}`;
  const gold = `lk-gold-${uid}`;
  const fire = `lk-fire-${uid}`;
  const glow = `lk-glow-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id={disk} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#3d3420" />
          <stop offset="55%" stopColor="#141210" />
          <stop offset="100%" stopColor="#080808" />
        </radialGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6b1a" />
        </linearGradient>
        <linearGradient id={fire} x1="24" y1="4" x2="30" y2="18">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#e8a020" />
        </linearGradient>
        <filter id={glow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#${disk})`}
        stroke={`url(#${gold})`}
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke={`url(#${gold})`}
        strokeOpacity="0.25"
        strokeWidth="0.6"
        strokeDasharray="2 3"
      />
      <circle
        cx="24"
        cy="24"
        r="14"
        stroke={`url(#${gold})`}
        strokeOpacity="0.15"
        strokeWidth="0.5"
      />
      <g stroke={`url(#${gold})`} strokeOpacity="0.12" strokeWidth="0.4">
        <line x1="24" y1="8" x2="24" y2="40" />
        <line x1="8" y1="24" x2="40" y2="24" />
        <line x1="12.7" y1="12.7" x2="35.3" y2="35.3" />
        <line x1="35.3" y1="12.7" x2="12.7" y2="35.3" />
      </g>
      <g fill={`url(#${gold})`}>
        <path
          d="M24 6 L26.4 18.5 L24 22 L21.6 18.5 Z"
          fill={`url(#${fire})`}
          filter={`url(#${glow})`}
        />
        <path d="M24 42 L21.6 29.5 L24 26 L26.4 29.5 Z" opacity="0.35" />
        <path d="M6 24 L18.5 21.6 L22 24 L18.5 26.4 Z" opacity="0.28" />
        <path d="M44.5 24 L32 30.5 L18 24 L32 17.5 Z" opacity="0.48" />
        <path d="M11 11 L17.5 17.5 L24 24 L17.5 17.5 Z" opacity="0.22" />
        <path d="M37 11 L30.5 17.5 L24 24 L30.5 17.5 Z" opacity="0.22" />
        <path d="M37 37 L30.5 30.5 L24 24 L30.5 30.5 Z" opacity="0.2" />
        <path d="M11 37 L17.5 30.5 L24 24 L17.5 30.5 Z" opacity="0.2" />
      </g>
      <circle cx="32" cy="14" r="2" fill="#fff8e0" opacity="0.9" filter={`url(#${glow})`} />
      <path
        d="M32 14 L30 16 L32 18 L34 16 Z"
        fill={`url(#${fire})`}
        opacity="0.85"
      />
      <circle
        cx="24"
        cy="24"
        r="2.5"
        fill={`url(#${gold})`}
        stroke="#0a0a0a"
        strokeWidth="0.5"
      />
    </svg>
  );
}
