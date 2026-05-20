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
    <div className="space-y-2 pt-4 border-t border-white/10">
      <p className="text-xs uppercase tracking-widest text-white/40">Observation — {childAlias}</p>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
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
        className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm resize-none"
      />
      <textarea
        value={childrenImpact}
        onChange={(e) => setChildrenImpact(e.target.value)}
        placeholder="Påverkan på barn (valfritt)..."
        rows={2}
        className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm resize-none"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !observation.trim()}
        className="flex items-center gap-2 rounded-full border border-[#FDE68A]/30 px-4 py-2 text-xs uppercase tracking-widest text-[#FDE68A] disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Spara livslogg
      </button>
    </div>
  );
}
