import { useLocation, useNavigate } from 'react-router-dom';
import { FYREN_HOME_QUICK_ACTIONS } from '../constants/fyrenHomeQuickActions';

/** Hem — horisontell snabbstrip under header (ersätter höger-rail). */
export function FyrenHeaderQuickStrip() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname !== '/') return null;
  if (location.pathname.startsWith('/widget')) return null;

  return (
    <nav className="fyren-header-strip" aria-label="Snabbåtgärder hem">
      {FYREN_HOME_QUICK_ACTIONS.map(({ id, label, to, Icon }) => (
        <button
          key={id}
          type="button"
          className="fyren-header-strip__chip"
          aria-label={label}
          onClick={() => navigate(to)}
        >
          <span className="fyren-header-strip__icon" aria-hidden>
            {id === 'valv' ? (
              <Icon className="h-4 w-4" />
            ) : (
              <Icon className="h-4 w-4" strokeWidth={1.35} />
            )}
          </span>
          <span className="fyren-header-strip__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
