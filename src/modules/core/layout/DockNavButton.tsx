import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type Props = {
  label: string;
  icon: ReactNode;
  active?: boolean;
  variant?: 'slot' | 'side';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Dock-knapp — premium v4-chrome (hel ikon, ingen dubbel platta). */
export function DockNavButton({
  label,
  icon,
  active = false,
  variant = 'slot',
  className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={clsx(
        'dock-nav-btn',
        variant === 'side' && 'dock-nav-btn--side',
        active && 'dock-nav-btn--active',
        className,
      )}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      <span
        className={clsx(
          'hub-chrome-tile hub-chrome-tile--dock dock-nav-btn__icon-shell',
          variant === 'side' && 'hub-chrome-tile--dock-side dock-nav-btn__icon-shell--side',
          active && 'hub-chrome-tile--active',
        )}
        aria-hidden
      >
        {icon}
      </span>
      <span className="dock-nav-btn__label">{label}</span>
    </button>
  );
}

type LinkFaceProps = {
  label: string;
  icon: ReactNode;
  active?: boolean;
  variant?: 'slot' | 'side';
};

/** Innehåll för NavLink (ingen knapp i knapp). */
export function DockNavLinkFace({ label, icon, active, variant = 'side' }: LinkFaceProps) {
  return (
    <>
      <span
        className={clsx(
          'hub-chrome-tile hub-chrome-tile--dock dock-nav-btn__icon-shell',
          variant === 'side' && 'hub-chrome-tile--dock-side dock-nav-btn__icon-shell--side',
          active && 'hub-chrome-tile--active',
        )}
        aria-hidden
      >
        {icon}
      </span>
      <span className={clsx('dock-nav-btn__label', active && 'dock-nav-btn__label--active')}>
        {label}
      </span>
    </>
  );
}
