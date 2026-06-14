import { useState, useEffect } from 'react';
import { Plus, Loader2, Check } from 'lucide-react';
import { LIVSLOGG_CATEGORIES, type LivsloggCategory } from '../../constants';
import { SaveAsEvidencePrompt } from '../../components/SaveAsEvidencePrompt';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';

export function FamiljenLivsloggObservationDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const childAlias = shell.activeChild;
  const userId = shell.user?.uid;
  const onSave = shell.handleSaveObservation;

  const [step, setStep] = useState<'form' | 'saved'>('form');
  const [observation, setObservation] = useState('');
  const [childrenImpact, setChildrenImpact] = useState('');
  const [category, setCategory] = useState<LivsloggCategory>('vardag');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      setObservation('');
      setChildrenImpact('');
      setCategory('vardag');
      setStep('form');
      setSavedLogId(null);
      setError(null);
    };
  }, [childAlias]);

  const resetForm = () => {
    setObservation('');
    setChildrenImpact('');
    setCategory('vardag');
    setStep('form');
    setSavedLogId(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!observation.trim()) return;
    if (!userId) {
      setError('Ej inloggad. Kan inte spara.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const id = await onSave({
        observation: observation.trim(),
        category: category,
        childrenImpact: childrenImpact.trim() || undefined,
      });
      setSavedLogId(id);
      setStep('saved');
      onSaved?.(id);
    } catch (e: any) {
      if (e.message?.includes('Offline')) {
        setError('Du är offline. Denna observation kunde inte sparas just nu.');
      } else {
        setError('Kunde inte spara just nu. Försök igen.');
      }
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'saved' && savedLogId) {
    return (
      <div className="space-y-2 pt-2">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" />
          Livslogg sparad.
        </p>
        
        <div className="bg-surface-3 p-4 rounded-xl border border-border/50 mt-4">
          <SaveAsEvidencePrompt
            userId={userId!}
            childAlias={childAlias}
            childrenLogId={savedLogId}
            observation={observation.trim()}
            category={category}
            childrenImpact={childrenImpact.trim() || undefined}
            onDone={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <p className="text-xs uppercase tracking-widest text-text-dim">
        Steg 1 — Observation ({childAlias})
      </p>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as LivsloggCategory)}
        className="input-glass w-full rounded-xl px-3 py-2"
        disabled={loading}
      >
        {LIVSLOGG_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <textarea
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        placeholder="Neutral, faktabaserad observation (vad hände — inte tolkning mot motpart)..."
        rows={3}
        className="input-glass w-full rounded-xl px-3 py-2"
        disabled={loading}
      />

      <textarea
        value={childrenImpact}
        onChange={(e) => setChildrenImpact(e.target.value)}
        placeholder="Påverkan på barn (valfritt)..."
        rows={2}
        className="input-glass w-full rounded-xl px-3 py-2"
        disabled={loading}
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !observation.trim()}
        className="btn-pill--accent disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Spara livslogg
      </button>
      
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
