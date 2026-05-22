import { useState, useEffect } from 'react';
import { Plus, Loader2, Check } from 'lucide-react';
import { LIVSLOGG_CATEGORIES, type ChildAlias, type LivsloggCategory } from '../constants';
import { SaveAsEvidencePrompt } from './SaveAsEvidencePrompt';

interface Props {
  childAlias: ChildAlias;
  userId: string;
  onSave: (data: {
    observation: string;
    category: string;
    childrenImpact?: string;
  }) => Promise<string>;
}

export function ChildSubLogPanel({ childAlias, userId, onSave }: Props) {
  const [step, setStep] = useState<'form' | 'saved'>('form');
  const [observation, setObservation] = useState('');
  const [childrenImpact, setChildrenImpact] = useState('');
  const [category, setCategory] = useState<LivsloggCategory>('vardag');
  const [loading, setLoading] = useState(false);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      setObservation('');
      setChildrenImpact('');
      setCategory('vardag');
      setStep('form');
      setSavedLogId(null);
    };
  }, [childAlias]);

  const resetForm = () => {
    setObservation('');
    setChildrenImpact('');
    setCategory('vardag');
    setStep('form');
    setSavedLogId(null);
  };

  const handleSave = async () => {
    if (!observation.trim()) return;
    setLoading(true);
    try {
      const id = await onSave({
        observation: observation.trim(),
        category,
        childrenImpact: childrenImpact.trim() || undefined,
      });
      setSavedLogId(id);
      setStep('saved');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'saved' && savedLogId) {
    return (
      <div className="space-y-2 border-t border-border-strong pt-4">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" /> Livslogg sparad.
        </p>
        <SaveAsEvidencePrompt
          userId={userId}
          childAlias={childAlias}
          childrenLogId={savedLogId}
          observation={observation.trim()}
          category={category}
          childrenImpact={childrenImpact.trim() || undefined}
          onDone={resetForm}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2 border-t border-border-strong pt-4">
      <p className="text-xs uppercase tracking-widest text-text-dim">
        Steg 1 — Observation ({childAlias})
      </p>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as LivsloggCategory)}
        className="input-glass rounded-xl px-3 py-2"
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
        className="input-glass rounded-xl px-3 py-2"
      />
      <textarea
        value={childrenImpact}
        onChange={(e) => setChildrenImpact(e.target.value)}
        placeholder="Påverkan på barn (valfritt)..."
        rows={2}
        className="input-glass rounded-xl px-3 py-2"
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
    </div>
  );
}
