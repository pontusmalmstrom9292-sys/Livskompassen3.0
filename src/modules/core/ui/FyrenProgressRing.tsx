import { DESIGN } from './tokens';

/** Synlig Fyren-hold-ring (dock, orbit-hub, modulväljare). */
export function FyrenProgressRing({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(194,65,12,0.15)" strokeWidth="1.25" />
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="none"
        stroke={DESIGN.accent}
        strokeWidth="1.25"
        strokeDasharray={`${pct} ${100 - pct}`}
        pathLength={100}
        opacity={0.9}
      />
    </svg>
  );
}
