import { Link } from 'react-router-dom';
import { PLANERING_MORE_TABS } from '../constants';
import type { PlaneringTab } from '../types';

/** Synliga länkar Fokus · Framsteg · Regler — Handling/Inkorg styrs enbart av GoraHubTabBar. */
export function PlaneringMoreTabsBar({ activeTab }: { activeTab: PlaneringTab }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Fokus, Framsteg och Regler">
      {PLANERING_MORE_TABS.map(({ id, label }) => {
        const active = activeTab === id;
        return (
          <Link
            key={id}
            to={`/planering?tab=${id}`}
            className={`btn-pill--ghost text-xs ${
              active ? 'border-accent/40 bg-accent/10 text-accent' : 'text-text-muted'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
