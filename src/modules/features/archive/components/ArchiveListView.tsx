// No React import needed
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
      {entries.map((entry, idx) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg overflow-hidden relative"
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
      ))}

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
