import React from 'react';

interface SmartToolbarProps {
  activeTab: 'journal' | 'vault' | 'insights';
  setActiveTab: (tab: 'journal' | 'vault' | 'insights') => void;
}

export const SmartToolbar: React.FC<SmartToolbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="p-4 border-b border-border-muted flex gap-2 overflow-x-auto no-scrollbar">
      {(['journal', 'vault', 'insights'] as const).map(tab => (
        <button 
          key={tab}
          onClick={() => setActiveTab(tab)} 
          className={`
            px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all whitespace-nowrap border
            ${activeTab === tab 
              ? tab === 'vault' ? 'bg-accent-gold/10 text-accent-gold border-accent-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]' 
                : tab === 'insights' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                : 'bg-white/10 text-text border-white/20 shadow-sm'
              : 'bg-transparent text-text-muted hover:text-text border-transparent hover:bg-white/5'}
          `}
        >
          {tab === 'journal' ? 'Dagbok' : tab === 'vault' ? 'Valvet' : 'Insikter'}
        </button>
      ))}
    </div>
  );
};
