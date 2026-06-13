import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, History } from 'lucide-react';
import { VaultService } from '../services/VaultService';
import { useStore } from '../modules/core/store';

export interface VaultRecord {
  id: string;
  createdAt?: string;
  observation?: string;
  text?: string;
  content?: string;
  label?: string;
  [key: string]: any;
}

const VaultOverview: React.FC = () => {
  const user = useStore(state => state.user);
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const unsubscribe = VaultService.initializeVaultListener(user.uid, (data) => {
      setRecords(data as VaultRecord[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (!user) {
    return <div className="p-8 text-center text-obsidian-indigo">Vänligen logga in för att se Valvet.</div>;
  }

  return (
    <div className="w-full h-full flex flex-col bg-obsidian-bg text-white p-6 space-y-6">
      <header className="flex items-center justify-between border-b border-obsidian-indigo/20 pb-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-obsidian-gold" size={28} />
          <h1 className="text-2xl font-semibold text-obsidian-gold tracking-wide">Valvet</h1>
        </div>
        <div className="flex items-center gap-2 bg-obsidian-indigo/10 px-3 py-1.5 rounded-full border border-obsidian-indigo/30">
          <Lock className="text-obsidian-indigo" size={16} />
          <span className="text-sm font-medium text-obsidian-indigo">Säker lagring (WORM)</span>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-obsidian-indigo" size={20} />
          <h2 className="text-lg font-medium text-gray-200">Historiska poster</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-obsidian-gold"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-gray-400">Valvet är tomt. Inga oföränderliga poster hittades.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div 
                key={record.id} 
                className="bg-white/5 border border-obsidian-indigo/20 p-4 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-obsidian-indigo font-mono">
                    {record.createdAt ? new Date(record.createdAt).toLocaleString('sv-SE') : 'Okänt datum'}
                  </span>
                  <Lock size={14} className="text-obsidian-indigo/60" />
                </div>
                <div className="text-gray-200">
                  {record.observation || record.text || record.content || record.label || 'Data'}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VaultOverview;
