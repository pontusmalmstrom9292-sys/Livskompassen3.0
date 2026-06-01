import { clsx } from 'clsx';
import {
  PLANERING_HUB_MODULE_CATEGORY_LABELS,
  resolvePlaneringHubModules,
  type PlaneringHubModuleCategory,
} from '../planeringHubModules';
import type { PlaneringHubLayout } from '../planeringHubLayouts';
import { PlaneringHubModuleCard } from './PlaneringHubModuleCard';
import { PlaneringHubNavigator } from './PlaneringHubNavigator';
import { getPlaneringHubModule } from '../planeringHubModules';

type Props = {
  layout: PlaneringHubLayout;
  className?: string;
  /** Öppnar bottom sheet (undviker flytande Fyren-knapp). */
  onStartProjekt?: () => void;
};

export function PlaneringHubBody({ layout, className, onStartProjekt }: Props) {
  const modules = resolvePlaneringHubModules(layout.modules);
  const featured = layout.featured
    ? getPlaneringHubModule(layout.featured)
    : null;

  const shellClass = `planering-hub-shell--${layout.shell}`;

  if (layout.style === 'navigator') {
    return (
      <PlaneringHubNavigator
        moduleIds={layout.modules}
        featuredId={layout.featured ?? 'nytt-projekt'}
        shellClass={shellClass}
        className={className}
        onStartProjekt={onStartProjekt}
      />
    );
  }

  if (layout.style === 'list') {
    return (
      <div
        className={clsx(
          'planering-hub',
          'planering-hub--list',
          shellClass,
          className,
        )}
      >
        <ul className="planering-hub__list">
          {modules.map((mod) => (
            <li key={mod.id}>
              <PlaneringHubModuleCard module={mod} size="compact" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (layout.style === 'sections') {
    const byCategory = groupByCategory(modules);
    const sectionOrder: PlaneringHubModuleCategory[] = [
      'tid',
      'listor',
      'uppgifter',
      'filer',
      'anteckning',
    ];
    return (
      <div
        className={clsx(
          'planering-hub',
          'planering-hub--sections',
          shellClass,
          className,
        )}
      >
        {sectionOrder.map((cat) => {
          const items = byCategory[cat];
          if (!items?.length) return null;
          return (
            <section key={cat} className="planering-hub__section">
              <h3 className="planering-hub__section-title">
                {PLANERING_HUB_MODULE_CATEGORY_LABELS[cat]}
              </h3>
              <div className="planering-hub__section-grid">
                {items.map((mod) => (
                  <PlaneringHubModuleCard key={mod.id} module={mod} size="tile" />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  if (layout.style === 'orbit' && featured) {
    const orbitMods = modules.filter((m) => m.id !== featured.id);
    return (
      <div
        className={clsx(
          'planering-hub',
          'planering-hub--orbit',
          shellClass,
          className,
        )}
      >
        <div className="planering-hub__orbit-center">
          <PlaneringHubModuleCard module={featured} size="hero" />
        </div>
        <div className="planering-hub__orbit-ring">
          {orbitMods.map((mod) => (
            <PlaneringHubModuleCard
              key={mod.id}
              module={mod}
              size="tile"
              className="planering-hub__orbit-chip"
            />
          ))}
        </div>
      </div>
    );
  }

  if (layout.style === 'bento' && featured) {
    const rest = modules.filter((m) => m.id !== featured.id);
    return (
      <div
        className={clsx(
          'planering-hub',
          'planering-hub--bento',
          shellClass,
          className,
        )}
      >
        <div className="planering-hub__bento">
          <PlaneringHubModuleCard
            module={featured}
            size="hero"
            className="planering-hub__bento-hero"
          />
          {rest.map((mod, i) => (
            <PlaneringHubModuleCard
              key={mod.id}
              module={mod}
              size={i < 2 ? 'default' : 'tile'}
              className={clsx(
                i === 0 && 'planering-hub__bento-wide',
                i === 1 && 'planering-hub__bento-tall',
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (layout.style === 'strip') {
    return (
      <div
        className={clsx(
          'planering-hub',
          'planering-hub--strip',
          shellClass,
          className,
        )}
      >
        <div className="planering-hub__strip" role="list">
          {modules.map((mod) => (
            <PlaneringHubModuleCard
              key={mod.id}
              module={mod}
              size="tile"
              className="planering-hub__strip-card"
            />
          ))}
        </div>
      </div>
    );
  }

  if (layout.style === 'minimal') {
    const hero = featured ?? modules[0];
    const rest = modules.filter((m) => m.id !== hero?.id);
    return (
      <div
        className={clsx(
          'planering-hub',
          'planering-hub--minimal',
          shellClass,
          className,
        )}
      >
        {hero ? <PlaneringHubModuleCard module={hero} size="hero" /> : null}
        <div className="planering-hub__minimal-rest">
          {rest.map((mod) => (
            <PlaneringHubModuleCard key={mod.id} module={mod} size="compact" />
          ))}
        </div>
      </div>
    );
  }

  if (layout.style === 'tiles') {
    return (
      <div
        className={clsx(
          'planering-hub',
          'planering-hub--tiles',
          shellClass,
          className,
        )}
      >
        <div className="planering-hub__tiles">
          {modules.map((mod) => (
            <PlaneringHubModuleCard key={mod.id} module={mod} size="tile" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx('planering-hub', 'planering-hub--grid', shellClass, className)}
    >
      <div className="planering-hub__grid">
        {modules.map((mod) => (
          <PlaneringHubModuleCard key={mod.id} module={mod} />
        ))}
      </div>
    </div>
  );
}

function groupByCategory(
  modules: ReturnType<typeof resolvePlaneringHubModules>,
) {
  const out: Partial<
    Record<PlaneringHubModuleCategory, ReturnType<typeof resolvePlaneringHubModules>>
  > = {};
  for (const mod of modules) {
    if (!out[mod.category]) out[mod.category] = [];
    out[mod.category]!.push(mod);
  }
  return out;
}
