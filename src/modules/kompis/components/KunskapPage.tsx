import { useState } from 'react';
import { Tidshjulet } from './Tidshjulet';
import { KnowledgeVaultChat } from './KnowledgeVaultChat';
import { BentoCard } from '../../core/ui/BentoCard';
import { TabBar } from '../../core/ui/TabBar';
import { Compass, Sparkles } from 'lucide-react';

type Tab = 'chat' | 'tidshjul';

const tabs = [
  { id: 'chat' as const, label: 'Kunskapsvalv', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'tidshjul' as const, label: 'Tidshjulet', icon: <Compass className="h-3 w-3" /> },
];

export function KunskapPage() {
  const [tab, setTab] = useState<Tab>('chat');

  return (
    <div className="space-y-6">
      <TabBar tabs={tabs} active={tab} onChange={(id) => setTab(id)} />

      {tab === 'chat' ? (
        <KnowledgeVaultChat />
      ) : (
        <BentoCard title="Tidshjulet — Kampspår" description="Interaktiv tidslinje">
          <Tidshjulet />
          <p className="mt-4 text-center text-sm text-text-dim">
            Pulserande noder markerar prediktiva milstolpar i ditt Kampspår.
          </p>
        </BentoCard>
      )}
    </div>
  );
}
