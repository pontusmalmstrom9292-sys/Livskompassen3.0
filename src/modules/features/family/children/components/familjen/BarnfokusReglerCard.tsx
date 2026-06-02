import { useState } from 'react';
import { Shield, Plus, Check, Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import type { ChildAlias } from '../../constants';

type Rule = {
  id: string;
  text: string;
  category: 'trygghet' | 'granser' | 'rutin';
};

const DEFAULT_RULES: Rule[] = [
  { id: '1', text: 'Hos pappa pratar vi alltid lugnt och lyssnar färdigt.', category: 'trygghet' },
  { id: '2', text: 'Det är okej att vara arg, ledsen eller spänd här.', category: 'trygghet' },
  { id: '3', text: 'Vi har fasta tider för sömn och vila — kroppen får landa.', category: 'rutin' },
  { id: '4', text: 'Pappa sätter gränserna, barnen får vara barn.', category: 'granser' },
];

type Props = {
  childAlias: ChildAlias;
  onSaveLog: (data: { observation: string; category: string }) => Promise<string>;
};

export function BarnfokusReglerCard({ childAlias, onSaveLog }: Props) {
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES);
  const [newRule, setNewRule] = useState('');
  const [newCategory, setNewCategory] = useState<'trygghet' | 'granser' | 'rutin'>('trygghet');
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.trim()) return;
    const rule: Rule = {
      id: crypto.randomUUID(),
      text: newRule.trim(),
      category: newCategory,
    };
    setRules((prev) => [...prev, rule]);
    setNewRule('');
  };

  const handleSaveObservation = async () => {
    if (!observation.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSaveLog({
        observation: `[Vardagsstruktur · Rutintest] ${observation.trim()}`,
        category: 'vardagsstruktur',
      });
      setSuccess(true);
      setObservation('');
      window.setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Kunde inte spara till barnets livslogg.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoCard
      title="Husregler & Struktur"
      description={`Skapa en trygg hamn med fasta rutiner för ${childAlias}.`}
      icon={<Shield className="h-4 w-4 text-accent" />}
    >
      <p className="text-xs text-text-muted mb-4 leading-relaxed">
        Barn som utsätts för psykisk press mår bäst av absolut förutsägbarhet.
        Här definierar du era fasta ramar. De sparas lokalt och visas som stöd för dig i vardagen.
      </p>

      <div className="space-y-3 mb-4">
        {rules.map((r) => (
          <div
            key={r.id}
            className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-surface/30 px-3.5 py-3 text-sm"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-text-muted leading-relaxed">{r.text}</p>
              <span className="mt-1 inline-block text-[9px] uppercase tracking-wider text-text-dim">
                {r.category === 'trygghet'
                  ? 'Emotionell trygghet'
                  : r.category === 'granser'
                    ? 'Gränssättning'
                    : 'Vardagsrutin'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRules((prev) => prev.filter((x) => x.id !== r.id))}
              className="text-xs text-text-dim hover:text-danger bg-transparent border-0 cursor-pointer"
              title="Ta bort regel"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddRule} className="space-y-2 border-t border-border-strong/40 pt-4">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">Lägg till struktur</p>
        <input
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="T.ex. Efter skolan landar vi 15 minuter i soffan..."
          className="input-glass text-sm"
        />
        <div className="flex gap-2">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as Rule['category'])}
            className="input-glass py-2.5 text-xs flex-1"
          >
            <option value="trygghet">Emotionell trygghet</option>
            <option value="granser">Gränssättning</option>
            <option value="rutin">Vardagsrutin</option>
          </select>
          <button type="submit" className="btn-pill--secondary shrink-0 text-xs">
            <Plus className="h-3 w-3" /> Lägg till
          </button>
        </div>
      </form>

      <div className="mt-4 border-t border-border-strong/40 pt-4 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">
          Logga hur strukturen fungerar (Observation)
        </p>
        <p className="text-xs text-text-dim leading-snug">
          Notera hur {childAlias} reagerar på era rutiner. Spara t.ex. om barnet slappnar av, sover
          bättre eller uttrycker oro efter överlämning.
        </p>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="T.ex. Kasper somnade inom 10 minuter efter vår kvällsrutin, inga mardrömmar inatt..."
          rows={3}
          className="input-glass text-sm"
          disabled={loading}
        />
        <button
          type="button"
          disabled={loading || !observation.trim()}
          onClick={() => void handleSaveObservation()}
          className="btn-pill--accent w-full text-xs"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
          Spara observation i livslogg
        </button>
        {success && (
          <p className="text-xs text-success text-center">Sparat i {childAlias}s livslogg.</p>
        )}
        {error && <p className="text-xs text-danger text-center">{error}</p>}
      </div>
    </BentoCard>
  );
}
