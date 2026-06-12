import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Loader2, X, Sparkles, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function WeeklySummaryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const functions = getFunctions();
      const generateWeeklySummary = httpsCallable<{}, { summary: string }>(functions, 'generateWeeklySummary');
      const result = await generateWeeklySummary({});
      setSummary(result.data.summary);
    } catch (err) {
      console.error(err);
      setError('Kunde inte generera sammanfattningen just nu. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-surface-1 border border-border-strong shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-border/50 bg-surface-2/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-medium tracking-wide text-text">Veckans Insikter</h2>
              <p className="text-xs text-text-muted font-light tracking-widest uppercase">Mönsterigenkänning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-text-muted hover:text-text hover:bg-surface-3 rounded-full transition-colors"
            aria-label="Stäng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-surface-3">
          {!summary && !isLoading && !error && (
            <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500">
              <p className="text-text-muted mb-8 max-w-sm mx-auto text-lg font-light leading-relaxed">
                Låt Livskompassen analysera dina inlägg från de senaste 7 dagarna för att ge dig en objektiv, stärkande bild av din vecka och identifiera dina mönster.
              </p>
              <button
                onClick={handleGenerate}
                className="px-8 py-4 bg-accent hover:bg-accent/90 text-background rounded-2xl font-medium tracking-wide shadow-[0_0_20px_rgba(var(--color-accent),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-accent),0.5)] transition-all active:scale-95"
              >
                Generera Sammanfattning
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in duration-500">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="text-text-muted tracking-widest uppercase text-sm font-light animate-pulse">
                Sammanställer din vecka...
              </p>
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-2xl text-red-200 text-center animate-in fade-in duration-300">
              <ShieldAlert className="w-8 h-8 text-red-400 mx-auto mb-3" />
              {error}
            </div>
          )}

          {summary && !isLoading && (
            <div className="prose prose-invert prose-indigo max-w-none prose-headings:font-medium prose-headings:tracking-wide prose-h2:text-accent prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2 prose-p:text-text-muted prose-p:font-light prose-p:leading-relaxed prose-li:text-text-muted prose-li:font-light animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
