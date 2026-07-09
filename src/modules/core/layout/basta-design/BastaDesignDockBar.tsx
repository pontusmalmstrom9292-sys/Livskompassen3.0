import type { CSSProperties, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Inbox, Landmark, LayoutGrid, PenLine, Users2 } from 'lucide-react';
import { FyrenProgressRing } from '../../ui/FyrenProgressRing';
import { BastaDesignDockCompass } from './BastaDesignDockCompass';

type SideProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function DockSide({ label, active, onClick, children }: SideProps) {
  return (
    <button
      type="button"
      className={clsx('basta-dock-bar__side', active && 'basta-dock-bar__side--active')}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="basta-dock-bar__icon" aria-hidden>
        {children}
      </span>
      <span className="basta-dock-bar__label">{label}</span>
    </button>
  );
}

type Props = {
  pathname: string;
  isHome: boolean;
  isFamiljen: boolean;
  isHjartat: boolean;
  resurserOpen: boolean;
  showFyrenRing: boolean;
  progress: number;
  isHolding: boolean;
  centerHoldHandlers: Record<string, unknown>;
  onAnteckning: () => void;
  onFamiljen: () => void;
  onVentil: () => void;
  onInkast: () => void;
  onResurser: () => void;
};

/** Prod dock — Figma «bästa designv2» (6 zoner + hero-kompass). */
export function BastaDesignDockBar({
  pathname,
  isHome,
  isFamiljen,
  isHjartat,
  resurserOpen,
  showFyrenRing,
  progress,
  isHolding,
  centerHoldHandlers,
  onAnteckning,
  onFamiljen,
  onVentil,
  onInkast,
  onResurser,
}: Props) {
  return (
    <nav className="basta-dock-bar basta-dock-bar--v2" aria-label="Huvudnavigation">
      <DockSide
        label="Anteckning"
        active={pathname.startsWith('/widget/anteckning')}
        onClick={onAnteckning}
      >
        <PenLine size={20} strokeWidth={1.75} />
      </DockSide>

      <DockSide label="Familj" active={isFamiljen} onClick={onFamiljen}>
        <Users2 size={20} strokeWidth={1.75} />
      </DockSide>

      <div className="basta-dock-bar__compass-slot">
        <button
          type="button"
          className={clsx(
            'basta-dock-bar__compass',
            isHome && 'basta-dock-bar__compass--home',
            isHolding && 'basta-dock-bar__compass--holding',
          )}
          aria-label="Hamn. Håll tre sekunder för Valv."
          style={
            progress > 0
              ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
              : undefined
          }
          {...centerHoldHandlers}
        >
          {showFyrenRing ? <FyrenProgressRing progress={progress} /> : null}
          <BastaDesignDockCompass className="basta-dock-bar__compass-mark" />
        </button>
      </div>

      <DockSide label="Mentil" active={isHjartat} onClick={onVentil}>
        <Landmark size={20} strokeWidth={1.75} />
      </DockSide>

      <DockSide
        label="Inkast"
        active={pathname.startsWith('/planering/input')}
        onClick={onInkast}
      >
        <Inbox size={20} strokeWidth={1.75} />
      </DockSide>

      <DockSide label="Resurser" active={resurserOpen} onClick={onResurser}>
        <LayoutGrid size={20} strokeWidth={1.75} />
      </DockSide>
    </nav>
  );
}
