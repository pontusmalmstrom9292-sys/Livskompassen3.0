import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type NavigationProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  label?: string;
};

/** Navigation — horizontal nav group (dock or toolbar). */
export function Navigation({ children, className, label, ...rest }: NavigationProps) {
  return (
    <nav className={cn('flex items-end justify-center gap-[var(--ds-space-2)]', className)} aria-label={label} {...rest}>
      {children}
    </nav>
  );
}

export type NavItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  icon?: ReactNode;
};

/** NavItem — dock/toolbar navigation control with 44px target. */
export function NavItem({ label, active, icon, className, children, ...rest }: NavItemProps) {
  return (
    <button
      type="button"
      className={cn('ds-nav-item exec-dock-bar__side', active && 'ds-nav-item--active exec-dock-bar__side--active', className)}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {icon ? <span className="exec-dock-bar__icon" aria-hidden>{icon}</span> : null}
      {children}
      <span className="ds-nav-item__label exec-dock-bar__label">{label}</span>
    </button>
  );
}

export type NavLabelProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function NavLabel({ className, children, ...rest }: NavLabelProps) {
  return (
    <span className={cn('ds-nav-item__label', className)} {...rest}>
      {children}
    </span>
  );
}
