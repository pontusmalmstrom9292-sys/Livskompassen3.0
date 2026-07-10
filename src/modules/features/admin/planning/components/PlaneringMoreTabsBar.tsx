import { ButtonLink } from '@/design-system';
import { PLANERING_MORE_TABS } from '../constants';
import type { PlaneringTab } from '../types';

/** Synliga länkar Fokus · Framsteg · Regler — Handling/Inkorg styrs enbart av GoraHubTabBar. */
export function PlaneringMoreTabsBar({ activeTab }: { activeTab: PlaneringTab }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Fokus, Framsteg och Regler">
      {PLANERING_MORE_TABS.map(({ id, label }) => {
        const active = activeTab === id;
        return (
          <ButtonLink
            key={id}
            to={`/planering?tab=${id}`}
            variant="ghost"
            size="sm"
            className={active ? 'border-accent/40 bg-accent/10 text-accent' : 'text-text-muted'}
            aria-current={active ? 'page' : undefined}
          >
            {label}
          </ButtonLink>
        );
      })}
    </nav>
  );
}
