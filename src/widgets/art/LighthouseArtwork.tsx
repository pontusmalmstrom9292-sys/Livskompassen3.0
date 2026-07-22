import { useId, type CSSProperties } from 'react';
import { WidgetPalette } from '../core/WidgetTheme';

export type LighthouseArtworkProps = {
  className?: string;
  style?: CSSProperties;
};

/** Animated lighthouse — Gemini visual harvest; beam respects reduced-motion via CSS. */
export function LighthouseArtwork({ className = '', style }: LighthouseArtworkProps) {
  const uid = useId().replace(/:/g, '');
  const lhSky = `cw-art-lh-sky-${uid}`;
  const beaconGlow = `cw-art-lh-beacon-${uid}`;
  const lightBeam = `cw-art-lh-beam-${uid}`;
  const cliffGrad = `cw-art-lh-cliff-${uid}`;

  return (
    <svg
      viewBox="0 0 320 170"
      className={['cw-art-lighthouse', className].filter(Boolean).join(' ')}
      style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 16, ...style }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={lhSky} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#081021" />
          <stop offset="60%" stopColor="#101d36" />
          <stop offset="100%" stopColor="#182744" />
        </linearGradient>
        <radialGradient id={beaconGlow} cx="72%" cy="38%" r="45%">
          <stop offset="0%" stopColor={WidgetPalette.premiumGoldLight} stopOpacity="0.9" />
          <stop offset="25%" stopColor={WidgetPalette.premiumGold} stopOpacity="0.45" />
          <stop offset="70%" stopColor={WidgetPalette.premiumGold} stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={lightBeam} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={WidgetPalette.premiumGoldLight} stopOpacity="0.8" />
          <stop offset="40%" stopColor={WidgetPalette.premiumGold} stopOpacity="0.32" />
          <stop offset="100%" stopColor={WidgetPalette.premiumGold} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={cliffGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a273b" />
          <stop offset="100%" stopColor="#080e19" />
        </linearGradient>
      </defs>

      <rect width="320" height="170" fill={`url(#${lhSky})`} />
      <circle cx="40" cy="25" r="1" fill="#ffffff" opacity="0.8" />
      <circle cx="90" cy="40" r="1.5" fill={WidgetPalette.premiumGoldLight} opacity="0.9" />
      <circle cx="150" cy="18" r="1" fill="#ffffff" opacity="0.6" />
      <circle cx="280" cy="30" r="1" fill="#ffffff" opacity="0.7" />

      <g className="cw-art-lighthouse__beam">
        <polygon points="230,58 -20,10 -20,120" fill={`url(#${lightBeam})`} />
      </g>
      <circle cx="230" cy="58" r="45" fill={`url(#${beaconGlow})`} />

      <path
        d="M0 125 Q60 120 120 130 T240 125 T320 130 L320 170 L0 170 Z"
        fill="#080e1a"
        opacity="0.95"
      />
      <path d="M160 170 L205 105 L265 98 L320 135 L320 170 Z" fill={`url(#${cliffGrad})`} />

      <polygon points="222,105 238,105 235,62 225,62" fill="#f8fafc" />
      <polygon points="222,105 228,105 227,62 225,62" fill="#cbd5e1" />
      <polygon points="223,95 237,95 236,85 224,85" fill="#991b1b" />
      <polygon points="224,75 236,75 235,67 225,67" fill="#991b1b" />
      <rect x="224" y="55" width="12" height="7" fill={WidgetPalette.premiumGold} />
      <path d="M223 55 L230 48 L237 55 Z" fill="#1e293b" />
    </svg>
  );
}
