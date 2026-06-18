import type { ReactNode } from 'react';
import {
  ExecutiveExactBottomNav,
  type ExecutiveNavId,
} from './ExecutiveExactBottomNav';

type Props = {
  children: ReactNode;
  navActive: ExecutiveNavId;
  onNav: (id: ExecutiveNavId) => void;
  /** Valfri widget ovanför bottom nav (t.ex. ihopfällbar snabbstart). */
  dockWidget?: ReactNode;
};

export function ExecutivePhoneShell({ children, navActive, onNav, dockWidget }: Props) {
  return (
    <div className="design-freeport__phone design-freeport__phone--executive design-freeport__phone--exact design-freeport__phone--chrome-v3">
      <div className="design-freeport__phone-scroll">{children}</div>
      {dockWidget}
      <ExecutiveExactBottomNav active={navActive} onSelect={onNav} />
    </div>
  );
}
