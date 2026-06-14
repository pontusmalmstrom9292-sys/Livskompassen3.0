import React from 'react';
import { useStore } from '../../../core/store';
import { useEconomySync } from '../hooks/useEconomySync';

export const EconomyCapacitanceWidget: React.FC = () => {
  const user = useStore((state) => state.user);
  const { economyAdvanced, kapacitansNiva } = useEconomySync(user?.uid);

  return (
    <div className="bg-[#020617] text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-wide text-slate-200">Finansiell Kapacitans</h3>
        <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
          MåBra Status
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex-1">
          <div className="text-sm text-slate-400 mb-1">Aktuell nivå</div>
          <div className="text-3xl font-bold text-[#FDE68A]">
            {kapacitansNiva}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-sm text-slate-400 mb-1">Automation</div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            economyAdvanced 
              ? 'bg-[#FDE68A]/20 text-[#FDE68A] border border-[#FDE68A]/50' 
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {economyAdvanced ? 'AKTIVERAD' : 'VÄNTAR'}
          </div>
        </div>
      </div>

      <div className="mt-2 text-sm text-slate-500 leading-relaxed">
        {economyAdvanced 
          ? 'Din kontinuitet i MåBra ger systemet mandat att hantera avancerade ekonomiska automationer.'
          : 'Stabilisera din MåBra-trend för att låsa upp avancerade ekonomiska funktioner och automation.'}
      </div>
    </div>
  );
};
