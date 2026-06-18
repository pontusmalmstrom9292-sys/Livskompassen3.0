/** Dekorativ kompass-ros för executive header — ej LivskompassMark (D1 = FAB only). */
export function ExecutiveDecorCompass({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="24" r="22" stroke="url(#execGold)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="18" fill="url(#execGoldFill)" opacity="0.15" />
      <path
        d="M24 6 L27 21 L24 24 L21 21 Z M24 42 L27 27 L24 24 L21 27 Z M6 24 L21 21 L24 24 L21 27 Z M42 24 L27 21 L24 24 L27 27 Z"
        fill="url(#execGold)"
      />
      <circle cx="24" cy="24" r="3" fill="#d4af37" />
      <defs>
        <linearGradient id="execGold" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9a7b2f" />
        </linearGradient>
        <radialGradient id="execGoldFill" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>
    </svg>
  );
}
