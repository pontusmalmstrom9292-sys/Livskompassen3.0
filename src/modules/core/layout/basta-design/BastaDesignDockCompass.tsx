/* PROTECTED BASTA-DESIGN DOCK LOCK — docs/design/BASTA-DESIGN-DOCK-LOCK.md · npm run smoke:basta-dock-lock */
import { useId } from 'react';

type Props = {
  className?: string;
};

/** Kompassros — exakt från docs/bästa designv2 (mörk skiva + guldros). Tokeniserad — inga fria hex. */
export function BastaDesignDockCompass({ className = 'basta-dock-bar__compass-mark' }: Props) {
  const uid = useId().replace(/:/g, '');
  const gold = `bdV2Gold-${uid}`;
  const plate = `bdV2Plate-${uid}`;

  return (
    <svg className={className} viewBox="0 0 180 180" fill="none" aria-hidden>
      <defs>
        <radialGradient id={gold} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="var(--accent-light, var(--champagne, #F7D774))" />
          <stop offset="100%" stopColor="var(--accent, #9A6E10)" />
        </radialGradient>
        <radialGradient id={plate} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--surface-3, var(--surface-2, #1c2438))" />
          <stop offset="100%" stopColor="var(--bg, #080b14)" />
        </radialGradient>
      </defs>
      <circle cx="90" cy="90" r="89" fill={`url(#${plate})`} />
      <circle cx="90" cy="90" r="85" stroke={`url(#${gold})`} strokeWidth="3" fill="none" />
      <circle
        className="basta-dock-compass__ring"
        cx="90"
        cy="90"
        r="65"
        strokeWidth="1"
        fill="none"
      />
      <polygon
        points="90,18 104,76 162,90 104,104 90,162 76,104 18,90 76,76"
        fill={`url(#${gold})`}
      />
      <polygon points="90,36 100,80 144,90 100,100 90,144 80,100 36,90 80,80" fill="var(--bg, #080b14)" />
      <circle cx="90" cy="90" r="12" fill={`url(#${gold})`} />
      <circle cx="90" cy="90" r="5" fill="var(--bg, #080b14)" />
    </svg>
  );
}
