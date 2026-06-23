import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/modules/core/firebase/init';
import { useStore } from '@/modules/core/store';

type Props = {
  taskTitle: string;
};

export function ParalysBreakerWidget({ taskTitle }: Props) {
  const [atoms, setAtoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSystemError = useStore((s) => s.setError);

  const handleBreakdown = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const crushTask = httpsCallable<{ task: string }, { atoms: string[] }>(functions, 'crushTask');
      const result = await crushTask({ task: taskTitle });
      
      if (result.data?.atoms && result.data.atoms.length > 0) {
        setAtoms(result.data.atoms);
      } else {
        setError('Inga mikrosteg kunde genereras.');
      }
    } catch (err: any) {
      setError('Kunde inte bryta ner uppgiften just nu.');
      setSystemError(err.message || 'Fel vid anrop till crushTask');
    } finally {
      setLoading(false);
    }
  };

  if (atoms.length > 0) {
    return (
      <div className="mt-3 space-y-2 rounded-xl bg-surface-2/50 p-3 border border-border/30 animate-in fade-in duration-300">
        <p className="text-[10px] uppercase tracking-widest text-text-dim mb-2 text-left">
          Dina första atomer (max 30s/steg)
        </p>
        <ul className="space-y-2 text-left">
          {atoms.map((atom, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
              <span className="text-accent">•</span>
              <span>{atom}</span>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => setAtoms([])}
          className="mt-2 text-[10px] text-text-dim hover:text-text transition-colors w-full text-center"
        >
          Dölj
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 text-left">
      <button
        type="button"
        onClick={handleBreakdown}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs text-text-dim hover:text-accent transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
        <span>{loading ? 'Bryter ner...' : 'Bryt ner'}</span>
      </button>
      {error && <p className="text-danger text-[10px] mt-1 text-left">{error}</p>}
    </div>
  );
}
