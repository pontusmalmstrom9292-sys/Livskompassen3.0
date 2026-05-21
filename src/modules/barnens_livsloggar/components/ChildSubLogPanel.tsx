import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import type { ChildAlias } from '../constants';

interface Props {
  childAlias: ChildAlias;
  onSave: (data: {
    observation: string;
    category: string;
    childrenImpact?: string;
  }) => Promise<void>;
}

export function ChildSubLogPanel({ childAlias, onSave }: Props) {
  const [observation, setObservation] = useState('');
  const [childrenImpact, setChildrenImpact] = useState('');
  const [category, setCategory] = useState('vardag');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!observation.trim()) return;
    setLoading(true);
    try {
      await onSave({
        observation: observation.trim(),
        category,
        childrenImpact: childrenImpact.trim() || undefined,
      });
      setObservation('');
      setChildrenImpact('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 border-t border-border-strong pt-4">
      <p className="text-xs uppercase tracking-widest text-text-dim">Observation — {childAlias}</p>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input-glass rounded-xl px-3 py-2"
      >
        <option value="vardag">Vardag</option>
        <option value="skola">Skola</option>
        <option value="halsa">Hälsa</option>
        <option value="overlamning">Överlämning</option>
      </select>
      <textarea
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        placeholder="Neutral, faktabaserad observation..."
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
