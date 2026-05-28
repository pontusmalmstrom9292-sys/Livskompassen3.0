import { useId, type ReactNode } from 'react';

export type DockGlyphId =
  | 'users'
  | 'sparkles'
  | 'book'
  | 'bookheart'
  | 'anchor'
  | 'grid'
  | 'folder'
  | 'clock'
  | 'cart'
  | 'calendar'
  | 'pen'
  | 'wallet'
  | 'mail'
  | 'target';

type Props = {
  id: DockGlyphId;
  className?: string;
};

/** L1 dock-glyph — tunn guldlinje, kompakt i chrome-plattan. */
export function DockHubGlyph({ id, className }: Props) {
  const uid = useId().replace(/:/g, '');
  const g = `dhg-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={g} x1="5" y1="5" x2="19" y2="19">
          <stop offset="0%" stopColor="#f0dfa0" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9a7820" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${g})`} strokeLinecap="round" strokeLinejoin="round">
        {GLYPH_PATHS[id](g)}
      </g>
    </svg>
  );
}

type Draw = (g: string) => ReactNode;

const SW = 1.35;

const GLYPH_PATHS: Record<DockGlyphId, Draw> = {
  users: () => (
    <>
      <circle cx="9.5" cy="9" r="2.2" fill="none" strokeWidth={SW} />
      <path d="M5.5 17.5c0-2.2 1.6-3.5 4-3.5s4 1.3 4 3.5" strokeWidth={SW} fill="none" />
      <circle cx="16" cy="9.5" r="1.7" fill="none" strokeWidth={SW - 0.1} opacity="0.85" />
      <path d="M13.5 17.5c0.2-1.8 1.4-2.9 3-2.9 1.3 0 2.4 0.7 2.9 1.9" strokeWidth={SW - 0.1} fill="none" opacity="0.8" />
    </>
  ),
  sparkles: (g) => (
    <>
      <path
        d="M12 6.5 12.8 9.8 16 10.5 12.8 11.2 12 14.5 11.2 11.2 8 10.5 11.2 9.8Z"
        fill={`url(#${g})`}
        stroke="none"
        opacity="0.95"
      />
      <circle cx="16.8" cy="7.2" r="0.65" fill={`url(#${g})`} stroke="none" />
    </>
  ),
  book: () => (
    <>
      <path d="M6.5 7.2c1.8-0.4 3.4-0.4 5.2 0 1.8-0.4 3.4 0 5.2 0.4V16.8c-1.8-0.4-3.4-0.4-5.2 0-1.8-0.4-3.4 0-5.2 0V7.2Z" strokeWidth={SW} />
      <path d="M11.7 7v9.8" strokeWidth={SW - 0.25} opacity="0.45" />
    </>
  ),
  bookheart: (g) => (
    <>
      <path d="M6.5 7.2c1.6-0.35 3.2-0.35 4.8 0 1.6-0.35 3.2 0 4.8 0.35V16.2c-1.6-0.35-3.2-0.35-4.8 0-1.6-0.35-3.2 0-4.8 0V7.2Z" strokeWidth={SW} />
      <path
        d="M12 10.2c0.5-0.85 1.9-0.85 2.3 0.15 0.45 1.05-0.85 2.1-2.3 3.1-1.45-1-2.75-2.05-2.3-3.1 0.4-1 1.8-1 2.3-0.15Z"
        fill={`url(#${g})`}
        stroke="none"
        opacity="0.9"
      />
    </>
  ),
  anchor: () => (
    <>
      <circle cx="12" cy="6.8" r="1.35" strokeWidth={SW} />
      <path d="M12 8.2v7.8" strokeWidth={SW} />
      <path d="M8.2 13.2c0 2.5 1.6 4.3 3.8 4.3s3.8-1.8 3.8-4.3" strokeWidth={SW} />
      <path d="M6.5 13.2h11" strokeWidth={SW} />
    </>
  ),
  grid: (g) => (
    <>
      <rect x="6.2" y="6.2" width="4.2" height="4.2" rx="0.8" fill={`url(#${g})`} stroke="none" opacity="0.95" />
      <rect x="13.6" y="6.2" width="4.2" height="4.2" rx="0.8" fill={`url(#${g})`} stroke="none" opacity="0.75" />
      <rect x="6.2" y="13.6" width="4.2" height="4.2" rx="0.8" fill={`url(#${g})`} stroke="none" opacity="0.75" />
      <rect x="13.6" y="13.6" width="4.2" height="4.2" rx="0.8" fill={`url(#${g})`} stroke="none" opacity="0.6" />
    </>
  ),
  folder: () => (
    <>
      <path d="M5.8 8.2h4.4l1.4 1.8h6.6a1.1 1.1 0 0 1 1.1 1.1v5.4a1.1 1.1 0 0 1-1.1 1.1H5.8a1.1 1.1 0 0 1-1.1-1.1V9.3a1.1 1.1 0 0 1 1.1-1.1Z" strokeWidth={SW} />
    </>
  ),
  clock: () => (
    <>
      <circle cx="12" cy="12" r="5.8" strokeWidth={SW} />
      <path d="M12 9.2v3.2l2.2 1.2" strokeWidth={SW} />
    </>
  ),
  cart: (g) => (
    <>
      <path d="M5.2 6.8h1.3l1.1 7.2h7.4l1.2-5H7" strokeWidth={SW} />
      <circle cx="9.8" cy="16.8" r="0.85" fill={`url(#${g})`} stroke="none" />
      <circle cx="15.2" cy="16.8" r="0.85" fill={`url(#${g})`} stroke="none" />
    </>
  ),
  calendar: () => (
    <>
      <rect x="6.2" y="7.2" width="11.6" height="10.2" rx="1.4" strokeWidth={SW} />
      <path d="M6.2 10.2h11.6M9.2 5.8v2.2M14.8 5.8v2.2" strokeWidth={SW - 0.1} />
    </>
  ),
  pen: () => (
    <>
      <path d="M14.2 5.8 18.2 9.8 9.5 18.5 5.5 18.5 5.5 14.5Z" strokeWidth={SW} />
    </>
  ),
  wallet: (g) => (
    <>
      <rect x="5.5" y="8" width="13" height="8.8" rx="1.5" strokeWidth={SW} />
      <circle cx="15.5" cy="12.4" r="0.9" fill={`url(#${g})`} stroke="none" />
    </>
  ),
  mail: () => (
    <>
      <rect x="5.5" y="7.5" width="13" height="9" rx="1.5" strokeWidth={SW} />
      <path d="M5.5 9.2 12 13.2 18.5 9.2" strokeWidth={SW - 0.1} />
    </>
  ),
  target: (g) => (
    <>
      <circle cx="12" cy="12" r="5.6" strokeWidth={SW} />
      <circle cx="12" cy="12" r="2.8" strokeWidth={SW - 0.15} opacity="0.7" />
      <circle cx="12" cy="12" r="0.85" fill={`url(#${g})`} stroke="none" />
    </>
  ),
};
