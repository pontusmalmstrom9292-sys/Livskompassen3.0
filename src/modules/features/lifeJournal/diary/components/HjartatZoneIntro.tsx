import { Link, useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import {
  HJARTAT_LAYER_INGRESS,
  HJARTAT_LAYER_LABELS,
  type HjartatLayerTab,
} from '@/core/copy/hjartatNavCopy';

type Props = {
  layerTab: HjartatLayerTab;
};

const LAYER_TABS: { id: HjartatLayerTab; label: string }[] = [
  { id: 'reflektion', label: 'Dagbok' },
  { id: 'speglar', label: 'Speglar' },
];

function layerHref(tab: HjartatLayerTab, searchParams: URLSearchParams): string {
  const next = new URLSearchParams(searchParams);
  if (tab === 'reflektion') {
    next.delete('tab');
  } else {
    next.set('tab', tab);
  }
  const search = next.toString();
  return search ? `${NAV_PATHS.HJARTAT}?${search}` : NAV_PATHS.HJARTAT;
}

/** Zon-leda — samma mönster som Valv zone intro, låg kognitiv belastning. */
export function HjartatZoneIntro({ layerTab }: Props) {
  const [searchParams] = useSearchParams();

  return (
    <section className="hjartat-zone-intro" aria-label="Hjärtat zonöversikt">
      <div className="hjartat-zone-intro__header">
        <span className="hjartat-zone-intro__eyebrow">Zon</span>
        <span className="hjartat-zone-intro__title">{HJARTAT_LAYER_LABELS[layerTab]}</span>
      </div>
      <p className="hjartat-zone-intro__lead">{HJARTAT_LAYER_INGRESS[layerTab]}</p>
      <nav className="hjartat-layer-switch" aria-label="Växla Dagbok och Speglar">
        {LAYER_TABS.map(({ id, label }) => (
          <Link
            key={id}
            to={layerHref(id, searchParams)}
            replace
            className={clsx(
              'hjartat-layer-switch__link',
              layerTab === id && 'hjartat-layer-switch__link--active',
            )}
            aria-current={layerTab === id ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
