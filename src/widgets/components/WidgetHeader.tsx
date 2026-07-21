import type { HTMLAttributes, ReactNode } from 'react';
import { WidgetPalette, WidgetType } from '../core/WidgetTheme';

export type WidgetHeaderProps = HTMLAttributes<HTMLElement> & {
  title: string;
  icon?: ReactNode;
  /** Offline / pending sync indicator */
  offline?: boolean;
  subtitle?: string;
  trailing?: ReactNode;
};

/**
 * WidgetHeader — caps + tracking, optional sync dot (bible 3.3 / 6.3).
 */
export function WidgetHeader({
  title,
  icon,
  offline,
  subtitle,
  trailing,
  className,
  style,
  ...rest
}: WidgetHeaderProps) {
  return (
    <header
      className={['cw-header', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        width: '100%',
        ...style,
      }}
      {...rest}
    >
      {icon ? (
        <span
          className="cw-header__icon"
          style={{ color: WidgetPalette.premiumGold, display: 'inline-flex', flexShrink: 0 }}
          aria-hidden
        >
          {icon}
        </span>
      ) : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2
          className="cw-header__title"
          style={{
            margin: 0,
            fontSize: '0.78rem',
            fontWeight: 650,
            letterSpacing: `${WidgetType.headingTrackingEm}em`,
            textTransform: WidgetType.headingTransform,
            color: WidgetPalette.premiumGoldLight,
            lineHeight: 1.25,
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            aria-live="polite"
            style={{
              margin: '0.2rem 0 0',
              fontSize: '0.8rem',
              color: WidgetPalette.mutedText,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {offline ? (
        <span
          className="cw-header__sync cw-header__sync--offline"
          title="Sparat lokalt — synkar när nät finns"
          aria-label="Offline, sparat lokalt"
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: WidgetPalette.premiumGoldDim,
            boxShadow: `0 0 8px ${WidgetPalette.premiumGoldDim}`,
            flexShrink: 0,
          }}
        />
      ) : null}
      {trailing}
    </header>
  );
}
