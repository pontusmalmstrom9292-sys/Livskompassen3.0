import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, RotateCcw } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    const preset = MATERIAL_TARGET_PRESETS[parseInt(value, 10)];
    if (!preset) return;

    setShortcuts((prev) => [
      ...prev,
      { label: preset.label, target: preset.target }
    ]);
    e.target.value = ''; // Reset select
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
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex h-[85vh] w-full flex-col rounded-t-3xl border-t border-white/10 bg-[var(--color-obsidian-calm)] shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div>
            <h2 className="text-lg font-medium text-white">Redigera genvägar</h2>
            <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
              {hub} · Anpassa material
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            {shortcuts.map((sc, i) => (
              <div key={i} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={sc.label}
                    onChange={(e) => handleLabelChange(i, e.target.value)}
                    className="w-full bg-transparent text-sm text-white border-b border-white/10 focus:border-white/30 outline-none px-1 py-1 transition-colors"
                    placeholder="Namn på genväg..."
                  />
                  <div className="px-1 text-[10px] text-white/40 font-mono truncate">
                    {moduleLinkToString(resolveModuleLink(sc.target))}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(i)}
                  className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Ta bort genväg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {shortcuts.length === 0 && (
              <p className="text-sm text-white/40 text-center py-8 italic bg-white/5 rounded-xl border border-white/5">
                Inga genvägar tillagda än.
              </p>
            )}
          </div>

          <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Plus className="h-3 w-3" />
              Lägg till ny genväg
            </label>
            <select
              onChange={handleAdd}
              defaultValue=""
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
            >
              <option value="" disabled>-- Välj en modul att länka till --</option>
              {MATERIAL_TARGET_PRESETS.map((preset, i) => (
                <option key={i} value={i}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 bg-[var(--color-obsidian-calm)] p-6 flex items-center justify-between gap-4 pb-safe">
          <button
            onClick={handleRestoreDefaults}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Återställ
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-full text-sm flex items-center gap-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              Spara ändringar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
