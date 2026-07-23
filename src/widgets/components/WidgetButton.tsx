import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { triggerWidgetHaptic, type WidgetHapticProfile } from '../core/WidgetActions';
import { playPressAnimation } from '../core/WidgetAnimations';
import { WidgetPalette, WidgetTouch, WidgetType } from '../core/WidgetTheme';
import { useRef } from 'react';

export type WidgetButtonVariant = 'gold' | 'ghost' | 'ethereal' | 'quiet';

export type WidgetButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: WidgetButtonVariant;
  /** Touch height: min 56, premium 64–72 */
  size?: 'min' | 'premium' | 'max';
  haptic?: WidgetHapticProfile | false;
  fullWidth?: boolean;
};

const HEIGHT: Record<NonNullable<WidgetButtonProps['size']>, number> = {
  min: WidgetTouch.minDp,
  premium: WidgetTouch.premiumMinDp,
  max: WidgetTouch.premiumMaxDp,
};

/**
 * WidgetButton — 56–72 dp + haptic (UX Law 05 / 09).
 */
export function WidgetButton({
  children,
  variant = 'gold',
  size = 'premium',
  haptic = 'light',
  fullWidth,
  className,
  style,
  onClick,
  type = 'button',
  disabled,
  ...rest
}: WidgetButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const h = HEIGHT[size];

  const palette =
    variant === 'gold'
      ? {
          background: `linear-gradient(165deg, ${WidgetPalette.premiumGoldLight} 0%, ${WidgetPalette.premiumGold} 48%, ${WidgetPalette.premiumGoldDim} 100%)`,
          color: WidgetPalette.deepSpaceBlue,
          border: `1px solid color-mix(in srgb, ${WidgetPalette.premiumGoldLight} 55%, transparent)`,
          boxShadow: `0 8px 18px rgba(2, 6, 23, 0.35), inset 0 1px 0 rgba(253, 230, 138, 0.35)`,
        }
      : variant === 'ethereal'
        ? {
            background: `color-mix(in srgb, ${WidgetPalette.etherealBlue} 22%, ${WidgetPalette.deepSpaceBlue})`,
            color: WidgetPalette.textPrimary,
            border: `1px solid color-mix(in srgb, ${WidgetPalette.etherealBlue} 45%, transparent)`,
          }
        : variant === 'quiet'
          ? {
              background: 'transparent',
              color: WidgetPalette.mutedText,
              border: `1px solid color-mix(in srgb, ${WidgetPalette.premiumGold} 18%, transparent)`,
            }
          : {
              background: 'transparent',
              color: WidgetPalette.premiumGold,
              border: `1px solid color-mix(in srgb, ${WidgetPalette.premiumGold} 28%, transparent)`,
            };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={['cw-btn', `cw-btn--${variant}`, fullWidth && 'cw-btn--full', 'cw-btn--touch', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        minHeight: h,
        minWidth: h,
        padding: '0 1.1rem',
        borderRadius: WidgetType.radiusPillPx,
        fontWeight: 600,
        fontSize: '0.95rem',
        letterSpacing: '0.02em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: fullWidth ? '100%' : undefined,
        transition: 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease',
        ...palette,
        ...style,
      }}
      onClick={(e) => {
        if (disabled) return;
        if (haptic !== false) triggerWidgetHaptic(haptic);
        playPressAnimation(ref.current);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
