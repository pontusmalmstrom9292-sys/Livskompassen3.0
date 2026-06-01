import { useId } from 'react';

type Props = {
  className?: string;
};

/**
 * @locked ICON-M2 Orakelöga — Kompis-avatar. Ändra endast med .context/locked-icons.md + smoke:locked-icons
 * Premium L2 — embossad disk, irisdjup, stjärnpupill (2026-05-27 v3).
 */
export function KompisMark({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const km2g = `km2g-${uid}`;
  const disk = `km2-disk-${uid}`;
  const iris = `km2-iris-${uid}`;
  const pupil = `km2-pupil-${uid}`;
  const glow = `km2-glow-${uid}`;
  const sclera = `km2-sclera-${uid}`;

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
          <stop offset="0%" stopColor="#2a2838" />
          <stop offset="45%" stopColor="#12141c" />
          <stop offset="100%" stopColor="#06080c" />
        </radialGradient>
        <linearGradient id={km2g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6b1a" />
        </linearGradient>
        <radialGradient id={sclera} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#1a2230" />
          <stop offset="70%" stopColor="#0a0e14" />
          <stop offset="100%" stopColor="#040608" />
        </radialGradient>
        <radialGradient id={iris} cx="48%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fff8e8" />
          <stop offset="35%" stopColor="#e8c060" />
          <stop offset="100%" stopColor="#b87818" />
        </radialGradient>
        <radialGradient id={pupil} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e2838" />
          <stop offset="100%" stopColor="#05080c" />
        </radialGradient>
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
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
        stroke={`url(#${km2g})`}
        strokeWidth="1.15"
        strokeOpacity="0.85"
      />
      <circle
        cx="24"
        cy="24"
        r="18.5"
        stroke={`url(#${km2g})`}
        strokeOpacity="0.22"
        strokeWidth="0.55"
        strokeDasharray="2 3"
        fill="none"
      />

      <path
        d="M7.5 24 Q24 7.5 40.5 24 Q24 40.5 7.5 24 Z"
        fill={`url(#${sclera})`}
        stroke={`url(#${km2g})`}
        strokeWidth="1.05"
        strokeOpacity="0.9"
      />
      <path
        d="M11 24 Q24 12 37 24"
        stroke={`url(#${km2g})`}
        strokeWidth="0.65"
        strokeOpacity="0.35"
        fill="none"
      />

      <circle cx="24" cy="24" r="9.5" fill={`url(#${iris})`} stroke={`url(#${km2g})`} strokeWidth="0.5" strokeOpacity="0.5" />
      <circle cx="24" cy="24" r="5.8" fill={`url(#${pupil})`} />

      <polygon
        points="24,19.2 25.1,22.4 28.4,22.4 25.7,24.4 26.6,27.6 24,25.6 21.4,27.6 22.3,24.4 19.6,22.4 22.9,22.4"
        fill={`url(#${km2g})`}
        opacity="0.92"
      />

      <circle cx="21.2" cy="21.5" r="1.35" fill="#fff8e0" opacity="0.95" filter={`url(#${glow})`} />
      <circle cx="33.5" cy="13.5" r="1.6" fill="#fff8e0" opacity="0.88" filter={`url(#${glow})`} />
      <path
        d="M33.5 13.5 L32.1 15.2 L33.5 16.8 L34.9 15.2 Z"
        fill={`url(#${km2g})`}
        opacity="0.8"
      />
    </svg>
  );
}
