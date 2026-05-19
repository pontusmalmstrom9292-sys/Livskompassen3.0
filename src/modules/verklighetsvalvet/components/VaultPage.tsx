import { Lock, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { BentoCard } from '../../core/ui/BentoCard';

export function VaultPage() {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  return (
    <BentoCard
      title="Verklighetsvalvet"
      description="3 sek press + pin i full version"
      icon={<ShieldAlert className="h-4 w-4" />}
      className="md:col-span-2"
    >
      {!unlocked ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">Lagrad bevisning ar skyddad och oforanderlig (WORM).</p>
          <div className="flex items-center gap-2">
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className="rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
            />
            <button
              onClick={() => setUnlocked(pin === '6469')}
              className="rounded-xl border border-[#FDE68A]/30 px-3 py-2 text-xs uppercase tracking-widest text-[#FDE68A]"
            >
              Lås upp
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-300 text-sm">
          <Lock className="h-4 w-4" />
          Valvet ar upplast. Modul for arkiv, akter och entiteter kan nu anslutas.
        </div>
      )}
    </BentoCard>
  );
}
