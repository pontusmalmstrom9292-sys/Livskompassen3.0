import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bell, Package, Settings, Shield, User, LayoutGrid } from 'lucide-react';
import { useTheme } from '../theme';
import { isMidnightExecutiveTheme } from '../theme/themePackMidnightExecutive';
import { ExecutiveSettingsList, type ExecutiveSettingsGroup } from '../ui/executive';
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
import { LifeHubPresetPicker, useLifeHubPreset } from '../lifeOs';
import { useHubTab } from '../navigation/hooks/useHubTab';
import { ClearDevicePanel } from '../security/ClearDevicePanel';
import { AdaptationPrefsPanel } from '../adaptation/AdaptationPrefsPanel';
import { ADAPTATION_LAYER_FLAG, useAdaptationStore } from '../store/useAdaptationStore';
import { useEvolutionStore } from '../store/useEvolutionStore';
import { DimModeToggle } from '../ui/DimModeToggle';
import { GhostModeToggle } from '../ui/GhostModeToggle';
import { FetchContentPacksFlow } from '../home/dev/FetchContentPacksFlow';
import { CustomCategoryFlow } from '../home/dev/CustomCategoryFlow';
import { Button } from '@/design-system';

export type InstallningarTab = 'allmant' | 'naring' | 'drogfrihet';

const EXEC_SETTINGS_GROUPS: ExecutiveSettingsGroup[] = [
  {
    id: 'konto',
    title: 'Konto & profil',
    rows: [
      { id: 'profil', label: 'Profil', icon: User },
      { id: 'sakerhet', label: 'Säkerhet & Valv', icon: Shield },
      { id: 'notis', label: 'Notiser', icon: Bell },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    rows: [
      { id: 'support', label: 'Support' },
      { id: 'om', label: 'Om Livskompassen' },
    ],
  },
];

export function InstallningarPage() {
  const { tabs, activeTab, setTab } = useHubTab('installningar');
  const tab = (activeTab || 'allmant') as InstallningarTab;
  const user = useStore((s) => s.user);
  const { themeId } = useTheme();
  const executiveSkin = isMidnightExecutiveTheme(themeId);
  const { presetId, setPresetId } = useLifeHubPreset();
  const [autoTheme, setAutoTheme] = useState(() => getAutoModuleThemesEnabled());
  const [stampOnHome, setStampOnHome] = useState(() => isStampOnHomeScreenEnabled());
  const [packOpen, setPackOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const adaptationEnabled =
    useEvolutionStore((s) => s.hasFeature(ADAPTATION_LAYER_FLAG)) ||
    useAdaptationStore((s) => s.layerEnabled);

  return (
    <HubPageShell
      eyebrow="Inställningar"
      title="Konto · tema · näring"
      lead="Känsliga val och utökade funktioner finns bara här."
      headerAside={<Settings className="h-5 w-5 text-text-dim" strokeWidth={1.5} />}
      executiveHeader={executiveSkin}
    >
      <TabBar<InstallningarTab>
        tabs={tabs as TabBarItem<InstallningarTab>[]}
        active={tab}
        onChange={(id) => setTab(id)}
      />

      {tab === 'allmant' && (
        <div className="space-y-4">
          {/* Companion OS först — G85: synlig utan scroll */}
          <div className="space-y-2 rounded-2xl border border-accent/35 bg-surface-2/50 p-4">
            <p className="text-sm font-medium text-text">Companion OS</p>
            <p className="text-xs leading-relaxed text-text-dim">
              Välj vilka widgets som syns på Hem. På Android: långtryck hemskärm → Widgets →
              Livskompassen (Companion).
            </p>
            <Link
              to="/installningar/widget-studio"
              className="flex min-h-12 items-center justify-between rounded-xl border border-accent/50 bg-surface-2/80 px-4 py-3 text-sm font-medium text-text transition-colors hover:border-accent"
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-accent" strokeWidth={1.5} />
                Widget Studio
              </span>
              <span className="text-xs text-accent">Öppna →</span>
            </Link>
            {import.meta.env.DEV ? (
              <Link
                to="/dev/companion-widgets"
                className="flex min-h-11 items-center justify-between rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-sm text-text transition-colors hover:border-accent/40"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-accent" strokeWidth={1.5} />
                  Companion-labb
                </span>
                <span className="text-xs text-text-dim">Testa alla 10</span>
              </Link>
            ) : null}
          </div>
          {executiveSkin ? (
            <ExecutiveSettingsList groups={EXEC_SETTINGS_GROUPS} />
          ) : null}
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

          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-dim">
              Utvecklingskort
            </p>
            <Button
              type="button"
              variant="ghost"
              className="flex min-h-[44px] w-full items-center justify-start gap-2 text-left text-sm"
              disabled={!user?.uid}
              onClick={() => setPackOpen(true)}
            >
              <Package className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="block font-medium text-text">Uppdatera / hämta faktapack</span>
                <span className="block text-xs text-text-muted">
                  Gratis · i appen — samma flöde som Mer för dig
                </span>
              </span>
            </Button>
          </div>

          <DimModeToggle />
          <GhostModeToggle />

          {adaptationEnabled && user?.uid ? (
            <AdaptationPrefsPanel userId={user.uid} />
          ) : null}

          <ClearDevicePanel />
          </div>

          {user?.uid ? (
            <>
              <FetchContentPacksFlow
                open={packOpen}
                onClose={() => setPackOpen(false)}
                userId={user.uid}
                onRequestCustomCategory={() => {
                  setPackOpen(false);
                  setCustomOpen(true);
                }}
              />
              <CustomCategoryFlow
                open={customOpen}
                onClose={() => setCustomOpen(false)}
                userId={user.uid}
              />
            </>
          ) : null}
        </div>
      )}

      {tab === 'naring' && <NutritionSettingsPanel uid={user?.uid} />}

      {tab === 'drogfrihet' && <DrogfrihetCounterSettings uid={user?.uid} />}
    </HubPageShell>
  );
}
