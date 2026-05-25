import { clsx } from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { FYREN_HOME_QUICK_ACTIONS } from '../constants/fyrenHomeQuickActions';

type Props = {
  variant?: 'inBar' | 'belowBar';
};

/** Hem — snabbåtgärder (inBar i glass-header eller legacy under bar). */
export function FyrenHeaderQuickStrip({ variant = 'inBar' }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname !== '/') return null;
  if (location.pathname.startsWith('/widget')) return null;

  return (
    <nav
      className={clsx(
        'fyren-header-strip',
        variant === 'inBar' && 'fyren-header-strip--in-bar',
      )}
      aria-label="Snabbåtgärder hem"
    >
      {FYREN_HOME_QUICK_ACTIONS.map(({ id, label, to, Icon }) => (
        <button
          key={id}
          type="button"
          className="fyren-header-strip__chip"
          aria-label={label}
          onClick={() => navigate(to)}
        >
          <span className="fyren-header-strip__icon" aria-hidden>
            <Icon className="h-4 w-4" strokeWidth={1.35} />
          </span>
          <span className="fyren-header-strip__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
