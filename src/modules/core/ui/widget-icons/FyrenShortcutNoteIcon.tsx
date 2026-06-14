import { useId } from 'react';
import type { WidgetIconProps } from './types';

/**
 * @locked ICON-WH2 Fyren anteckning — dokument + penna (drawer-l2). Ändra endast med .context/locked-icons.md + smoke:locked-icons
 * Fyren WH2 — dokument + penna (inline, undviker PWA-cache på externa SVG).
 */
export function FyrenShortcutNoteIcon({ className }: WidgetIconProps) {
  const uid = useId().replace(/:/g, '');
  const grad = `grad-fyren-note-${uid}`;

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id={grad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3d3420" />
          <stop offset="100%" stopColor="#080808" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill={`url(#${grad})`} stroke="#d4af37" strokeWidth="0.8" />
      <path
        d="M7.5 5.5h6.5l2 2v10.5H7.5V5.5z"
        fill="none"
        stroke="#f5e6b8"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M14 5.5v2h2"
        fill="none"
        stroke="#f5e6b8"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M9 10h5M9 12.5h5M9 15h3"
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.85"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path
        d="M16 13.5l-3.5 3.5-.75 2 2-.75 3.5-3.5"
        fill="none"
        stroke="#fde68a"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
