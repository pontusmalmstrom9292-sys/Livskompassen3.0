import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, LayoutDashboard } from 'lucide-react';
import { BiochemicalShieldHub } from '../komponenter/BiochemicalShieldHub';
import { PlanningKanbanBoard } from '@/features/admin/planning/components/PlanningKanbanBoard';

type VardagenView = 'planering' | 'skold';

export const VardagenPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeView, setActiveView] = useState<VardagenView>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'planering' || tab === 'handling') return 'planering';
    return 'skold';
  });

  const handleViewChange = (view: VardagenView) => {
    setActiveView(view);
    setSearchParams({ tab: view });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'planering' || tab === 'handling') {
      setActiveView('planering');
    } else if (tab === 'skold' || tab === 'mabra') {
      setActiveView('skold');
    }
  }, [searchParams]);

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden font-sans text-slate-200">

      <header className="w-full flex-none px-6 py-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-wide text-slate-100">
            Vardagen
          </h1>
          <span className="text-slate-600 text-sm hidden md:inline-block">
            | Kognitivt operativsystem
          </span>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => handleViewChange('planering')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeView === 'planering'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
            }`}
            aria-label="Visa Planering och Kanban"
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Planering</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange('skold')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeView === 'skold'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
            }`}
            aria-label="Visa Biokemisk Sköld"
          >
            <Shield size={16} />
            <span className="hidden sm:inline">Biokemisk Sköld</span>
          </button>
        </div>
      </header>

      <main className="flex-grow relative overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-300 overflow-auto ${
            activeView === 'planering' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <PlanningKanbanBoard />
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-300 overflow-hidden ${
            activeView === 'skold' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <BiochemicalShieldHub />
        </div>
      </main>
    </div>
  );
};
