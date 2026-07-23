import { useId, type CSSProperties } from 'react';
import { WidgetPalette } from '../core/WidgetTheme';

export type LotusEmblemProps = { className?: string; style?: CSSProperties; size?: number };

/** Lotus emblem — Gemini visual harvest for Safe Harbor. */
export function LotusEmblem({ className = '', style, size = 64 }: LotusEmblemProps) {
  const uid = useId().replace(/:/g, '');
  const lotusBlue = `cw-art-lotus-blue-${uid}`;
  const lotusGoldRim = `cw-art-lotus-rim-${uid}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={['cw-lotus', className].filter(Boolean).join(' ')} style={style} aria-hidden focusable="false">
      <defs>
        <linearGradient id={lotusBlue} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={WidgetPalette.etherealBlue} />
          <stop offset="55%" stopColor={WidgetPalette.etherealBlue} />
          <stop offset="100%" stopColor={WidgetPalette.deepSpaceBlue} />
        </linearGradient>
        <linearGradient id={lotusGoldRim} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={WidgetPalette.premiumGoldLight} /><stop offset="100%" stopColor={WidgetPalette.premiumGold} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill={WidgetPalette.deepSpaceBlue} stroke={`url(#${lotusGoldRim})`} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="36" fill="none" stroke={WidgetPalette.premiumGoldDim} strokeWidth="1" opacity="0.45" />
      <path d="M50 20 C60 38, 62 55, 50 78 C38 55, 40 38, 50 20 Z" fill={`url(#${lotusBlue})`} stroke={WidgetPalette.etherealBlue} strokeWidth="1" />
      <path d="M50 28 C70 40, 75 60, 50 78 C25 60, 30 40, 50 28 Z" fill={`url(#${lotusBlue})`} opacity="0.85" />
      <path d="M50 35 C80 48, 80 70, 50 78 C20 70, 20 48, 50 35 Z" fill={`url(#${lotusBlue})`} opacity="0.6" />
      <circle cx="50" cy="58" r="5" fill={WidgetPalette.premiumGoldLight} />
    </svg>
  );
}
