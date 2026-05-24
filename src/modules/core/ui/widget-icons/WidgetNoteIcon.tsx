import type { WidgetIconProps } from './types';

/** Anteckning — block + penna (mockup snabbanteckning). */
export function WidgetNoteIcon({ className, strokeWidth = 1.65 }: WidgetIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M8 4.5h8l3 3V19.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M16 4.5V7.5h3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M9.5 11h5M9.5 14h5M9.5 17h3"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <path
        d="M17.5 14.5l-4.5 4.5-.5 2 2-.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
