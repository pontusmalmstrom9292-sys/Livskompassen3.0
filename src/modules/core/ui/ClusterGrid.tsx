import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  clusterChipHref,
  getHomeClusters,
  type ClusterTone,
  type LifeCluster,
} from '../navigation/appNavigation';

const toneClass: Record<ClusterTone, string> = {
  gold: 'module-card--gold',
  indigo: 'module-card--indigo',
  lavender: 'module-card--lavender',
  emerald: 'module-card--emerald',
};

function ModuleChip({
  cluster,
  label,
  tab,
}: {
  cluster: LifeCluster;
  label: string;
  tab?: string;
}) {
  const href = clusterChipHref(cluster, { label, tab });
  return (
    <Link
      to={href}
      className="module-chip"
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </Link>
  );
}

function ModuleCard(cluster: LifeCluster) {
  const Icon = cluster.icon;
  return (
    <Link to={cluster.path} className={`module-card ${toneClass[cluster.tone]}`}>
      <div className="module-card__head">
        <span className="module-card__icon">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="module-card__title">{cluster.label}</h3>
          <p className="module-card__desc">{cluster.desc}</p>
        </div>
        <ChevronRight className="module-card__chevron h-4 w-4 shrink-0" aria-hidden />
      </div>
      <div className="module-card__modules">
        {cluster.chips.map((chip) => (
          <ModuleChip
            key={`${chip.label}-${chip.tab ?? ''}`}
            cluster={cluster}
            label={chip.label}
            tab={chip.tab}
          />
        ))}
      </div>
    </Link>
  );
}

export function ClusterGrid() {
  const clusters = getHomeClusters();

  return (
    <section className="module-list" aria-label="Moduler och kluster">
      {clusters.map((cluster) => (
        <ModuleCard key={cluster.id} {...cluster} />
      ))}
    </section>
  );
}
