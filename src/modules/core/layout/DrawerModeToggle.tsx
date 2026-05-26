import { clsx } from 'clsx';
import type { NavDrawerSection } from '../navigation/navTruth';

type Props = {
  mode: NavDrawerSection;
  onChange: (mode: NavDrawerSection) => void;
};

export function DrawerModeToggle({ mode, onChange }: Props) {
  return (
    <div className="nav-drawer__mode" role="tablist" aria-label="Menyläge">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'vardag'}
        className={clsx('nav-drawer__mode-btn', mode === 'vardag' && 'nav-drawer__mode-btn--active')}
        onClick={() => onChange('vardag')}
      >
        Vardag
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'valv'}
        className={clsx('nav-drawer__mode-btn', mode === 'valv' && 'nav-drawer__mode-btn--active')}
        onClick={() => onChange('valv')}
      >
        Valv
      </button>
    </div>
  );
}
