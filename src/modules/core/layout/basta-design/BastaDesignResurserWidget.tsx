/* PROTECTED BASTA-DESIGN DOCK LOCK — docs/design/BASTA-DESIGN-DOCK-LOCK.md · npm run smoke:basta-dock-lock */
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { RESURSER_NAV_ROWS } from '../../navigation/resurserNavConfig';

type Props = {
  placement?: 'header' | 'header-icon' | 'dock';
  open: boolean;
  onToggle: () => void;
  onOpenFull: () => void;
};

const QUICK_IDS = ['ekonomi', 'plan', 'mabra', 'dagbok', 'familjen', 'install'] as const;

/** Utfällbar Resurser — header (prod) eller legacy dock-fäste. */
export function BastaDesignResurserWidget({
  placement = 'header',
  open,
  onToggle,
  onOpenFull,
}: Props) {
  const navigate = useNavigate();
  const rows = RESURSER_NAV_ROWS.filter((r) => (QUICK_IDS as readonly string[]).includes(r.id));

  const headerPlacement = placement === 'header' || placement === 'header-icon';

  return (
    <div
      className={clsx(
        'basta-resurser-widget',
        headerPlacement && 'basta-resurser-widget--header',
        placement === 'header-icon' && 'basta-resurser-widget--header-icon',
        open && 'basta-resurser-widget--open',
      )}
    >
      <div
        className="basta-resurser-widget__panel"
        id="basta-resurser-widget-panel"
        role="region"
        aria-label="Snabbresurser"
        hidden={!open}
      >
        <ul className="basta-resurser-widget__list">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  className="basta-resurser-widget__row"
                  onClick={() => {
                    onToggle();
                    navigate(row.path);
                  }}
                >
                  <span className="basta-resurser-widget__row-icon" aria-hidden>
                    <Icon size={14} strokeWidth={1.75} />
                  </span>
                  <span className="basta-resurser-widget__row-text">
                    <span className="basta-resurser-widget__row-label">{row.label}</span>
                    <span className="basta-resurser-widget__row-sub">{row.sub}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="basta-resurser-widget__all" onClick={onOpenFull}>
          Alla resurser
        </button>
      </div>

      <button
        type="button"
        className="basta-resurser-widget__tab"
        aria-expanded={open}
        aria-controls="basta-resurser-widget-panel"
        aria-label={open ? 'Stäng resurser' : 'Fäll ut resurser'}
        onClick={onToggle}
      >
        <LayoutGrid
          size={placement === 'header-icon' ? 16 : placement === 'header' ? 14 : 15}
          strokeWidth={1.75}
          aria-hidden
        />
        {placement !== 'header-icon' ? (
          <>
            <span className="basta-resurser-widget__tab-label">
              {placement === 'header' ? 'Resurser' : 'Res'}
            </span>
            <ChevronDown
              size={10}
              className={clsx('basta-resurser-widget__chevron', open && 'basta-resurser-widget__chevron--up')}
              aria-hidden
            />
          </>
        ) : null}
      </button>
    </div>
  );
}
