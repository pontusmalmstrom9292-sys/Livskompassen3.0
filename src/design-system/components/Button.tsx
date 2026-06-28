import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type ButtonVariant = 'accent' | 'secondary' | 'success' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm' | 'icon';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  accent: 'ds-btn--accent',
  secondary: 'ds-btn--secondary',
  success: 'ds-btn--success',
  ghost: 'ds-btn--ghost',
  danger: 'ds-btn--danger',
};

/** Legacy alias map for gradual migration */
export const BUTTON_LEGACY_VARIANT = {
  primaryGold: 'accent',
  continue: 'secondary',
  save: 'success',
  ghost: 'ghost',
} as const;

/**
 * Button — pill CTA with token sizing and focus ring.
 * Maps to btn-pill--* for prod visual parity.
 */
export function Button({
  variant = 'accent',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'ds-btn',
        VARIANT_CLASS[variant],
        size === 'sm' && 'ds-btn--sm',
        size === 'icon' && 'ds-btn--icon',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
