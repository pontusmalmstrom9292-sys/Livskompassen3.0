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

/** L1 dock-glyph — guld emboss (disk = hub-chrome-tile). */
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
        <linearGradient id={g} x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="48%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6b1a" />
        </linearGradient>
      </defs>
      {GLYPH_PATHS[id](g)}
    </svg>
  );
}

type Draw = (g: string) => ReactNode;

const GLYPH_PATHS: Record<DockGlyphId, Draw> = {
  users: (g) => (
    <>
      <circle cx="9" cy="8.5" r="2.8" fill={`url(#${g})`} opacity="0.95" />
      <path
        d="M4.5 18.5c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5"
        stroke={`url(#${g})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="9" r="2.2" fill={`url(#${g})`} opacity="0.75" />
      <path
        d="M13.5 18.5c0.3-2.2 1.8-3.6 3.8-3.6 1.6 0 3 0.9 3.6 2.4"
        stroke={`url(#${g})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </>
  ),
  sparkles: (g) => (
    <>
      <path
        d="M12 3.5 13.2 8.8 18.5 10 13.2 11.2 12 16.5 10.8 11.2 5.5 10 10.8 8.8Z"
        fill={`url(#${g})`}
      />
      <circle cx="18.5" cy="5.5" r="1.1" fill={`url(#${g})`} opacity="0.9" />
      <circle cx="6" cy="16" r="0.9" fill={`url(#${g})`} opacity="0.75" />
    </>
  ),
  book: (g) => (
    <>
      <path
        d="M5 5.5c2.2-0.6 4.2-0.6 6.2 0 2-0.6 4 0 6.2 0.6V18c-2.2-0.6-4.2-0.6-6.2 0-2-0.6-4.2 0-6.2 0V5.5Z"
        stroke={`url(#${g})`}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M11.2 5.2v12.6" stroke={`url(#${g})`} strokeWidth="1.2" opacity="0.55" />
    </>
  ),
  bookheart: (g) => (
    <>
      <path
        d="M5 5.5c2-0.5 4-0.5 6 0 2-0.5 4 0 6 0.5V17.5c-2-0.5-4-0.5-6 0-2-0.5-4 0-6 0V5.5Z"
        stroke={`url(#${g})`}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.2c0.8-1.2 2.8-1.2 3.4 0.2 0.7 1.6-1.2 3.2-3.4 4.8-2.2-1.6-4.1-3.2-3.4-4.8 0.6-1.4 2.6-1.4 3.4-0.2Z"
        fill={`url(#${g})`}
        opacity="0.92"
      />
    </>
  ),
  anchor: (g) => (
    <>
      <circle cx="12" cy="5.5" r="1.8" stroke={`url(#${g})`} strokeWidth="1.5" />
      <path d="M12 7.2v8.8" stroke={`url(#${g})`} strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M7.5 13.5c0 3.2 2 5.5 4.5 5.5s4.5-2.3 4.5-5.5"
        stroke={`url(#${g})`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M5.5 13.5h13" stroke={`url(#${g})`} strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  grid: (g) => (
    <>
      {[0, 1].flatMap((row) =>
        [0, 1].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={5 + col * 7.2}
            y={5 + row * 7.2}
            width="5.8"
            height="5.8"
            rx="1.2"
            fill={`url(#${g})`}
            opacity={row === 0 && col === 0 ? 1 : 0.82 - row * 0.08 - col * 0.04}
          />
        )),
      )}
    </>
  ),
  folder: (g) => (
    <>
      <path
        d="M4.5 7.5h5.2l1.8 2h7.5a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5V9a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke={`url(#${g})`}
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      <path d="M4.5 9.5h14.5" stroke={`url(#${g})`} strokeWidth="1.1" opacity="0.45" />
    </>
  ),
  clock: (g) => (
    <>
      <circle cx="12" cy="12" r="7.2" stroke={`url(#${g})`} strokeWidth="1.5" />
      <path d="M12 8v4.2l2.8 1.6" stroke={`url(#${g})`} strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  cart: (g) => (
    <>
      <path
        d="M4.5 5h1.8l1.4 9h9.4l1.6-6.5H7.2"
        stroke={`url(#${g})`}
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="17.5" r="1.2" fill={`url(#${g})`} />
      <circle cx="16" cy="17.5" r="1.2" fill={`url(#${g})`} />
    </>
  ),
  calendar: (g) => (
    <>
      <rect x="5" y="6" width="14" height="13" rx="2" stroke={`url(#${g})`} strokeWidth="1.45" />
      <path d="M5 10h14M9 4v3M15 4v3" stroke={`url(#${g})`} strokeWidth="1.4" strokeLinecap="round" />
      <rect x="8" y="12.5" width="3" height="2.5" rx="0.5" fill={`url(#${g})`} opacity="0.85" />
      <rect x="13" y="12.5" width="3" height="2.5" rx="0.5" fill={`url(#${g})`} opacity="0.65" />
    </>
  ),
  pen: (g) => (
    <>
      <path
        d="M14.5 4.5 19.5 9.5 9 20H4v-5L14.5 4.5Z"
        stroke={`url(#${g})`}
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      <path d="M13 6l3 3" stroke={`url(#${g})`} strokeWidth="1.2" opacity="0.55" />
    </>
  ),
  wallet: (g) => (
    <>
      <rect x="4" y="7" width="16" height="11" rx="2" stroke={`url(#${g})`} strokeWidth="1.45" />
      <path d="M4 10.5h16" stroke={`url(#${g})`} strokeWidth="1.2" opacity="0.5" />
      <circle cx="16.5" cy="13.5" r="1.3" fill={`url(#${g})`} />
    </>
  ),
  mail: (g) => (
    <>
      <rect x="4" y="6.5" width="16" height="11" rx="2" stroke={`url(#${g})`} strokeWidth="1.45" />
      <path d="M4 8.5 12 13.5 20 8.5" stroke={`url(#${g})`} strokeWidth="1.4" strokeLinejoin="round" />
    </>
  ),
  target: (g) => (
    <>
      <circle cx="12" cy="12" r="7" stroke={`url(#${g})`} strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke={`url(#${g})`} strokeWidth="1.2" opacity="0.7" />
      <circle cx="12" cy="12" r="1.3" fill={`url(#${g})`} />
    </>
  ),
};
