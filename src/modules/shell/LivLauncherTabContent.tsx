import { lazy, Suspense } from 'react';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

const LivKompasserTabPanel = lazy(() =>
  import('./panels/LivKompasserTabPanel').then((m) => ({ default: m.LivKompasserTabPanel })),
);
const LivEkonomiTabPanel = lazy(() =>
  import('./panels/LivEkonomiTabPanel').then((m) => ({ default: m.LivEkonomiTabPanel })),
);
const LivMabraTabPanel = lazy(() =>
  import('./panels/LivMabraTabPanel').then((m) => ({ default: m.LivMabraTabPanel })),
);

export type LivInlineTab = 'kompasser' | 'ekonomi' | 'mabra';

type Props = {
  activeTab: LivInlineTab;
  userId: string;
  useLegacyEkonomi: boolean;
};

function TabFallback() {
  return (
    <div className="px-2 py-4" aria-busy="true" aria-label="Laddar innehåll">
      <HubPanelSkeleton lines={4} />
    </div>
  );
}

/** Per-flik lazy panels — minskar initial chunk på G85. */
export function LivLauncherTabContent({ activeTab, userId, useLegacyEkonomi }: Props) {
  if (activeTab === 'kompasser') {
    return (
      <Suspense fallback={<TabFallback />}>
        <LivKompasserTabPanel />
      </Suspense>
    );
  }

  if (activeTab === 'ekonomi') {
    return (
      <Suspense fallback={<TabFallback />}>
        <LivEkonomiTabPanel userId={userId} useLegacyEkonomi={useLegacyEkonomi} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<TabFallback />}>
      <LivMabraTabPanel />
    </Suspense>
  );
}
