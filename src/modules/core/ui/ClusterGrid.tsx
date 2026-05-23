import { Link } from 'react-router-dom';
import {
  getHomeClusters,
  type ClusterTone,
  type LifeCluster,
} from '../navigation/appNavigation';

const toneClass: Record<ClusterTone, string> = {
  gold: 'module-scroll-card--gold',
  indigo: 'module-scroll-card--indigo',
  lavender: 'module-scroll-card--lavender',
  emerald: 'module-scroll-card--emerald',
};

function ClusterScrollCard(cluster: LifeCluster) {
  const Icon = cluster.icon;
  return (
    <Link
      to={cluster.path}
      className={`module-scroll-card ${toneClass[cluster.tone]}`}
    >
      <span className="module-scroll-card__icon">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="module-scroll-card__title">{cluster.label}</span>
      <span className="module-scroll-card__hint">{cluster.chips[0]?.label ?? ''}</span>
    </Link>
  );
}

/** Hem — kompakta kort i horisontell rullmeny (sparar vertikal höjd). */
export function ClusterGrid() {
  const clusters = getHomeClusters();

  return (
    <section className="module-scroll" aria-label="Moduler och kluster">
      <div className="module-scroll__track">
        {clusters.map((cluster) => (
          <ClusterScrollCard key={cluster.id} {...cluster} />
        ))}
      </div>
    </section>
  );
}
