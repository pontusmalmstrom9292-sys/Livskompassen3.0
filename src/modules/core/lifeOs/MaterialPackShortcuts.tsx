import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import type { MaterialPackHub, MaterialShortcut } from './materialPacks';
import type { LifeHubPreset } from './lifeHubPresets';
import { resolveModuleLink } from './moduleLink';
import { useMaterialShortcuts } from './useMaterialShortcuts';
import { useStore } from '@/core/store';
import { MaterialPackEditorSheet } from './MaterialPackEditorSheet';
import { ButtonLink } from '@/design-system';

type Props = {
  preset: LifeHubPreset;
  hub: MaterialPackHub;
  /** Editor preview — bypass localStorage until save propagates. */
  shortcutsOverride?: MaterialShortcut[];
};

export function MaterialPackShortcuts({ preset, hub, shortcutsOverride }: Props) {
  const storedShortcuts = useMaterialShortcuts(preset.id, hub);
  const user = useStore((state) => state.user);
  const shortcuts = shortcutsOverride ?? storedShortcuts;
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  if (shortcuts.length === 0 && !isEditorOpen) {
    return (
      <div className="life-hub-hint elongated-module p-3 text-sm" data-life-os="material-pack">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-text-dim">Profil · {preset.label}</p>
          <button onClick={() => setIsEditorOpen(true)} className="p-1 text-text-muted hover:text-text hover:bg-white/5 rounded">
            <Edit2 className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2 italic">Inga genvägar. Lägg till via Redigera.</p>
        {user?.uid && (
          <MaterialPackEditorSheet
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            presetId={preset.id}
            hub={hub}
            userId={user.uid}
          />
        )}
      </div>
    );
  }

  return (
    <div className="life-hub-hint elongated-module p-3 text-sm" data-life-os="material-pack">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">Profil · {preset.label}</p>
        <button onClick={() => setIsEditorOpen(true)} className="p-1 text-text-muted hover:text-text hover:bg-white/5 rounded" title="Redigera genvägar">
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {shortcuts.map((item) => {
          const link = resolveModuleLink(item.target);
          const to = `${link.pathname}${link.search ?? ''}${link.hash ?? ''}`;
          return (
            <li key={`${item.label}-${to}`}>
              <ButtonLink to={to} variant="accent" className="--accent inline-flex w-full justify-center text-xs">
                {item.label}
              </ButtonLink>
            </li>
          );
        })}
      </ul>

      {user?.uid && (
        <MaterialPackEditorSheet
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          presetId={preset.id}
          hub={hub}
          userId={user.uid}
        />
      )}
    </div>
  );
}
