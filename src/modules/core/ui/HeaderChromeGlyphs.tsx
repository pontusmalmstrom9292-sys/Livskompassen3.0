import { useId, type ReactNode } from 'react';

type Props = {
  className?: string;
};

function HeaderGlyphSvg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}


/** Meny — tre guldlinjer med emboss och gradient för premiumkänsla. */
export function HeaderMenuGlyph({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const g = `hmg-${uid}`;
  const gdim = `hmg-dim-${uid}`;
  return (
    <HeaderGlyphSvg className={className}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6b1a" />
        </linearGradient>
        <linearGradient id={gdim} x1="24" y1="0" x2="0" y2="24">
          <stop offset="0%" stopColor="#a68b2e" />
          <stop offset="100%" stopColor="#f5e6b8" />
        </linearGradient>
      </defs>
      <rect x="4" y="6" width="16" height="2.5" rx="1.25" fill={`url(#${g})`} stroke={`url(#${gdim})`} strokeWidth="0.4" />
      <rect x="4" y="10.8" width="16" height="2.5" rx="1.25" fill={`url(#${g})`} stroke={`url(#${gdim})`} strokeWidth="0.4" opacity="0.95" />
      <rect x="4" y="15.6" width="16" height="2.5" rx="1.25" fill={`url(#${g})`} stroke={`url(#${gdim})`} strokeWidth="0.4" opacity="0.9" />
    </HeaderGlyphSvg>
  );
}

/** Konto — lås (ej inloggad) - premium guldlook. */
export function HeaderLockGlyph({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const g = `hlg-${uid}`;
  const gdim = `hlg-dim-${uid}`;
  return (
    <HeaderGlyphSvg className={className}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6b1a" />
        </linearGradient>
        <linearGradient id={gdim} x1="24" y1="0" x2="0" y2="24">
          <stop offset="0%" stopColor="#a68b2e" />
          <stop offset="100%" stopColor="#f5e6b8" />
        </linearGradient>
      </defs>
      <g opacity="0.9">
        <path
          d="M7 11V8.5C7 5.74 9.24 3.5 12 3.5C14.76 3.5 17 5.74 17 8.5V11"
          stroke={`url(#${g})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <rect x="5.5" y="11" width="13" height="9.5" rx="2.5" fill={`url(#${g})`} stroke={`url(#${gdim})`} strokeWidth="1" />
        <circle cx="12" cy="15" r="1.5" fill="#141c2b" />
        <path d="M12 16.5v1.5" stroke="#141c2b" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </HeaderGlyphSvg>
  );
}

/** Konto — aktiv (inloggad). */
export function HeaderShieldGlyph({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const g = `hsg-${uid}`;
  const ok = `hsg-ok-${uid}`;
  return (
    <HeaderGlyphSvg className={className}>
      <defs>
        <linearGradient id={g} x1="4" y1="3" x2="20" y2="21">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="45%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id={ok} x1="9" y1="10" x2="15" y2="16">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>
      <path
        d="M12 3.5 18 6.2v5.8c0 3.6-2.4 5.8-6 7.5-3.6-1.7-6-3.9-6-7.5V6.2L12 3.5Z"
        stroke={`url(#${g})`}
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.2 11 14.2 15.2 10"
        stroke={`url(#${ok})`}
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </HeaderGlyphSvg>
  );
}
