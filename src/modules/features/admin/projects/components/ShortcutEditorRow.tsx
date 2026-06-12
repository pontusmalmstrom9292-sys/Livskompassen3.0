import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  MATERIAL_PACK_BANK_REFS,
  isValidMaterialPackBankRef,
  labelForMaterialPackBankRef,
  type MaterialShortcut,
} from '@/core/lifeOs';
import {
  MATERIAL_TARGET_PRESETS,
  defaultTargetPreset,
  findTargetPreset,
  targetToKey,
} from '@/core/lifeOs/materialPackTargets';

interface ShortcutEditorRowProps {
  item: MaterialShortcut;
  index: number;
  totalLength: number;
  user: any;
  isDuplicate: boolean;
  bankRefGroups: {
    panel: (typeof MATERIAL_PACK_BANK_REFS)[number][];
    reflection: (typeof MATERIAL_PACK_BANK_REFS)[number][];
    play: (typeof MATERIAL_PACK_BANK_REFS)[number][];
  };
  onUpdate: (index: number, updated: Partial<MaterialShortcut>) => void;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}

export function ShortcutEditorRow({
  item,
  index,
  totalLength,
  user,
  isDuplicate,
  bankRefGroups,
  onUpdate,
  onMove,
  onRemove,
}: ShortcutEditorRowProps) {
  const targetKey = findTargetPreset(item.target)
    ? targetToKey(item.target)
    : targetToKey(defaultTargetPreset().target);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-surface/40 p-4 shadow-xl backdrop-blur-md transition-all ${
        isDuplicate
          ? 'border-amber-500/50 shadow-amber-500/10'
          : 'border-border-strong hover:border-accent/50'
      }`}
    >
      {/* Subtil gradient-bakgrund för premium-känsla */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50" />
      
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
              {index + 1}
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-dim">
              Genväg
            </p>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text disabled:opacity-30"
              disabled={!user || index === 0}
              aria-label="Flytta upp"
              onClick={() => onMove(index, index - 1)}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text disabled:opacity-30"
              disabled={!user || index === totalLength - 1}
              aria-label="Flytta ner"
              onClick={() => onMove(index, index + 1)}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-text-dim">Etikett</label>
            <input
              className="w-full rounded-xl border border-border-subtle bg-surface/60 px-3 py-2 text-sm text-text outline-none transition-colors hover:border-accent/30 focus:border-accent focus:bg-surface/80 focus:ring-1 focus:ring-accent/50"
              value={item.label}
              disabled={!user}
              onChange={(e) => onUpdate(index, { label: e.target.value })}
              placeholder="T.ex. Mina morgonrutiner"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-text-dim">Mål</label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl border border-border-subtle bg-surface/60 px-3 py-2 pr-8 text-sm text-text outline-none transition-colors hover:border-accent/30 focus:border-accent focus:bg-surface/80 focus:ring-1 focus:ring-accent/50"
                value={targetKey}
                disabled={!user}
                onChange={(e) => {
                  const preset = MATERIAL_TARGET_PRESETS.find(
                    (p) => targetToKey(p.target) === e.target.value,
                  );
                  if (!preset) return;
                  onUpdate(index, { target: preset.target, bankRef: undefined });
                }}
              >
                {MATERIAL_TARGET_PRESETS.map((p) => (
                  <option key={targetToKey(p.target)} value={targetToKey(p.target)} className="bg-surface">
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-text-muted" />
            </div>
          </div>
        </div>

        <div className="space-y-1 rounded-xl bg-surface/30 p-3 border border-border-subtle/50">
          <label className="text-[10px] uppercase tracking-widest text-text-dim">Bankreferens (valfritt)</label>
          <div className="relative mt-1">
            <select
              className="w-full appearance-none rounded-lg border border-border-subtle bg-surface/60 px-3 py-2 pr-8 text-xs text-text outline-none transition-colors hover:border-accent/30 focus:border-accent focus:bg-surface/80"
              value={item.bankRef ?? ''}
              disabled={!user}
              onChange={(e) => onUpdate(index, { bankRef: e.target.value || undefined })}
            >
              <option value="" className="bg-surface text-text">Ingen — endast länk</option>
              {item.bankRef && !isValidMaterialPackBankRef(item.bankRef) ? (
                <option value={item.bankRef} className="bg-surface text-text">
                  Sparad referens · {item.bankRef}
                </option>
              ) : null}
              {bankRefGroups.panel.length > 0 ? (
                <optgroup label="Panel" className="bg-surface font-semibold text-accent">
                  {bankRefGroups.panel.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-text font-normal">
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ) : null}
              {bankRefGroups.reflection.length > 0 ? (
                <optgroup label="Reflektion (MåBra-bank)" className="bg-surface font-semibold text-accent">
                  {bankRefGroups.reflection.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-text font-normal">
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ) : null}
              {bankRefGroups.play.length > 0 ? (
                <optgroup label="Lek (MåBra-bank)" className="bg-surface font-semibold text-accent">
                  {bankRefGroups.play.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-text font-normal">
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ) : null}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
          </div>
          {item.bankRef && labelForMaterialPackBankRef(item.bankRef) ? (
            <p className="mt-1.5 text-[10px] text-text-dim">
              Kuraterad bank — dokumentation, ingen auto-RAG.
            </p>
          ) : null}
        </div>
        
        <div className="flex justify-end pt-1">
          <button
            type="button"
            className="text-xs font-medium text-danger hover:text-danger-light transition-colors disabled:opacity-50"
            disabled={!user}
            onClick={() => onRemove(index)}
          >
            Ta bort genväg
          </button>
        </div>
      </div>
    </div>
  );
}
