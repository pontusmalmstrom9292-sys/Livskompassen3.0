import { Link } from 'react-router-dom';
import type { MaterialPackHub, MaterialShortcut } from './materialPacks';
import type { LifeHubPreset } from './lifeHubPresets';
import { resolveModuleLink } from './moduleLink';
import { useMaterialShortcuts } from './useMaterialShortcuts';

type Props = {
  preset: LifeHubPreset;
  hub: MaterialPackHub;
  /** Editor preview — bypass localStorage until save propagates. */
  shortcutsOverride?: MaterialShortcut[];
};

export function MaterialPackShortcuts({ preset, hub, shortcutsOverride }: Props) {
  const storedShortcuts = useMaterialShortcuts(preset.id, hub);
  const shortcuts = shortcutsOverride ?? storedShortcuts;
  if (shortcuts.length === 0) return null;

  return (
    <div className="life-hub-hint elongated-module p-3 text-sm" data-life-os="material-pack">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Profil · {preset.label}</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {shortcuts.map((item) => {
          const link = resolveModuleLink(item.target);
          const to = `${link.pathname}${link.search ?? ''}${link.hash ?? ''}`;
          return (
            <li key={`${item.label}-${to}`}>
              <Link to={to} className="btn-pill--accent inline-flex w-full justify-center text-xs">
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
