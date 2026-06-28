import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../utils/cn';

export type ButtonVariant = 'accent' | 'secondary' | 'success' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm' | 'icon';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  accent: 'ds-btn--accent',
  secondary: 'ds-btn--secondary',
  success: 'ds-btn--success',
  ghost: 'ds-btn--ghost',
  danger: 'ds-btn--danger',
};

/** Shared class string for Button and ButtonLink */
export function buttonClassName(
  variant: ButtonVariant = 'accent',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(
    'ds-btn',
    VARIANT_CLASS[variant],
    size === 'sm' && 'ds-btn--sm',
    size === 'icon' && 'ds-btn--icon',
    className,
  );
}

/** Legacy alias map for gradual migration */
export const BUTTON_LEGACY_VARIANT = {
  primaryGold: 'accent',
  continue: 'secondary',
  save: 'success',
  ghost: 'ghost',
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

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
    <button type={type} className={buttonClassName(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** Router Link styled as design-system button */
export function ButtonLink({ variant = 'accent', size = 'md', className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, size, className)} {...rest} />;
}
