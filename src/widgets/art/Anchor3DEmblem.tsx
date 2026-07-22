import { useId, type CSSProperties } from 'react';
import { WidgetPalette } from '../core/WidgetTheme';

export type Anchor3DEmblemProps = { className?: string; style?: CSSProperties; size?: number };

/** 3D gold anchor — Gemini visual harvest for Daily Anchor. */
export function Anchor3DEmblem({ className = '', style, size = 56 }: Anchor3DEmblemProps) {
  const uid = useId().replace(/:/g, '');
  const gold3d = `cw-art-anchor-gold-${uid}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={['cw-art-anchor', className].filter(Boolean).join(' ')} style={style} aria-hidden focusable="false">
      <defs>
        <linearGradient id={gold3d} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={WidgetPalette.premiumGoldLight} />
          <stop offset="40%" stopColor={WidgetPalette.premiumGold} />
          <stop offset="80%" stopColor={WidgetPalette.premiumGoldDim} />
          <stop offset="100%" stopColor="#4a3505" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="22" r="8" fill="none" stroke={`url(#${gold3d})`} strokeWidth="4" />
      <line x1="50" y1="30" x2="50" y2="82" stroke={`url(#${gold3d})`} strokeWidth="6" strokeLinecap="round" />
      <line x1="32" y1="42" x2="68" y2="42" stroke={`url(#${gold3d})`} strokeWidth="5" strokeLinecap="round" />
      <path d="M20 54 C20 84, 80 84, 80 54" fill="none" stroke={`url(#${gold3d})`} strokeWidth="6" strokeLinecap="round" />
      <polygon points="16,54 24,54 20,44" fill={`url(#${gold3d})`} />
      <polygon points="76,54 84,54 80,44" fill={`url(#${gold3d})`} />
    </svg>
  );
}
