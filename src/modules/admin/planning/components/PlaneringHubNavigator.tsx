import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import {
  getPlaneringHubModule,
  PLANERING_HUB_MODULE_CATEGORY_LABELS,
  resolvePlaneringHubModules,
  type PlaneringHubModule,
  type PlaneringHubModuleCategory,
  type PlaneringHubModuleId,
} from '../planeringHubModules';
import { PlaneringHubModuleCard } from './PlaneringHubModuleCard';

const CATEGORY_ORDER: PlaneringHubModuleCategory[] = [
  'uppgifter',
  'listor',
  'filer',
  'tid',
  'anteckning',
];

type Props = {
  moduleIds: PlaneringHubModuleId[];
  featuredId?: PlaneringHubModuleId;
  shellClass?: string;
  className?: string;
};

/** Starta projekt överst — övriga verktyg i hopfällbara kategorier med kompakta kort. */
export function PlaneringHubNavigator({
  moduleIds,
  featuredId = 'nytt-projekt',
  shellClass,
  className,
}: Props) {
  const modules = resolvePlaneringHubModules(moduleIds);
  const featured = getPlaneringHubModule(featuredId);
  const rest = modules.filter((m) => m.id !== featuredId);
  const byCategory = useMemo(() => groupByCategory(rest), [rest]);

  const firstOpen = CATEGORY_ORDER.find((cat) => (byCategory[cat]?.length ?? 0) > 0) ?? 'uppgifter';
  const [openCategory, setOpenCategory] = useState<PlaneringHubModuleCategory | null>(
    firstOpen,
  );

  return (
    <div
      className={clsx('planering-hub', 'planering-hub--navigator', shellClass, className)}
    >
      <PlaneringHubModuleCard
        module={featured}
        size="hero"
        className="planering-hub__primary"
      />

      <nav className="planering-hub__accordions" aria-label="Planeringsverktyg per kategori">
        {CATEGORY_ORDER.map((cat) => {
          const items = byCategory[cat];
          if (!items?.length) return null;
          const isOpen = openCategory === cat;
          return (
            <div
              key={cat}
              className={clsx(
                'planering-hub__category',
                isOpen && 'planering-hub__category--open',
              )}
            >
              <button
                type="button"
                className="planering-hub__category-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenCategory(isOpen ? null : cat)}
              >
                <span className="planering-hub__category-label">
                  {PLANERING_HUB_MODULE_CATEGORY_LABELS[cat]}
                </span>
                <span className="planering-hub__category-meta">
                  {items.length} {items.length === 1 ? 'verktyg' : 'verktyg'}
                </span>
                <ChevronDown
                  className="planering-hub__category-chevron"
                  aria-hidden
                />
              </button>
              {isOpen ? (
                <div className="planering-hub__category-panel">
                  {items.map((mod) => (
                    <PlaneringHubModuleCard
                      key={mod.id}
                      module={mod}
                      size="chip"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function groupByCategory(modules: PlaneringHubModule[]) {
  const out: Partial<Record<PlaneringHubModuleCategory, PlaneringHubModule[]>> = {};
  for (const mod of modules) {
    if (!out[mod.category]) out[mod.category] = [];
    out[mod.category]!.push(mod);
  }
  return out;
}
