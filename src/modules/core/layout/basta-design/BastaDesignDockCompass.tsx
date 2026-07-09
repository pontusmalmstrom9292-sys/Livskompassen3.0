import { useId } from 'react';

type Props = {
  className?: string;
};

/** Ornamental kompassros — kanon dock FAB (inline SVG, unika gradient-id). */
export function BastaDesignDockCompass({ className = 'basta-dock-bar__compass-mark' }: Props) {
  const uid = useId().replace(/:/g, '');
  const goldGlow = `bdDockGoldGlow-${uid}`;
  const centerGlow = `bdDockCenterGlow-${uid}`;
  const shadow = `bdDockShadow-${uid}`;

  return (
    <svg className={className} viewBox="0 0 180 180" fill="none" aria-hidden>
      <defs>
        <radialGradient id={goldGlow}>
          <stop offset="0%" stopColor="#F7D774" />
          <stop offset="55%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#7A5A12" />
        </radialGradient>
        <radialGradient id={centerGlow}>
          <stop offset="0%" stopColor="#FFD76A" />
          <stop offset="100%" stopColor="#1A1208" />
        </radialGradient>
        <filter id={shadow}>
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <circle cx="90" cy="90" r="78" fill={`url(#${centerGlow})`} opacity="0.28" filter={`url(#${shadow})`} />
      <circle cx="90" cy="90" r="72" stroke={`url(#${goldGlow})`} strokeWidth="2.5" />
      <circle cx="90" cy="90" r="58" stroke="rgba(247,215,116,0.42)" strokeWidth="1.25" />
      <circle cx="90" cy="90" r="44" stroke="rgba(247,215,116,0.22)" strokeWidth="1" />
      <polygon
        points="90,16 98,72 164,90 98,108 90,164 82,108 16,90 82,72"
        fill={`url(#${goldGlow})`}
      />
      <polygon points="90,34 96,78 146,90 96,102 90,146 84,102 34,90 84,78" fill="#06101B" />
      <polygon points="90,52 92,82 118,90 92,98 90,128 88,98 62,90 88,82" fill={`url(#${goldGlow})`} opacity="0.85" />
      <circle cx="90" cy="90" r="9" fill={`url(#${goldGlow})`} />
      <circle cx="90" cy="90" r="4.5" fill="#1A1208" />
    </svg>
  );
}
