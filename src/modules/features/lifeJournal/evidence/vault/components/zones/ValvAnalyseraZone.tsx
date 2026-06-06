import type { VaultLog } from '@/core/types/firestore';
import { PansaretHeader } from '../PansaretHeader';
import { VaultMonsterPanel } from '../VaultMonsterPanel';
import { VaultOrkesterPanel } from '../VaultOrkesterPanel';
import type { AnalyseraVaultTab } from '../../utils/vaultTabs';

export type ValvAnalyseraZoneProps = {
  tab: AnalyseraVaultTab;
  logs: (VaultLog & { id: string })[];
};

/** Locked UX — Mönster + Orkester (Pansaret). */
export function ValvAnalyseraZone({ tab, logs }: ValvAnalyseraZoneProps) {
  if (tab === 'orkester') {
    return <VaultOrkesterPanel logs={logs} />;
  }

  return (
    <>
      <PansaretHeader />
      <VaultMonsterPanel logs={logs} />
    </>
  );
}
