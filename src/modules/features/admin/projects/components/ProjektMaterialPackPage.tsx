import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { useStore } from '@/core/store';
import {
  LIFE_HUB_PRESETS,
  LifeHubPresetPicker,
  clearMaterialPackOverride,
  getDefaultMaterialShortcuts,
  getMaterialPackOverride,
  materialPackHubsForPreset,
  saveMaterialPackOverride,
  useLifeHubPreset,
  type MaterialPackHub,
  type MaterialShortcut,
} from '@/core/lifeOs';
import {
  MATERIAL_TARGET_PRESETS,
  defaultTargetPreset,
  findTargetPreset,
  targetToKey,
} from '@/core/lifeOs/materialPackTargets';

const HUB_LABELS: Record<MaterialPackHub, string> = {
  familjen: 'Familjen',
  mabra: 'MåBra',
  hamn: 'Trygg hamn',
};

function newShortcut(): MaterialShortcut {
  const preset = defaultTargetPreset();
  return { label: 'Ny genväg', target: preset.target };
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
      lead="Redigera MaterialPack-genvägar som visas på Familjen, MåBra och Hamn — sparas lokalt på enheten."
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

      {saved && <p className="mt-2 text-xs text-accent">Sparat lokalt på denna enhet.</p>}

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
                <button
                  key={h}
                  type="button"
                  className={hub === h ? 'btn-pill--accent text-xs' : 'btn-pill--ghost text-xs'}
                  onClick={() => setHub(h)}
                >
                  {HUB_LABELS[h]}
                </button>
              ))}
            </div>

            <p className="text-xs text-text-dim">
              {hasOverride ? 'Egna genvägar (lokal override).' : 'Standardgenvägar från appen.'}
            </p>

            <div className="home-module-stack">
              {shortcuts.map((item, index) => {
                const targetKey = findTargetPreset(item.target)
                  ? targetToKey(item.target)
                  : targetToKey(defaultTargetPreset().target);

                return (
                  <div key={`${item.label}-${index}`} className="elongated-module space-y-2 p-3">
                    <input
                      className="input-glass w-full text-sm"
                      value={item.label}
                      disabled={!user}
                      onChange={(e) =>
                        persist(shortcuts.map((s, i) => (i === index ? { ...s, label: e.target.value } : s)))
                      }
                      placeholder="Etikett"
                    />
                    <select
                      className="input-glass w-full text-sm"
                      value={targetKey}
                      disabled={!user}
                      onChange={(e) => {
                        const preset = MATERIAL_TARGET_PRESETS.find(
                          (p) => targetToKey(p.target) === e.target.value,
                        );
                        if (!preset) return;
                        persist(
                          shortcuts.map((s, i) =>
                            i === index ? { ...s, target: preset.target, bankRef: undefined } : s,
                          ),
                        );
                      }}
                    >
                      {MATERIAL_TARGET_PRESETS.map((p) => (
                        <option key={targetToKey(p.target)} value={targetToKey(p.target)}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input-glass w-full text-xs"
                      value={item.bankRef ?? ''}
                      disabled={!user}
                      onChange={(e) =>
                        persist(
                          shortcuts.map((s, i) =>
                            i === index ? { ...s, bankRef: e.target.value || undefined } : s,
                          ),
                        )
                      }
                      placeholder="bankRef (valfritt, dokumentation)"
                    />
                    <button
                      type="button"
                      className="text-xs text-danger"
                      disabled={!user}
                      onClick={() => persist(shortcuts.filter((_, i) => i !== index))}
                    >
                      Ta bort genväg
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!user || shortcuts.length >= 12}
                className="btn-pill--accent text-sm"
                onClick={() => persist([...shortcuts, newShortcut()])}
              >
                + Lägg till genväg
              </button>
              {hasOverride && (
                <button
                  type="button"
                  disabled={!user}
                  className="btn-pill--ghost text-sm"
                  onClick={resetToDefault}
                >
                  Återställ standard
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-text-dim">
        Genvägarna visas som MaterialPack på respektive hubsida när din aktiva profil matchar.
      </p>
    </HubPageShell>
  );
}
