https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0/blob/b1eb6af02c76f1b298d5f88edb0d0fab66220f14/docs/design/icons-proposals/2026-05-29-gold-hub-v5/preview.htmlimport { useId } from 'react';

type Props = {
  className?: string;
};

/**
 * @locked ICON-D1 Gold stack — header, dock, hero. Ändra endast med .context/locked-icons.md + smoke:locked-icons
 * Livskompassen — Gold stack 2026-05.
 */
export function LivskompassMark({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const gold = `lk-gold-stack-${uid}`;
  const goldDim = `lk-gold-dim-${uid}`;
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
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6b1a" />
        </linearGradient>
        <linearGradient id={goldDim} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#a68b2e" />
          <stop offset="100%" stopColor="#e8d48a" />
        </linearGradient>
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="21" stroke={`url(#${gold})`} strokeWidth="0.7" fill="none" opacity="0.85" />
      <circle cx="24" cy="24" r="17" stroke={`url(#${gold})`} strokeWidth="0.45" fill="none" opacity="0.45" />
      <g fill={`url(#${gold})`} stroke={`url(#${goldDim})`} strokeWidth="0.25">
        <path d="M24 5 L26.8 17.2 L24 20.5 L21.2 17.2 Z" filter={`url(#${glow})`} />
        <path d="M24 43 L21.2 30.8 L24 27.5 L26.8 30.8 Z" opacity="0.55" />
        <path d="M5 24 L17.2 21.2 L20.5 24 L17.2 26.8 Z" opacity="0.5" />
        <path d="M43 24 L30.8 26.8 L27.5 24 L30.8 21.2 Z" opacity="0.5" />
        <path d="M10.5 10.5 L16.8 16.8 L24 24 L16.8 16.8 Z" opacity="0.38" />
        <path d="M37.5 10.5 L31.2 16.8 L24 24 L31.2 16.8 Z" opacity="0.38" />
        <path d="M37.5 37.5 L31.2 31.2 L24 24 L31.2 31.2 Z" opacity="0.35" />
        <path d="M10.5 37.5 L16.8 31.2 L24 24 L16.8 31.2 Z" opacity="0.35" />
      </g>
      <g fill={`url(#${gold})`} opacity="0.7">
        <path d="M24 8 L25 10 L24 11 L23 10 Z" transform="rotate(45 24 24)" />
        <path d="M24 8 L25 10 L24 11 L23 10 Z" transform="rotate(135 24 24)" />
        <path d="M24 8 L25 10 L24 11 L23 10 Z" transform="rotate(225 24 24)" />
        <path d="M24 8 L25 10 L24 11 L23 10 Z" transform="rotate(315 24 24)" />
      </g>
      <circle cx="24" cy="24" r="4.5" fill="none" stroke={`url(#${gold})`} strokeWidth="0.65" />
      <circle cx="24" cy="24" r="2.2" fill="#050508" stroke={`url(#${gold})`} strokeWidth="0.4" />
    </svg>
  );
}
