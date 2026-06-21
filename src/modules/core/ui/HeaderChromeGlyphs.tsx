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

function GoldGradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="3" y1="3" x2="21" y2="21">
        <stop offset="0%" stopColor="#f5e6b8" />
        <stop offset="48%" stopColor="var(--color-accent-gold)" />
        <stop offset="100%" stopColor="#8a6b1a" />
      </linearGradient>
    </defs>
  );
}

/** Meny — tre guldlinjer med emboss. */
export function HeaderMenuGlyph({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const g = `hmg-${uid}`;
  return (
    <HeaderGlyphSvg className={className}>
      <GoldGradient id={g} />
      <rect x="4.5" y="6" width="15" height="2.2" rx="1.1" fill={`url(#${g})`} />
      <rect x="4.5" y="10.9" width="15" height="2.2" rx="1.1" fill={`url(#${g})`} opacity="0.92" />
      <rect x="4.5" y="15.8" width="15" height="2.2" rx="1.1" fill={`url(#${g})`} opacity="0.84" />
    </HeaderGlyphSvg>
  );
}

/** Konto — lås (ej inloggad). */
export function HeaderLockGlyph({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const g = `hlg-${uid}`;
  return (
    <HeaderGlyphSvg className={className}>
      <GoldGradient id={g} />
      <path
        d="M8 11V8.5a4 4 0 1 1 8 0V11"
        stroke={`url(#${g})`}
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <rect x="6.5" y="11" width="11" height="8.5" rx="2" stroke={`url(#${g})`} strokeWidth="1.65" />
      <circle cx="12" cy="15" r="1.2" fill={`url(#${g})`} />
      <path d="M12 16.2v1.6" stroke={`url(#${g})`} strokeWidth="1.3" strokeLinecap="round" />
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
