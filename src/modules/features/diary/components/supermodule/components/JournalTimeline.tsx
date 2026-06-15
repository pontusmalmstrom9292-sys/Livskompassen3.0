import React from 'react';
import type { Entry } from '../types';

interface JournalTimelineProps {
  data: Entry[];
  loading: boolean;
  filter: 'journal' | 'vault' | 'insights';
  onSelect: (entry: Entry) => void;
  activeEntryId?: string;
}

export const JournalTimeline: React.FC<JournalTimelineProps> = ({ data, loading, filter, onSelect, activeEntryId }) => {
  if (loading) return (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
  
  // När fliken "Insikter" är vald vill vi ha hela datasetet, annars filtrerar vi
  const filteredData = data?.filter((item) => filter === 'insights' ? true : item.type === filter) || [];
  
  return (
    <div className="p-4 flex flex-col gap-3">
      {filteredData.map((item) => {
        const isVault = item.type === 'vault';
        const isActive = activeEntryId === item.id;
        
        let dateString = '';
        if (item.createdAt) {
          if (typeof item.createdAt === 'object' && 'seconds' in item.createdAt) {
            dateString = new Date(item.createdAt.seconds * 1000).toLocaleDateString();
          } else {
            dateString = new Date(item.createdAt as string | number).toLocaleDateString();
          }
        }
        
        return (
          <div 
            key={item.id} 
            onClick={() => onSelect(item)}
            className={`
              relative p-4 rounded-xl cursor-pointer transition-all duration-200 group overflow-hidden border
              ${isActive ? 'bg-surface-3 border-border-strong shadow-md' : 'bg-background-surface border-border-muted hover:border-white/20'}
            `}
          >
            {/* Färgaccent i kanten */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isVault ? 'bg-accent-gold' : 'bg-indigo-500'} opacity-70 group-hover:opacity-100 transition-opacity`} />
            
            <div className="pl-2">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isVault ? 'text-accent-gold' : 'text-indigo-400'}`}>
                  {isVault ? 'Valvet' : 'Dagbok'}
                </span>
                <span className="text-[10px] text-text-muted font-mono tabular-nums">
                  {dateString}
                </span>
              </div>
              <div className="text-sm text-text font-medium truncate">
                {item.type === 'journal' ? item.mood || item.action || 'Anteckning' : item.action || 'Anteckning'}
              </div>
            </div>
          </div>
        );
      })}
      
      {filteredData.length === 0 && (
        <div className="text-center p-6 text-text-muted text-sm border border-dashed border-white/10 rounded-xl">
          Inga inlägg hittades.
        </div>
      )}
    </div>
  );
};
