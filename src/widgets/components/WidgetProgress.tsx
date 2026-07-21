import type { HTMLAttributes } from 'react';
import { WidgetMaterial, WidgetPalette, WidgetType } from '../core/WidgetTheme';

export type WidgetProgressProps = HTMLAttributes<HTMLDivElement> & {
  value: number;
  max?: number;
  variant?: 'linear' | 'circular';
  label?: string;
  size?: number;
};

/**
 * WidgetProgress — ethereal fill in inset well (bible 3.3 / 6.4).
 */
export function WidgetProgress({
  value,
  max = 100,
  variant = 'linear',
  label,
  size = 72,
  className,
  style,
  ...rest
}: WidgetProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  if (variant === 'circular') {
    const stroke = 6;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    return (
      <div
        className={['cw-progress', 'cw-progress--circular', className].filter(Boolean).join(' ')}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          boxShadow: WidgetMaterial.insetShadow,
          background: WidgetPalette.deepSpaceBlue,
          display: 'grid',
          placeItems: 'center',
          ...style,
        }}
        {...rest}
      >
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(148, 163, 184, 0.18)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={WidgetPalette.etherealBlue}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 420ms cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={['cw-progress', 'cw-progress--linear', className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{
        height: 10,
        borderRadius: WidgetType.radiusPillPx,
        background: WidgetPalette.deepSpaceBlue,
        boxShadow: WidgetMaterial.insetShadow,
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: WidgetType.radiusPillPx,
          background: `linear-gradient(90deg, ${WidgetPalette.etherealBlue}, color-mix(in srgb, ${WidgetPalette.etherealBlue} 70%, ${WidgetPalette.premiumGoldLight}))`,
          transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
}
