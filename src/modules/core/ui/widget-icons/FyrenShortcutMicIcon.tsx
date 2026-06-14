import { useId } from 'react';
import type { WidgetIconProps } from './types';

/** Fyren WH1 — mikrofon (inline, undviker PWA-cache på externa SVG). */
export function FyrenShortcutMicIcon({ className }: WidgetIconProps) {
  const uid = useId().replace(/:/g, '');
  const grad = `grad-fyren-mic-${uid}`;

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
      <rect
        x="9.25"
        y="5"
        width="5.5"
        height="8.5"
        rx="2.75"
        fill="none"
        stroke="#f5e6b8"
        strokeWidth="1.2"
      />
      <path
        d="M7 12.5a5 5 0 0 0 10 0"
        fill="none"
        stroke="#f5e6b8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 16.5V18.5M10 18.5h4"
        fill="none"
        stroke="#f5e6b8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
