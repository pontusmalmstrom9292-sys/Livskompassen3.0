import { useState } from 'react';
import { Tidshjulet } from './Tidshjulet';
import { KnowledgeVaultChat } from './KnowledgeVaultChat';
import { BentoCard } from '../../core/ui/BentoCard';
import { Compass, Sparkles } from 'lucide-react';

type Tab = 'chat' | 'tidshjul';

export function KunskapPage() {
  const [tab, setTab] = useState<Tab>('chat');

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('chat')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest border ${
            tab === 'chat'
              ? 'border-[#FDE68A]/40 bg-[#FDE68A]/10 text-[#FDE68A]'
              : 'border-white/10 text-slate-400'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          Kunskapsvalv
        </button>
        <button
          type="button"
          onClick={() => setTab('tidshjul')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest border ${
            tab === 'tidshjul'
              ? 'border-[#FDE68A]/40 bg-[#FDE68A]/10 text-[#FDE68A]'
              : 'border-white/10 text-slate-400'
          }`}
        >
          <Compass className="h-3 w-3" />
          Tidshjulet
        </button>
      </div>

      {tab === 'chat' ? (
        <KnowledgeVaultChat />
      ) : (
        <BentoCard title="Tidshjulet — Kampspår" description="Interaktiv tidslinje">
          <Tidshjulet />
          <p className="text-center text-sm text-slate-400 mt-4">
            Pulserande noder markerar prediktiva milstolpar i ditt Kampspår.
          </p>
        </BentoCard>
      )}
    </div>
  );
}
