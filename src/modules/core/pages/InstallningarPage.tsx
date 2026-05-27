import { Settings } from 'lucide-react';
import { HubPageShell } from '../layout/HubPageShell';
import { TabBar, type TabBarItem } from '../ui/TabBar';
import { useStore } from '../store';
import { getAutoModuleThemesEnabled, setAutoModuleThemesEnabled } from '../theme/moduleThemeMap';
import { DrogfrihetCounterSettings } from '../../drogfrihet/components/DrogfrihetCounterSettings';
import { useState } from 'react';
import { useHubTab } from '../navigation/hooks/useHubTab';

export type InstallningarTab = 'allmant' | 'drogfrihet';

export function InstallningarPage() {
  const { tabs, activeTab, setTab } = useHubTab('installningar');
  const tab = activeTab as InstallningarTab;
  const user = useStore((s) => s.user);
  const [autoTheme, setAutoTheme] = useState(() => getAutoModuleThemesEnabled());

  return (
    <HubPageShell
      eyebrow="Inställningar"
      title="Konto · tema · drogfrihet"
      lead="Känsliga val som nollställning av räknare finns bara här."
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
        </div>
      )}

      {tab === 'drogfrihet' && <DrogfrihetCounterSettings uid={user?.uid} />}
    </HubPageShell>
  );
}
