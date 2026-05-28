import { useNavigate } from 'react-router-dom';
import { HUB_MORE_ACTIONS } from '../navigation/hubContextBar';
import { renderHubContextIcon } from '../navigation/hubContextIcons';

type Props = {
  onNavigate?: () => void;
};

/** Snabbval (anteckning, inspelning, …) — endast i sidomenyn, inte dubbelrad ovanför dock. */
export function DrawerQuickActions({ onNavigate }: Props) {
  const navigate = useNavigate();

  return (
    <div className="nav-drawer__quick" aria-label="Snabbval">
      <p className="nav-drawer__quick-title">Snabbval</p>
      <div className="nav-drawer__quick-grid">
        {HUB_MORE_ACTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="nav-drawer__quick-btn"
            onClick={() => {
              navigate(item.to);
              onNavigate?.();
            }}
          >
            <span className="nav-drawer__quick-icon" aria-hidden>
              {renderHubContextIcon(item.icon, 'h-5 w-5')}
            </span>
            <span className="nav-drawer__quick-label">{item.label}</span>
          </button>
        ))}
      </div>
      <p className="nav-drawer__quick-hint">Håll kompassen i dock 3 s för Valv.</p>
    </div>
  );
}
