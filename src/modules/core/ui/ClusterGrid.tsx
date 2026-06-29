import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { BookOpen, Anchor, Heart, Compass, ChevronRight, Sparkles } from 'lucide-react';
import { HIDE_BEVIS_TAB } from '../navigation/navFlags';
import { NAV_PATHS, vaultDrawerPath } from '../navigation/navTruth';
import { DAGBOK_BEVIS_DRAWER_LABEL } from '../copy/valvNavCopy';
import './ClusterGrid.css';

type ModuleLink = {
  label: string;
  to: string;
  search?: string;
};

type Cluster = {
  to: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tone: 'gold' | 'indigo' | 'lavender' | 'emerald';
  modules: ModuleLink[];
};

const clusters: Cluster[] = [
  {
    to: NAV_PATHS.HJARTAT,
    label: 'Hjärtat',
    desc: 'Sanning, reflektion och spegling.',
    icon: BookOpen,
    tone: 'gold',
    modules: [
      { label: 'Dagbok', to: NAV_PATHS.HJARTAT },
      { label: DAGBOK_BEVIS_DRAWER_LABEL, to: NAV_PATHS.VALVET },
      { label: 'Speglar', to: NAV_PATHS.HJARTAT, search: '?tab=speglar' },
    ],
  },
  {
    to: '/familjen',
    label: 'Hamnen',
    desc: 'Gränser och kommunikation mot ex.',
    icon: Anchor,
    tone: 'indigo',
    modules: [{ label: 'Safe Harbor · BIFF', to: '/familjen', search: '?tab=hamn' }],
  },
  {
    to: '/familjen',
    label: 'Familjen',
    desc: 'Neutral loggning för Kasper och Arvid.',
    icon: Heart,
    tone: 'lavender',
    modules: [
      { label: 'Livsloggar', to: '/familjen' },
      { label: 'Balansmätare', to: '/familjen' },
    ],
  },
  {
    to: '/vardagen',
    label: 'Vardagen',
    desc: 'Daglig rytm och vardagsstress.',
    icon: Compass,
    tone: 'emerald',
    modules: [
      { label: 'Kompasser', to: '/vardagen' },
      { label: 'Ekonomi', to: '/vardagen', search: '?tab=ekonomi' },
      { label: 'Kunskap', to: vaultDrawerPath('kunskapsbank') },
    ],
  },
  {
    to: '/mabra',
    label: 'Måbra',
    desc: 'KBT, självmedkänsla och små vanor.',
    icon: Sparkles,
    tone: 'lavender',
    modules: [{ label: 'Måbra-sidan', to: '/mabra' }],
  },
];

const toneClass: Record<Cluster['tone'], string> = {
  gold: 'module-card--gold',
  indigo: 'module-card--indigo',
  lavender: 'module-card--lavender',
  emerald: 'module-card--emerald',
};

function ModuleChip({ label, to, search }: ModuleLink) {
  return (
    <Link
      to={{ pathname: to, search: search ?? '' }}
      className="module-chip"
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </Link>
  );
}

function ModuleCard({ to, label, desc, icon: Icon, tone, modules }: Cluster) {
  return (
    <Link to={to} className={`module-card ${toneClass[tone]}`}>
      <div className="module-card__head">
        <span className="module-card__icon">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="module-card__title">{label}</h3>
          <p className="module-card__desc">{desc}</p>
        </div>
        <ChevronRight className="module-card__chevron h-5 w-5 shrink-0" aria-hidden />
      </div>
      <div className="module-card__modules">
        {modules.map((mod) => (
          <ModuleChip key={`${mod.to}-${mod.label}`} {...mod} />
        ))}
      </div>
    </Link>
  );
}

export function ClusterGrid() {
  const visibleClusters = HIDE_BEVIS_TAB
    ? clusters.map((c) => ({
        ...c,
        modules: c.modules.filter(
          (m) =>
            m.to !== NAV_PATHS.VALVET &&
            !m.to.startsWith(`${NAV_PATHS.VALVET}?`) &&
            !m.search?.includes('tab=bevis'),
        ),
      }))
    : clusters;

  return (
    <section className="module-list" aria-label="Moduler och kluster">
      {visibleClusters.map((cluster) => (
        <ModuleCard key={cluster.to} {...cluster} />
      ))}
    </section>
  );
}
