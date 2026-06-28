import { Link, useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import {
  VARDAGEN_LAYER_INGRESS,
  VARDAGEN_LAYER_LABELS,
  type VardagenInlineTab,
} from '@/core/copy/vardagenNavCopy';

type Props = {
  activeTab: VardagenInlineTab;
};

const INLINE_TABS: { id: VardagenInlineTab; label: string }[] = [
  { id: 'kompasser', label: 'Kompasser' },
  { id: 'ekonomi', label: 'Ekonomi' },
  { id: 'mabra', label: 'MåBra' },
];

function tabHref(tab: VardagenInlineTab, searchParams: URLSearchParams): string {
  const next = new URLSearchParams(searchParams);
  if (tab === 'kompasser') {
    next.delete('tab');
  } else {
    next.set('tab', tab);
  }
  const search = next.toString();
  return search ? `${NAV_PATHS.VARDAGEN}?${search}` : NAV_PATHS.VARDAGEN;
}

/** Zon-leda — samma mönster som Hjärtat/Valv, låg kognitiv belastning. */
export function VardagenZoneIntro({ activeTab }: Props) {
  const [searchParams] = useSearchParams();

  return (
    <section className="vardagen-zone-intro" aria-label="Vardagen zonöversikt">
      <div className="vardagen-zone-intro__header">
        <span className="vardagen-zone-intro__eyebrow">Zon</span>
        <span className="vardagen-zone-intro__title">{VARDAGEN_LAYER_LABELS[activeTab]}</span>
      </div>
      <p className="vardagen-zone-intro__lead">{VARDAGEN_LAYER_INGRESS[activeTab]}</p>
      <nav className="vardagen-layer-switch" aria-label="Växla Kompasser, Ekonomi och MåBra">
        {INLINE_TABS.map(({ id, label }) => (
          <Link
            key={id}
            to={tabHref(id, searchParams)}
            replace
            className={clsx(
              'vardagen-layer-switch__link',
              activeTab === id && 'vardagen-layer-switch__link--active',
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
