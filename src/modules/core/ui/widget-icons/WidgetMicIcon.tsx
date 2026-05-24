import type { WidgetIconProps } from './types';

/** Diskret inspelning — klassisk mic utan REC-indikator. */
export function WidgetMicIcon({ className, strokeWidth = 1.65 }: WidgetIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="9"
        y="3.5"
        width="6"
        height="10"
        rx="3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M6.5 11a5.5 5.5 0 0 0 11 0"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M12 16.5V19"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M9.5 19h5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M12 6.5v3.5"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
    </svg>
  );
}
