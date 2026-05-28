import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

type Props = {
  label: string;
  Icon: LucideIcon;
  active?: boolean;
  variant?: 'slot' | 'side';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Dock-knapp — guld line-ikon i kapsel (tydligare än liten chrome-thumbnail). */
export function DockNavButton({
  label,
  Icon,
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
      <span className="dock-nav-btn__icon-wrap" aria-hidden>
        <Icon className="dock-nav-btn__icon" strokeWidth={1.65} />
      </span>
      <span className="dock-nav-btn__label">{label}</span>
    </button>
  );
}

type LinkFaceProps = {
  label: string;
  Icon: LucideIcon;
  active?: boolean;
  variant?: 'slot' | 'side';
};

/** Innehåll för NavLink (ingen knapp i knapp). */
export function DockNavLinkFace({ label, Icon, active, variant = 'side' }: LinkFaceProps) {
  return (
    <>
      <span
        className={clsx(
          'dock-nav-btn__icon-wrap',
          variant === 'side' && 'dock-nav-btn__icon-wrap--side',
          active && 'dock-nav-btn__icon-wrap--active',
        )}
        aria-hidden
      >
        <Icon className="dock-nav-btn__icon" strokeWidth={1.65} />
      </span>
      <span className={clsx('dock-nav-btn__label', active && 'dock-nav-btn__label--active')}>
        {label}
      </span>
    </>
  );
}
