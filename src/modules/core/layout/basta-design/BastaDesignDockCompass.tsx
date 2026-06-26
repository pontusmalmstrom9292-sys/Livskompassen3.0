type Props = {
  className?: string;
};

/** Gyllene kompass — Figma-ref dock FAB. */
export function BastaDesignDockCompass({ className = 'basta-dock-bar__compass-mark' }: Props) {
  return (
    <svg className={className} viewBox="0 0 180 180" fill="none" aria-hidden>
      <defs>
        <radialGradient id="bdDockGoldGlow">
          <stop offset="0%" stopColor="#F7D774" />
          <stop offset="100%" stopColor="#A77A16" />
        </radialGradient>
        <radialGradient id="bdDockCenterGlow">
          <stop offset="0%" stopColor="#FFD76A" />
          <stop offset="100%" stopColor="#2D1B00" />
        </radialGradient>
        <filter id="bdDockShadow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <circle cx="90" cy="90" r="78" fill="url(#bdDockCenterGlow)" opacity="0.25" filter="url(#bdDockShadow)" />
      <circle cx="90" cy="90" r="72" stroke="url(#bdDockGoldGlow)" strokeWidth="3" />
      <circle cx="90" cy="90" r="58" stroke="rgba(247,215,116,0.45)" strokeWidth="1.5" />
      <polygon points="90,22 102,78 158,90 102,102 90,158 78,102 22,90 78,78" fill="url(#bdDockGoldGlow)" />
      <polygon points="90,40 98,82 140,90 98,98 90,140 82,98 40,90 82,82" fill="#06101B" />
      <circle cx="90" cy="90" r="10" fill="url(#bdDockGoldGlow)" />
    </svg>
  );
}
