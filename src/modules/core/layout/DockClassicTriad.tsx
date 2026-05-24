import type { ReactNode } from 'react';
import { Users } from 'lucide-react';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { LivskompassMark } from '../ui/LivskompassMark';
import { ValvArchIcon } from '../ui/ValvArchIcon';

function DockSideLink({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx('dock-classic__side', isActive && 'dock-classic__side--active')
      }
      aria-label={label}
    >
      <span className="dock-classic__side-icon" aria-hidden>
        {icon}
      </span>
      <span className="dock-classic__side-label">{label}</span>
    </NavLink>
  );
}

/** Kanon: Familjen · kompass (ingen text) · Valv — se DOCK-KANON.md */
export function DockClassicTriad() {
  return (
    <div className="dock-classic">
      <DockSideLink
        to="/familjen"
        label="Familjen"
        icon={<Users className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.5} />}
      />

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          clsx('dock-classic__center', isActive && 'dock-classic__center--active')
        }
        aria-label="Hem"
      >
        <span className="dock-classic__plate">
          <LivskompassMark className="dock-classic__mark" />
        </span>
      </NavLink>

      <DockSideLink
        to="/dagbok?tab=bevis"
        label="Valv"
        icon={<ValvArchIcon className="h-[1.35rem] w-[1.35rem]" />}
      />
    </div>
  );
}
