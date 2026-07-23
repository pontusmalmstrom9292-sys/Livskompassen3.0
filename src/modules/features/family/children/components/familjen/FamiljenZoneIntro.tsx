import { Link, useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import type { FamiljenTabId } from '@/features/family/children/constants/familjenTabs';
import { isBarnportenChildPwaRolloutEnabled } from '@/features/onboarding/barnporten/constants/barnportenRollout';
import {
  FAMILJEN_LAYER_INGRESS,
  FAMILJEN_LAYER_LABELS,
  FAMILJEN_LAYER_SWITCH,
} from '@/core/copy/familjenNavCopy';

type Props = {
  activeTab: FamiljenTabId;
};

function tabHref(tab: FamiljenTabId, searchParams: URLSearchParams): string {
  const next = new URLSearchParams(searchParams);
  if (tab === 'reflektion') {
    next.delete('tab');
  } else {
    next.set('tab', tab);
  }
  const search = next.toString();
  return search ? `${NAV_PATHS.FAMILJEN}?${search}` : NAV_PATHS.FAMILJEN;
}

/** Zon-leda — samma mönster som Hjärtat/Vardagen, låg kognitiv belastning. */
export function FamiljenZoneIntro({ activeTab }: Props) {
  const [searchParams] = useSearchParams();
  const tabs = FAMILJEN_LAYER_SWITCH.filter(
    (item) => item.id !== 'barnporten' || isBarnportenChildPwaRolloutEnabled(),
  );

  return (
    <section className="familjen-zone-intro gs-hub-card" aria-label="Familjen zonöversikt">
      <div
        className="gs-hub-card__avatar-row gs-hub-card__avatar-row--schema familjen-zone-intro__schema"
        aria-hidden
      >
        <span className="gs-hub-card__avatar" />
        <span className="gs-hub-card__avatar gs-hub-card__avatar--dim" />
        <span className="gs-hub-card__avatar gs-hub-card__avatar--dim gs-hub-card__avatar--sm" />
      </div>
      <div className="familjen-zone-intro__header">
        <span className="familjen-zone-intro__eyebrow">Zon</span>
        <span className="familjen-zone-intro__title">{FAMILJEN_LAYER_LABELS[activeTab]}</span>
      </div>
      <p className="familjen-zone-intro__lead">{FAMILJEN_LAYER_INGRESS[activeTab]}</p>
      <nav className="familjen-layer-switch" aria-label="Växla vy i Familjen">
        {tabs.map(({ id, label }) => (
          <Link
            key={id}
            to={tabHref(id, searchParams)}
            replace
            className={clsx(
              'familjen-layer-switch__link',
              activeTab === id && 'familjen-layer-switch__link--active',
            )}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
