/** Valv — kanonisk valvbåge (line). Ersätter sköld+bock. Se docs/design/references/VALV-ICON-KANON.md */
type Props = {
  className?: string;
  strokeWidth?: number;
};

export function ValvArchIcon({ className, strokeWidth = 1.65 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M5 11.5V20h14v-8.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 11.5c0 0 3.5-5.5 7-5.5s7 5.5 7 5.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 20v-5.5h4V20"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="15" r="0.75" fill="currentColor" />
    </svg>
  );
}
