type Props = {
  className?: string;
};

/** Livskompassen — kompassros (delad header + dock). */
export function LivskompassMark({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.75" />
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="5"
          x2="24"
          y2="8"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="0.75"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
      <path d="M24 9 L25.2 21 L24 24 L22.8 21 Z" fill="currentColor" fillOpacity="0.92" />
      <path d="M24 39 L22.8 27 L24 24 L25.2 27 Z" fill="currentColor" fillOpacity="0.28" />
      <path d="M9 24 L21 22.8 L24 24 L21 25.2 Z" fill="currentColor" fillOpacity="0.22" />
      <path d="M39 24 L27 25.2 L24 24 L27 22.8 Z" fill="currentColor" fillOpacity="0.22" />
      <circle cx="24" cy="24" r="2.25" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}
