import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primaryGold' | 'continue' | 'save' | 'ghost';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primaryGold: 'btn-pill--accent',
  continue: 'btn-pill--secondary',
  save: 'btn-pill--success',
  ghost: 'btn-pill--ghost',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({
  variant = 'primaryGold',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(VARIANT_CLASS[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
