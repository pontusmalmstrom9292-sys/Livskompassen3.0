import type { CSSProperties, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Landmark, LayoutGrid, PenLine, Inbox } from 'lucide-react';
import { DrawerL2Icon } from '../ui/drawerL2Icons/DrawerL2Icon';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
import { ExecutiveDecorCompass } from '../ui/executive/ExecutiveDecorCompass';

type SideProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ExecDockSide({ label, active, onClick, children }: SideProps) {
  return (
    <button
      type="button"
      className={clsx('exec-dock-bar__side', active && 'exec-dock-bar__side--active')}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="exec-dock-bar__icon" aria-hidden>
        {children}
      </span>
      <span className="exec-dock-bar__label">{label}</span>
    </button>
  );
}

type Props = {
  pathname: string;
  isHome: boolean;
  isFamiljen: boolean;
  isHjartat: boolean;
  resurserOpen: boolean;
  snabbstartOpen: boolean;
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

/** Referensdock — platt bar, etiketter, stor kompass (ingen båge). */
export function ExecutiveDockBar({
  pathname,
  isHome,
  isFamiljen,
  isHjartat,
  resurserOpen,
  snabbstartOpen,
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
    <nav className="exec-dock-bar" aria-label="Huvudnavigation">
      <ExecDockSide
        label="Bevis-rad"
        active={pathname.startsWith('/widget/anteckning')}
        onClick={onAnteckning}
      >
        <PenLine className="exec-dock-bar__glyph" strokeWidth={1.5} />
      </ExecDockSide>

      <ExecDockSide label="Familj" active={isFamiljen} onClick={onFamiljen}>
        <DrawerL2Icon hubId="familjen" className="exec-dock-bar__glyph exec-dock-bar__glyph--l2" />
      </ExecDockSide>

      <div className="exec-dock-bar__compass-slot">
        <button
          type="button"
          className={clsx(
            'exec-dock-bar__compass',
            isHome && 'exec-dock-bar__compass--home',
            snabbstartOpen && 'exec-dock-bar__compass--open',
            isHolding && 'exec-dock-bar__compass--holding',
          )}
          aria-label={
            isHome
              ? snabbstartOpen
                ? 'Stäng snabbstart. Håll tre sekunder för Valv.'
                : 'Öppna snabbstart. Håll tre sekunder för Valv.'
              : 'Hamn. Håll tre sekunder för Valv.'
          }
          aria-expanded={isHome ? snabbstartOpen : undefined}
          style={
            progress > 0
              ? ({ '--dock-hold': `${Math.round(progress * 100)}%` } as CSSProperties)
              : undefined
          }
          {...centerHoldHandlers}
        >
          {showFyrenRing ? <FyrenProgressRing progress={progress} /> : null}
          <ExecutiveDecorCompass size="hero" className="exec-dock-bar__compass-mark" />
        </button>
      </div>

      <ExecDockSide label="Hjärtat" active={isHjartat} onClick={onVentil}>
        <Landmark className="exec-dock-bar__glyph" strokeWidth={1.5} />
      </ExecDockSide>

      <ExecDockSide
        label="Inkast"
        active={pathname.startsWith('/planering/input')}
        onClick={onInkast}
      >
        <Inbox className="exec-dock-bar__glyph" strokeWidth={1.5} />
      </ExecDockSide>

      <ExecDockSide label="Resurser" active={resurserOpen} onClick={onResurser}>
        <LayoutGrid className="exec-dock-bar__glyph" strokeWidth={1.5} />
      </ExecDockSide>
    </nav>
  );
}
