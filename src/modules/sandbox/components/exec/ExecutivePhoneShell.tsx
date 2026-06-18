import type { ReactNode } from 'react';
import {
  ExecutiveExactBottomNav,
  type ExecutiveNavId,
} from './ExecutiveExactBottomNav';

type Props = {
  children: ReactNode;
  navActive: ExecutiveNavId;
  onNav: (id: ExecutiveNavId) => void;
};

export function ExecutivePhoneShell({ children, navActive, onNav }: Props) {
  return (
    <div className="design-freeport__phone design-freeport__phone--executive design-freeport__phone--exact">
      <div className="design-freeport__phone-scroll">{children}</div>
      <ExecutiveExactBottomNav active={navActive} onSelect={onNav} />
    </div>
  );
}
