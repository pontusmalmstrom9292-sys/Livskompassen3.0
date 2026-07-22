import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, RotateCcw } from 'lucide-react';
import { Button, Sheet, SheetBody } from '@/design-system';
import type { LifeHubPresetId } from './lifeHubPresets';
import type { MaterialPackHub, MaterialShortcut } from './materialPacks';
import { getDefaultMaterialShortcuts } from './materialPacks';
import { getMaterialPackOverride, saveMaterialPackOverride, clearMaterialPackOverride } from './materialPackApi';
import { MATERIAL_TARGET_PRESETS } from './materialPackTargets';
import { resolveModuleLink, moduleLinkToString } from './moduleLink';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  presetId: LifeHubPresetId;
  hub: MaterialPackHub;
  userId: string;
};

export function MaterialPackEditorSheet({ isOpen, onClose, presetId, hub, userId }: Props) {
  const [shortcuts, setShortcuts] = useState<MaterialShortcut[]>([]);

  useEffect(() => {
    if (isOpen) {
      const override = getMaterialPackOverride(userId, presetId, hub);
      if (override) {
        setShortcuts(override);
      } else {
        setShortcuts(getDefaultMaterialShortcuts(presetId, hub));
      }
    }
  }, [isOpen, userId, presetId, hub]);

  const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    const preset = MATERIAL_TARGET_PRESETS[parseInt(value, 10)];
    if (!preset) return;

    setShortcuts((prev) => [...prev, { label: preset.label, target: preset.target }]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setShortcuts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLabelChange = (index: number, newLabel: string) => {
    setShortcuts((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], label: newLabel };
      }
      return copy;
    });
  };

  const handleSave = () => {
    saveMaterialPackOverride(userId, presetId, hub, shortcuts);
    onClose();
  };

  const handleRestoreDefaults = () => {
    clearMaterialPackOverride(userId, presetId, hub);
    setShortcuts(getDefaultMaterialShortcuts(presetId, hub));
  };

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      ariaLabel="Redigera genvägar"
      hideHeader
      size="tall"
      className="z-[100]"
      panelClassName="border-t border-border-strong bg-surface shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-surface-2 px-6 py-4">
        <div>
          <h2 className="text-lg font-medium text-white">Redigera genvägar</h2>
          <p className="mt-1 text-xs uppercase tracking-widest text-text-muted">
            {hub} · Anpassa material
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          aria-label="Stäng"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <SheetBody className="space-y-6 p-6">
        <div className="space-y-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-3">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={sc.label}
                  onChange={(e) => handleLabelChange(i, e.target.value)}
                  className="w-full border-b border-white/10 bg-transparent px-1 py-1 text-sm text-white outline-none transition-colors focus:border-white/30"
                  placeholder="Namn på genväg..."
                />
                <div className="truncate px-1 font-mono text-[10px] text-white/40">
                  {moduleLinkToString(resolveModuleLink(sc.target))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
                title="Ta bort genväg"
                aria-label="Ta bort genväg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {shortcuts.length === 0 && (
            <p className="rounded-xl border border-white/5 bg-white/5 py-8 text-center text-sm italic text-white/40">
              Inga genvägar tillagda än.
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-xl border border-white/5 bg-black/20 p-4">
          <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            <Plus className="h-3 w-3" />
            Lägg till ny genväg
          </label>
          <select
            onChange={handleAdd}
            defaultValue=""
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30"
          >
            <option value="" disabled>
              -- Välj en modul att länka till --
            </option>
            {MATERIAL_TARGET_PRESETS.map((preset, i) => (
              <option key={i} value={i}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>
      </SheetBody>

      <div className="flex flex-shrink-0 items-center justify-between gap-4 border-t border-border bg-surface-2 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]">
        <button
          type="button"
          onClick={handleRestoreDefaults}
          className="flex min-h-11 items-center gap-2 text-xs text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        >
          <RotateCcw className="h-3 w-3" />
          Återställ
        </button>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button variant="accent" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Spara ändringar
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
