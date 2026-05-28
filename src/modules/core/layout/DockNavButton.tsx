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
        className="dock-nav-btn__icon-shell header-chrome-btn header-chrome-btn--round"
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
};

/** Innehåll för NavLink (ingen knapp i knapp). */
export function DockNavLinkFace({ label, icon, active }: LinkFaceProps) {
  return (
    <>
      <span
        className="dock-nav-btn__icon-shell header-chrome-btn header-chrome-btn--round"
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
