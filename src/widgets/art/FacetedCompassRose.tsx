import { useId, type CSSProperties } from 'react';
import { WidgetPalette } from '../core/WidgetTheme';

export type FacetedCompassRoseProps = {
  angle?: number;
  className?: string;
  style?: CSSProperties;
  size?: number;
};

/** Faceted 3D compass rose — Gemini visual harvest, tokenized (Kap 6). */
export function FacetedCompassRose({
  angle = 28,
  className = '',
  style,
  size,
}: FacetedCompassRoseProps) {
  const uid = useId().replace(/:/g, '');
  const goldLight = `cw-art-compass-goldLight-${uid}`;
  const goldDark = `cw-art-compass-goldDark-${uid}`;
  const needleLight = `cw-art-compass-needleLight-${uid}`;
  const needleDark = `cw-art-compass-needleDark-${uid}`;
  const glassGlow = `cw-art-compass-glassGlow-${uid}`;
  const goldGlow = `cw-art-compass-goldGlow-${uid}`;

  const merged: CSSProperties = {
    width: size,
    height: size,
    display: 'block',
    ...style,
  };

  return (
    <svg viewBox="0 0 200 200" className={className} style={merged} aria-hidden focusable="false">
      <defs>
        <linearGradient id={goldLight} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={WidgetPalette.premiumGoldLight} />
          <stop offset="45%" stopColor={WidgetPalette.premiumGold} />
          <stop offset="100%" stopColor={WidgetPalette.premiumGoldDim} />
        </linearGradient>
        <linearGradient id={goldDark} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={WidgetPalette.premiumGoldDim} />
          <stop offset="100%" stopColor="#3d2b04" />
        </linearGradient>
        <linearGradient id={needleLight} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={WidgetPalette.premiumGoldLight} />
        </linearGradient>
        <linearGradient id={needleDark} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={WidgetPalette.premiumGold} />
          <stop offset="100%" stopColor="#573e07" />
        </linearGradient>
        <radialGradient id={glassGlow} cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
        <filter id={goldGlow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle
        cx="100"
        cy="100"
        r="94"
        fill={WidgetPalette.deepSpaceBlue}
        stroke={`url(#${goldLight})`}
        strokeWidth="3.5"
        filter={`url(#${goldGlow})`}
      />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#1b283d" strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx="100" cy="100" r="78" fill="#070c18" stroke="#1d2e4a" strokeWidth="1" />

      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="26"
          x2="100"
          y2={deg % 90 === 0 ? '35' : '30'}
          stroke={deg % 90 === 0 ? WidgetPalette.premiumGoldLight : '#3d5270'}
          strokeWidth={deg % 90 === 0 ? 2.5 : 1}
          transform={`rotate(${deg} 100 100)`}
        />
      ))}

      <text
        x="100"
        y="21"
        fill={WidgetPalette.premiumGoldLight}
        fontSize="12"
        fontWeight="800"
        textAnchor="middle"
        letterSpacing="1"
      >
        N
      </text>
      <text x="100" y="189" fill="#597196" fontSize="10" fontWeight="bold" textAnchor="middle">
        S
      </text>
      <text x="15" y="104" fill="#597196" fontSize="10" fontWeight="bold" textAnchor="middle">
        W
      </text>
      <text x="185" y="104" fill="#597196" fontSize="10" fontWeight="bold" textAnchor="middle">
        E
      </text>

      <polygon points="100,100 100,52 107,100" fill={`url(#${goldLight})`} />
      <polygon points="100,100 100,52 93,100" fill={`url(#${goldDark})`} />
      <polygon points="100,100 100,148 107,100" fill={`url(#${goldDark})`} />
      <polygon points="100,100 100,148 93,100" fill={`url(#${goldLight})`} />
      <polygon points="100,100 148,100 100,107" fill={`url(#${goldLight})`} />
      <polygon points="100,100 148,100 100,93" fill={`url(#${goldDark})`} />
      <polygon points="100,100 52,100 100,107" fill={`url(#${goldDark})`} />
      <polygon points="100,100 52,100 100,93" fill={`url(#${goldLight})`} />

      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: '100px 100px',
          transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <polygon points="100,100 100,30 111,100" fill={`url(#${needleLight})`} />
        <polygon points="100,100 100,30 89,100" fill={`url(#${needleDark})`} />
        <polygon points="100,100 100,170 111,100" fill={`url(#${needleDark})`} />
        <polygon points="100,100 100,170 89,100" fill="#241a04" />
      </g>

      <circle cx="100" cy="100" r="76" fill={`url(#${glassGlow})`} />
      <circle
        cx="100"
        cy="100"
        r="10"
        fill={`url(#${goldDark})`}
        stroke={WidgetPalette.premiumGoldLight}
        strokeWidth="1.5"
      />
      <circle cx="100" cy="100" r="4" fill={WidgetPalette.premiumGoldLight} />
    </svg>
  );
}
