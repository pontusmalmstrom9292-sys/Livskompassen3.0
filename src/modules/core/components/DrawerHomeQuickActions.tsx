import { useNavigate } from 'react-router-dom';
import { FYREN_HOME_QUICK_ACTIONS } from '../constants/fyrenHomeQuickActions';

type Props = {
  onNavigate?: () => void;
};

/** Hem — snabbåtgärder inuti NavigationDrawer (kopplade till hamburgermeny). */
export function DrawerHomeQuickActions({ onNavigate }: Props) {
  const navigate = useNavigate();

  return (
    <div className="nav-drawer__quick">
      <p className="nav-drawer__quick-eyebrow">Snabbåtgärder</p>
      <div className="nav-drawer__quick-grid" role="group" aria-label="Snabbåtgärder hem">
        {FYREN_HOME_QUICK_ACTIONS.map(({ id, label, to, Icon }) => (
          <button
            key={id}
            type="button"
            className="nav-drawer__quick-chip min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
            aria-label={label}
            onClick={() => {
              navigate(to);
              onNavigate?.();
            }}
          >
            <span className="nav-drawer__quick-chip-icon" aria-hidden>
              <Icon className="h-4 w-4" strokeWidth={1.35} />
            </span>
            <span className="nav-drawer__quick-chip-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
