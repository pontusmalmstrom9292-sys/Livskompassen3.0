import { Settings } from 'lucide-react';
import { HubPageShell } from '../layout/HubPageShell';
import { TabBar, type TabBarItem } from '../ui/TabBar';
import { useStore } from '../store';
import { getAutoModuleThemesEnabled, setAutoModuleThemesEnabled } from '../theme/moduleThemeMap';
import { DrogfrihetCounterSettings } from '@/features/dailyLife/drogfrihet/components/DrogfrihetCounterSettings';
import { NutritionSettingsPanel } from '@/features/dailyLife/wellbeing/naring/components/NutritionSettingsPanel';
import {
  isStampOnHomeScreenEnabled,
  setStampOnHomeScreenEnabled,
} from '@/features/admin/stampla';
import { useState } from 'react';
import { LifeHubPresetPicker, useLifeHubPreset } from '../lifeOs';
import { useHubTab } from '../navigation/hooks/useHubTab';
import { ClearDevicePanel } from '../security/ClearDevicePanel';
import { AdaptationPrefsPanel } from '../adaptation/AdaptationPrefsPanel';
import { ADAPTATION_LAYER_FLAG, useAdaptationStore } from '../store/useAdaptationStore';
import { useEvolutionStore } from '../store/useEvolutionStore';
import { DimModeToggle } from '../ui/DimModeToggle';
import { GhostModeToggle } from '../ui/GhostModeToggle';

export type InstallningarTab = 'allmant' | 'naring' | 'drogfrihet';

export function InstallningarPage() {
  const { tabs, activeTab, setTab } = useHubTab('installningar');
  const tab = (activeTab || 'allmant') as InstallningarTab;
  const user = useStore((s) => s.user);
  const { presetId, setPresetId } = useLifeHubPreset();
  const [autoTheme, setAutoTheme] = useState(() => getAutoModuleThemesEnabled());
  const [stampOnHome, setStampOnHome] = useState(() => isStampOnHomeScreenEnabled());
  const adaptationEnabled =
    useEvolutionStore((s) => s.hasFeature(ADAPTATION_LAYER_FLAG)) ||
    useAdaptationStore((s) => s.layerEnabled);

  return (
    <HubPageShell
      eyebrow="Inställningar"
      title="Konto · tema · näring"
      lead="Känsliga val och utökade funktioner finns bara här."
      headerAside={<Settings className="h-5 w-5 text-text-dim" strokeWidth={1.5} />}
    >
      <TabBar<InstallningarTab>
        tabs={tabs as TabBarItem<InstallningarTab>[]}
        active={tab}
        onChange={(id) => setTab(id)}
      />

      {tab === 'allmant' && (
        <div className="glass-card space-y-4 rounded-[2rem] border border-border p-5">
          <p className="text-sm text-text-muted">
            Konto och inloggning: tryck på <strong className="text-text">låsikonen</strong> uppe till
            höger i headern.
          </p>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-accent"
              checked={autoTheme}
              onChange={(e) => {
                const next = e.target.checked;
                setAutoModuleThemesEnabled(next);
                setAutoTheme(next);
              }}
            />
            <span className="text-sm text-text-muted">Automatiskt tema per modul</span>
          </label>
          <p className="text-xs text-text-dim">Temat uppdateras när du byter sida.</p>

          <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
              checked={stampOnHome}
              onChange={(e) => {
                const next = e.target.checked;
                setStampOnHomeScreenEnabled(next);
                setStampOnHome(next);
              }}
            />
            <span className="text-sm leading-relaxed text-text-muted">
              <span className="block font-medium text-text">Stämpelklocka på Hem</span>
              Standard är Arbetsliv och hemskärms-widget. Aktivera bara om du vill ha In/Ut direkt på
              Hem också.
            </span>
          </label>

          <LifeHubPresetPicker activeId={presetId} onSelect={setPresetId} />

          <DimModeToggle />
          <GhostModeToggle />

          {adaptationEnabled && user?.uid ? (
            <AdaptationPrefsPanel userId={user.uid} />
          ) : null}

          <ClearDevicePanel />
        </div>
      )}

      {tab === 'naring' && <NutritionSettingsPanel uid={user?.uid} />}

      {tab === 'drogfrihet' && <DrogfrihetCounterSettings uid={user?.uid} />}
    </HubPageShell>
  );
}
