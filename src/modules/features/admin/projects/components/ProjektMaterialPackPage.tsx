import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { useStore } from '@/core/store';
import {
  LIFE_HUB_PRESETS,
  LifeHubPresetPicker,
  MATERIAL_PACK_BANK_REFS,
  clearMaterialPackOverride,
  MaterialPackShortcuts,
  getDefaultMaterialShortcuts,
  getMaterialPackOverride,
  materialPackHubsForPreset,
  routineNavigateShortcuts,
  saveMaterialPackOverride,
  shortcutsIncludeTarget,
  useLifeHubPreset,
  type MaterialPackHub,
  type MaterialShortcut,
} from '@/core/lifeOs';
import {
  defaultTargetPreset,
  findTargetPreset,
  targetToKey,
} from '@/core/lifeOs/materialPackTargets';
import { ShortcutEditorRow } from './ShortcutEditorRow';
import { Button } from '@/design-system';

const HUB_LABELS: Record<MaterialPackHub, string> = {
  familjen: 'Familjen',
  mabra: 'MåBra',
  hamn: 'Trygg hamn',
};

function newShortcut(): MaterialShortcut {
  const preset = defaultTargetPreset();
  return { label: 'Ny genväg', target: preset.target };
}

function moveShortcut(list: MaterialShortcut[], from: number, to: number): MaterialShortcut[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

function duplicateTargetKeys(shortcuts: MaterialShortcut[]): Set<string> {
  const counts = new Map<string, number>();
  for (const item of shortcuts) {
    const key = findTargetPreset(item.target)
      ? targetToKey(item.target)
      : targetToKey(defaultTargetPreset().target);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return new Set([...counts.entries()].filter(([, n]) => n > 1).map(([key]) => key));
}

/** Route: /projekt/genvagar — MaterialPack-editor light (lokal persistens). */
export function ProjektMaterialPackPage() {
  const user = useStore((s) => s.user);
  const { presetId, setPresetId } = useLifeHubPreset();
  const [hub, setHub] = useState<MaterialPackHub>('familjen');
  const [shortcuts, setShortcuts] = useState<MaterialShortcut[]>([]);
  const [saved, setSaved] = useState(false);
  const [hasOverride, setHasOverride] = useState(false);

  const availableHubs = materialPackHubsForPreset(presetId, user?.uid);
  const activePreset = LIFE_HUB_PRESETS.find((p) => p.id === presetId)!;
  const duplicateKeys = useMemo(() => duplicateTargetKeys(shortcuts), [shortcuts]);
  const routineCandidates = useMemo(() => routineNavigateShortcuts(presetId), [presetId]);
  const bankRefGroups = useMemo(() => {
    const groups = {
      panel: [] as (typeof MATERIAL_PACK_BANK_REFS)[number][],
      reflection: [] as (typeof MATERIAL_PACK_BANK_REFS)[number][],
      play: [] as (typeof MATERIAL_PACK_BANK_REFS)[number][],
    };
    for (const row of MATERIAL_PACK_BANK_REFS) {
      groups[row.group].push(row);
    }
    return groups;
  }, []);

  useEffect(() => {
    if (availableHubs.length === 0) return;
    if (!availableHubs.includes(hub)) {
      setHub(availableHubs[0]!);
    }
  }, [availableHubs, hub]);

  useEffect(() => {
    if (!user) {
      setShortcuts(getDefaultMaterialShortcuts(presetId, hub));
      setHasOverride(false);
      return;
    }
    const override = getMaterialPackOverride(user.uid, presetId, hub);
    setHasOverride(!!override);
    setShortcuts(override ?? getDefaultMaterialShortcuts(presetId, hub));
  }, [user, presetId, hub]);

  const persist = (next: MaterialShortcut[]) => {
    setShortcuts(next);
    if (user) {
      saveMaterialPackOverride(user.uid, presetId, hub, next);
      setHasOverride(true);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    }
  };

  const resetToDefault = () => {
    if (!user) return;
    clearMaterialPackOverride(user.uid, presetId, hub);
    setShortcuts(getDefaultMaterialShortcuts(presetId, hub));
    setHasOverride(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <HubPageShell
      eyebrow="Göra"
      title="Genvägar per profil"
      lead="Redigera MaterialPack-genvägar på Familjen, MåBra och Hamn — synkas mellan enheter när du är inloggad."
    >
      <GoraHubTabBar />
      <div className="flex flex-wrap gap-3 text-xs">
        <Link to="/projekt" className="text-text-dim hover:text-accent">
          ← Projekt
        </Link>
        <Link to="/installningar" className="text-accent">
          Byt aktiv profil (Inställningar)
        </Link>
      </div>

      {!user && (
        <p className="mt-3 text-sm text-text-muted">Logga in för att spara egna genvägar.</p>
      )}

      {saved && <p className="mt-2 text-xs text-accent">Sparat — synkas till dina andra enheter.</p>}

      <div className="mt-4 space-y-4">
        <div className="elongated-module space-y-2 p-3">
          <p className="text-[10px] uppercase tracking-widest text-text-dim">LifeHubPreset</p>
          <LifeHubPresetPicker activeId={presetId} onSelect={setPresetId} />
          <p className="text-xs text-text-muted">{activePreset.lead}</p>
        </div>

        {availableHubs.length === 0 ? (
          <p className="text-sm text-text-dim">
            Profilen &quot;{activePreset.label}&quot; har inga MaterialPack-hubbar. Välj t.ex. Förälder — trygg
            hamn.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {availableHubs.map((h) => (
                <Button key={h} type="button" variant={hub === h ? 'accent' : 'ghost'} className="text-xs" onClick={() => setHub(h)}>
                  {HUB_LABELS[h]}
                </Button>
              ))}
            </div>

            <p className="text-xs text-text-dim">
              {hasOverride ? 'Egna genvägar (synkas mellan enheter).' : 'Standardgenvägar från appen.'}
              {' · '}
              Max 12.
            </p>

            {duplicateKeys.size > 0 && (
              <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/90">
                Samma mål används flera gånger — överväg att ta bort eller byta duplicat.
              </p>
            )}

            <div className="flex flex-col gap-4">
              {shortcuts.map((item, index) => {
                const targetKey = findTargetPreset(item.target)
                  ? targetToKey(item.target)
                  : targetToKey(defaultTargetPreset().target);
                const isDuplicate = duplicateKeys.has(targetKey);

                return (
                  <ShortcutEditorRow
                    key={`${item.label}-${index}`}
                    item={item}
                    index={index}
                    totalLength={shortcuts.length}
                    user={user}
                    isDuplicate={isDuplicate}
                    bankRefGroups={bankRefGroups}
                    onUpdate={(idx, updated) =>
                      persist(shortcuts.map((s, i) => (i === idx ? { ...s, ...updated } : s)))
                    }
                    onMove={(from, to) => persist(moveShortcut(shortcuts, from, to))}
                    onRemove={(idx) => persist(shortcuts.filter((_, i) => i !== idx))}
                  />
                );
              })}
            </div>

            {routineCandidates.length > 0 && (
              <section className="rounded-2xl border border-border-strong bg-surface/30 p-5 shadow-lg backdrop-blur-md mt-2">
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    Från rutiner
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Lägg till navigate-steg från Life OS-rutiner — samma mål som i Planering → Snabbstarter.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {routineCandidates.map((row) => {
                    const key = `${row.routineId}-${row.stepIndex}`;
                    const already = shortcutsIncludeTarget(shortcuts, row.shortcut);
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={!user || shortcuts.length >= 12 || already}
                        className="group flex items-center gap-2 rounded-full border border-border-subtle bg-surface/50 px-3 py-1.5 text-xs transition-colors hover:border-accent/50 hover:bg-accent/10 disabled:opacity-30 disabled:hover:border-border-subtle disabled:hover:bg-surface/50"
                        title={row.routineTitle}
                        onClick={() => persist([...shortcuts, row.shortcut])}
                      >
                        <span className="font-medium text-text transition-colors group-hover:text-accent">{row.shortcut.label}</span>
                        <span className="text-[10px] text-text-dim">· {row.routineTitle}</span>
                        {!already && <span className="ml-1 text-accent opacity-0 transition-opacity group-hover:opacity-100">+</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button type="button" disabled={!user || shortcuts.length >= 12} variant="accent" className="--accent shadow-lg shadow-accent/20" onClick={() => persist([...shortcuts, newShortcut()])}>
                + Lägg till genväg
              </Button>
              {hasOverride && (
                <Button type="button" disabled={!user} variant="ghost" className="--ghost" onClick={resetToDefault}>
                  Återställ standard
                </Button>
              )}
            </div>

            <section className="rounded-2xl border border-border-strong bg-surface/30 p-5 shadow-lg backdrop-blur-md mt-6">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Förhandsvisning · {HUB_LABELS[hub]}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Så här ser genvägarna ut på {HUB_LABELS[hub].toLowerCase()} när profilen är aktiv.
                </p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface/40 p-4 shadow-inner">
                <MaterialPackShortcuts
                  preset={activePreset}
                  hub={hub}
                  shortcutsOverride={shortcuts}
                />
              </div>
            </section>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-text-dim">
        Genvägarna visas som MaterialPack på respektive hubsida när din aktiva profil matchar.
      </p>
    </HubPageShell>
  );
}
