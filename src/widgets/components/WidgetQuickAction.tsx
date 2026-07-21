import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { dispatchWidgetGesture } from '../core/WidgetActions';
import { WidgetMaterial, WidgetPalette, WidgetTouch, WidgetType } from '../core/WidgetTheme';

export type WidgetQuickActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  widgetId: string;
  label: string;
  icon?: ReactNode;
  /** Defaults to primary tap */
  gesture?: 'tap' | 'longPress';
};

/**
 * WidgetQuickAction — one-tap capture/action surface (bible 3.3).
 */
export function WidgetQuickAction({
  widgetId,
  label,
  icon,
  gesture = 'tap',
  className,
  style,
  onClick,
  type = 'button',
  disabled,
  ...rest
}: WidgetQuickActionProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={label}
      className={['cw-quick', className].filter(Boolean).join(' ')}
      style={{
        minHeight: WidgetTouch.premiumMinDp,
        minWidth: WidgetTouch.premiumMinDp,
        padding: '0.65rem 0.85rem',
        borderRadius: WidgetType.radiusWellPx,
        border: `1px solid ${WidgetMaterial.goldBorderSoft}`,
        background: WidgetMaterial.glassFill,
        boxShadow: WidgetMaterial.insetShadow,
        color: WidgetPalette.premiumGold,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.35rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontSize: '0.72rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        ...style,
      }}
      onClick={(e) => {
        if (disabled) return;
        void dispatchWidgetGesture({ widgetId, gesture });
        onClick?.(e);
      }}
      {...rest}
    >
      {icon ? <span aria-hidden style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icon}</span> : null}
      <span>{label}</span>
    </button>
  );
}
