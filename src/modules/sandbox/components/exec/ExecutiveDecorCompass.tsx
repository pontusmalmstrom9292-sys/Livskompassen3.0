/** Dekorativ kompass-ros — 3D chrome (ej LivskompassMark / D1). */
export function ExecutiveDecorCompass({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="execGoldV3" x1="8" y1="8" x2="56" y2="56">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="35%" stopColor="#e8c84a" />
          <stop offset="70%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#7a5c1a" />
        </linearGradient>
        <radialGradient id="execGoldOrb" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="rgba(232,200,74,0.45)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <filter id="execGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#d4af37" floodOpacity="0.45" />
        </filter>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#execGoldOrb)" />
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="url(#execGoldV3)"
        strokeWidth="1.5"
        filter="url(#execGoldGlow)"
      />
      <path
        d="M32 8 L36 28 L32 32 L28 28 Z M32 56 L36 36 L32 32 L28 36 Z M8 32 L28 28 L32 32 L28 36 Z M56 32 L36 28 L32 32 L36 36 Z"
        fill="url(#execGoldV3)"
        filter="url(#execGoldGlow)"
      />
      <circle cx="32" cy="32" r="4" fill="#fde68a" />
      <circle cx="32" cy="32" r="2" fill="#9a7b2f" />
    </svg>
  );
}
