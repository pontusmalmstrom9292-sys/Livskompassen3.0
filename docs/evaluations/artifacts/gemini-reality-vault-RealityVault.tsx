/**
 * Gemini / extern mock — Verklighetsvalvet (inkorg only).
 * NOT part of Vite build. Source: user paste 2026-05-23.
 * Map to `VaultPage`, `VaultEntryForm`, `VaultLogList`, `reality_vault` WORM.
 */

import React, { useState } from 'react';
import { Database, Lock, Search, FileText, AlertTriangle, Plus } from 'lucide-react';
import { LogEntry } from '../types';

interface RealityVaultProps {
  logs: LogEntry[];
  onAddLog: (log: Omit<LogEntry, 'id' | 'date'>) => void;
}

const RealityVault: React.FC<RealityVaultProps> = ({ logs, onAddLog }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'new-standard' | 'new-contrast'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theirVersion, setTheirVersion] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent, type: 'standard' | 'contrast') => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddLog({
      title,
      content,
      type,
      theirVersion: type === 'contrast' ? theirVersion : undefined,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
    });

    setTitle('');
    setContent('');
    setTheirVersion('');
    setTags('');
    setActiveTab('list');
  };

  const filteredLogs = logs.filter(log => 
    log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Info */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden border-slate-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-4 relative z-10 mb-2">
          <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
            <Database className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">WORM-Lagring</h2>
            <h1 className="text-xl font-bold text-slate-100">Verklighetsvalvet</h1>
          </div>
        </div>
        <p className="text-sm text-slate-400 relative z-10 mt-2">
          Oföränderliga bevis. Tidsstämplad data som skyddar mot gaslighting och efterhandskonstruktioner.
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <button 
          onClick={() => setActiveTab('list')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'list' ? 'bg-white/10 text-slate-200 shadow-sm' : 'glass-panel text-slate-500 hover:text-slate-300'}`}
        >
          Säkrade Loggar
        </button>
        <button 
          onClick={() => setActiveTab('new-standard')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'new-standard' ? 'bg-white/10 text-slate-200 shadow-sm' : 'glass-panel text-slate-500 hover:text-slate-300'}`}
        >
          <Plus className="w-3.5 h-3.5" /> Nytt Bevis
        </button>
        <button 
          onClick={() => setActiveTab('new-contrast')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'new-contrast' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'glass-panel text-rose-500/70 hover:text-rose-400'}`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Svart på Vitt
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Sök i valvet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-panel rounded-2xl pl-12 pr-4 py-4 text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>

          <div className="space-y-4 mt-6">
            {filteredLogs.map(log => (
              <div key={log.id} className="glass-panel rounded-3xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-200">{log.title}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono bg-midnight-900 px-2 py-1 rounded-lg border border-white/5">
                    <Lock className="w-3 h-3" />
                    {log.date}
                  </div>
                </div>
                
                {log.type === 'contrast' ? (
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2 block">Hens version</span>
                      <p className="text-slate-300 italic text-sm">"{log.theirVersion}"</p>
                    </div>
                    <div className="bg-turquoise-950/30 border border-turquoise-900/50 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-turquoise-500 uppercase tracking-wider mb-2 block">Fakta / Min verklighet</span>
                      <p className="text-slate-200 text-sm">"{log.content}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-midnight-900/50 rounded-2xl p-4 border border-white/5">
                    <p className="text-slate-300 font-mono text-sm">"{log.content}"</p>
                  </div>
                )}

                {log.tags.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {log.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-slate-500 glass-panel rounded-3xl">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Inga loggar hittades.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'new-standard' && (
        <form onSubmit={(e) => handleSubmit(e, 'standard')} className="glass-panel rounded-3xl p-6 space-y-5 animate-in slide-in-from-right-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rubrik</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="T.ex. Hämtning fredag v.21"
              className="w-full bg-midnight-900 border border-white/10 rounded-2xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Objektiva fakta</label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Skriv endast objektiva fakta. Undvik känslomässiga tolkningar."
              rows={4}
              className="w-full bg-midnight-900 border border-white/10 rounded-2xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-slate-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Taggar (kommaseparerade)</label>
            <input 
              type="text" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="hämtning, skola, sjukdom"
              className="w-full bg-midnight-900 border border-white/10 rounded-2xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-slate-500"
            />
          </div>
          <button type="submit" className="bg-white/10 hover:bg-white/20 text-slate-200 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors w-full border border-white/5">
            <Lock className="w-4 h-4" />
            Lås inlägg i Valvet
          </button>
        </form>
      )}

      {activeTab === 'new-contrast' && (
        <form onSubmit={(e) => handleSubmit(e, 'contrast')} className="glass-panel border-rose-500/20 rounded-3xl p-6 space-y-6 animate-in slide-in-from-right-4">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-500/30">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Svart på Vitt (Kontrastlogg)</h3>
              <p className="text-xs text-slate-400 mt-1">Ställ påståenden mot fakta för att krossa gaslighting.</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Händelse / Rubrik</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="T.ex. Diskussion om mattider"
              className="w-full bg-midnight-900 border border-white/10 rounded-2xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">Hens version / Agerande</label>
              <textarea 
                required
                value={theirVersion}
                onChange={(e) => setTheirVersion(e.target.value)}
                placeholder="T.ex. Påstår att jag missköter pojkarnas mattider."
                rows={3}
                className="w-full bg-rose-950/30 border border-rose-900/50 rounded-2xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-turquoise-400 uppercase tracking-widest mb-2">Min verklighet / Fakta</label>
              <textarea 
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="T.ex. Loggat middag kl 17:30 måndag-torsdag. Barnen mätta och nöjda."
                rows={3}
                className="w-full bg-turquoise-950/30 border border-turquoise-900/50 rounded-2xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-turquoise-500 resize-none"
              />
            </div>
          </div>
          
          <button type="submit" className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors w-full">
            <Lock className="w-4 h-4" />
            Lås bevis mot gaslighting
          </button>
        </form>
      )}
    </div>
  );
};

export default RealityVault;
