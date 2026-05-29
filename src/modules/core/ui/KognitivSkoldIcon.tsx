import { useId } from 'react';
import { useKognitivSkoldVariant } from '../home/useKognitivSkoldVariant';

type Props = {
  className?: string;
};

/** Kompakt kompass-i-sköld (K06 nordic flat) — t.ex. Dagens riktning. */
export function KognitivSkoldIcon({ className }: Props) {
  const uid = useId().replace(/:/g, '');
  const { tokens } = useKognitivSkoldVariant();
  const needleId = `k-skold-needle-${uid}`;

  const cx = 24;
  const cy = 24;
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const rad = (i * Math.PI) / 4;
    const x2 = cx + Math.cos(rad) * 16;
    const y2 = cy + Math.sin(rad) * 16;
    return (
      <line
        key={i}
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke={tokens.gold}
        strokeWidth={0.55}
        opacity={0.35}
      />
    );
  });

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={needleId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tokens.gold} />
          <stop offset="100%" stopColor={tokens.gold} />
        </linearGradient>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={20}
        fill={tokens.shield}
        stroke={tokens.rim}
        strokeWidth={1.2}
        opacity={0.96}
      />
      <circle
        cx={cx}
        cy={cy}
        r={17}
        fill="none"
        stroke={tokens.gold}
        strokeWidth={0.75}
        opacity={0.5}
        strokeDasharray="2 3"
      />
      {spokes}
      <polygon
        points={`${cx},${cy - 14} ${cx - 4},${cy + 6} ${cx + 4},${cy + 6}`}
        fill={`url(#${needleId})`}
        stroke={tokens.gold}
        strokeWidth={0.65}
      />
      <circle cx={cx} cy={cy} r={3.2} fill="#080808" stroke={tokens.gold} strokeWidth={1.1} />
      <circle cx={cx} cy={cy - 16} r={1.6} fill={tokens.gold} opacity={0.92} />
    </svg>
  );
}
