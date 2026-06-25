import type { CSSProperties, ReactNode } from 'react';
import { clsx } from 'clsx';
import { CalendarDays, Landmark, LayoutGrid, PenLine, Inbox, Vault } from 'lucide-react';
import { DrawerL2Icon } from '../ui/drawerL2Icons/DrawerL2Icon';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
import { ExecutiveDecorCompass } from '../ui/executive/ExecutiveDecorCompass';
import type { ExecutiveHomeLayoutMode } from '../home/executive/homeLayoutPreference';

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
  dockVariant?: ExecutiveHomeLayoutMode;
  pathname: string;
  isHome: boolean;
  isFamiljen: boolean;
  isHjartat: boolean;
  isPlanering: boolean;
  isValvet: boolean;
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
  onValv: () => void;
  onPlanering: () => void;
};

/** Referensdock — extended (6 zoner) eller mix-E (4 zoner). */
export function ExecutiveDockBar({
  dockVariant = 'extended',
  pathname,
  isHome,
  isFamiljen,
  isHjartat,
  isPlanering,
  isValvet,
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
  onValv,
  onPlanering,
}: Props) {
  const mixE = dockVariant === 'mix-e';

  if (mixE) {
    return (
      <nav className="exec-dock-bar exec-dock-bar--mix-e" aria-label="Huvudnavigation">
        <ExecDockSide label="Familjen" active={isFamiljen} onClick={onFamiljen}>
          <DrawerL2Icon hubId="familjen" className="exec-dock-bar__glyph exec-dock-bar__glyph--l2" />
        </ExecDockSide>

        <div className="exec-dock-bar__compass-slot">
          <button
            type="button"
            className={clsx(
              'exec-dock-bar__compass',
              isHome && 'exec-dock-bar__compass--home',
              isHolding && 'exec-dock-bar__compass--holding',
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
            <ExecutiveDecorCompass size="hero" className="exec-dock-bar__compass-mark" />
          </button>
        </div>

        <ExecDockSide label="Valv" active={isValvet} onClick={onValv}>
          <Vault className="exec-dock-bar__glyph" strokeWidth={1.5} />
        </ExecDockSide>

        <ExecDockSide label="Planering" active={isPlanering} onClick={onPlanering}>
          <CalendarDays className="exec-dock-bar__glyph" strokeWidth={1.5} />
        </ExecDockSide>
      </nav>
    );
  }

  return (
    <nav className="exec-dock-bar exec-dock-bar--extended" aria-label="Huvudnavigation">
      <ExecDockSide
        label="Anteckning"
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
