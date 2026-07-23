/**
 * VaultEconomyPanel — PIN-skyddad Valv-yta för Arbetsliv-data.
 *
 * Denna komponent är ett rent navigationsskal. Den äger INGEN data och
 * gör INGA direkta Firestore-anrop mot arbetslivFirestore eller economyFirestore.
 *
 * All frånvaro- och historiklogik delegeras helt till ArbetslivFranvaroPanel
 * som ägs och underhålls av Arbetsliv-domänen.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar, type TabBarItem } from '../../core/ui/TabBar';
import { ArbetslivFranvaroPanel } from '@/features/dailyLife/arbetsliv/components/ArbetslivFranvaroPanel';

type VaultEcoTab = 'franvaro' | 'historik';

const TABS: TabBarItem<VaultEcoTab>[] = [
  { id: 'franvaro', label: 'Frånvaro' },
  { id: 'historik', label: 'Historik (tid)' },
];

export function VaultEconomyPanel() {
  const [tab, setTab] = useState<VaultEcoTab>('franvaro');

  return (
    <div className="space-y-4">
      {/* ─── Navigationsskal: rubrik, beskrivning, flikval ─────────────────── */}
      <BentoCard title="Lön och räkningar" icon={<Wallet className="h-4 w-4" />} description="PIN-skyddad">
        <p className="mb-3 text-sm text-text-muted">
          Pengar, logg och period finns i{' '}
          <Link
            to="/vardagen?tab=ekonomi"
            className="inline-flex min-h-11 items-center text-accent-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            Vardagen → Ekonomi
          </Link>
          . Här: frånvaro och tidshistorik under PIN.
        </p>
        <TabBar<VaultEcoTab> tabs={TABS} active={tab} onChange={setTab} />
      </BentoCard>

      {/* ─── Arbetsliv-domänens komponent hanterar all data och CRUD ──────── */}
      <ArbetslivFranvaroPanel activeTab={tab} />
    </div>
  );
}
