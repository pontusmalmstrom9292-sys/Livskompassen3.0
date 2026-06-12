import { useState } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import type { ArchiveEntry } from '../hooks/useArchiveData';
import { Book, Shield, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArchiveListViewProps {
  entries: ArchiveEntry[];
  loading: boolean;
  onLoadMore: () => void;
}

export function ArchiveListView({ entries, loading, onLoadMore }: ArchiveListViewProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'red_flag' | 'insight' | 'boundary'>('all');

  const filteredEntries = entries.filter((entry) => {
    if (filter === 'all') return true;
    return entry.tags?.includes(filter);
  });

  if (entries.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg mb-6 relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <Book className="w-10 h-10 text-white/80 relative z-10" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Ditt arkiv är tomt</h3>
        <p className="text-white/50 text-sm max-w-xs mb-8 leading-relaxed">
          När du skriver reflektioner eller sparar bevis i Valvet kommer de att samlas här på ett säkert sätt.
        </p>
        <button
          onClick={() => navigate('/hjartat?tab=reflektion')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all active:scale-95"
        >
          <PenLine className="w-4 h-4" />
          <span className="font-medium text-sm">Skriv din första reflektion</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-white/20 text-white shadow-md'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          Visa alla
        </button>
        <button
          onClick={() => setFilter('red_flag')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === 'red_flag'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          🚩 Röda flaggor
        </button>
        <button
          onClick={() => setFilter('insight')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === 'insight'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          💡 Insikter
        </button>
        <button
          onClick={() => setFilter('boundary')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === 'boundary'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          🛡️ Gränssättningar
        </button>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-10 text-white/50 text-sm italic">
          Inga träffar för valt filter.
        </div>
      ) : (
        filteredEntries.map((entry, idx) => {
          let ringClass = '';
          if (entry.tags?.includes('red_flag')) ringClass = 'ring-1 ring-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
          else if (entry.tags?.includes('insight')) ringClass = 'ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
          else if (entry.tags?.includes('boundary')) ringClass = 'ring-1 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]';

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 overflow-hidden relative ${ringClass || 'shadow-lg'}`}
            >
          {/* Typ-indikator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {entry.type === 'journal' ? (
                <div className="flex items-center gap-2 text-blue-300">
                  <Book className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Dagbok</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-purple-300">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Valv</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-white/60">
              {entry.createdAt && format(new Date(entry.createdAt.seconds * 1000), "d MMMM yyyy HH:mm", { locale: sv })}
            </div>
          </div>

          {/* Badges / Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {entry.tags.includes('red_flag') && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  🚩 Röd flagg
                </span>
              )}
              {entry.tags.includes('insight') && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  💡 Insikt
                </span>
              )}
              {entry.tags.includes('boundary') && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  🛡️ Gräns
                </span>
              )}
            </div>
          )}

          {/* Innehåll */}
          {entry.transcription ? (
            <p className="text-white/90 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
              {entry.transcription}
            </p>
          ) : entry.content ? (
            <p className="text-white/90 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
              {entry.content}
            </p>
          ) : (
            <p className="text-white/50 text-sm italic mb-3">Inget textinnehåll.</p>
          )}

          {/* Metadata chips (t.ex. känsla) */}
          {entry.emotion && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80">
                Känsla: {entry.emotion}
              </span>
            </div>
          )}
        </motion.div>
          );
        })
      )}

      {/* Ladda mer knapp */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Hämtar...' : 'Ladda tidigare månad'}
        </button>
      </div>
    </div>
  );
}
