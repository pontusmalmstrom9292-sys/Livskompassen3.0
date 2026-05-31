import { useState, useEffect } from 'react';
import { Plus, Loader2, Check, Heart } from 'lucide-react';
import { LIVSLOGG_CATEGORIES, type ChildAlias, type LivsloggCategory } from '../constants';
import { STUND_MAX_CHARS, resolveStundCategory } from '../utils/childMomentHelpers';
import { SaveAsEvidencePrompt } from './SaveAsEvidencePrompt';

interface Props {
  childAlias: ChildAlias;
  userId: string;
  /** `stund` = Ny stund (Familjen Livslogg); `livslogg` = forensisk observation. */
  variant?: 'livslogg' | 'stund';
  onSave: (data: {
    observation: string;
    category: string;
    childrenImpact?: string;
  }) => Promise<string>;
}

export function ChildSubLogPanel({
  childAlias,
  userId,
  variant = 'livslogg',
  onSave,
}: Props) {
  const isStund = variant === 'stund';
  const [step, setStep] = useState<'form' | 'saved'>('form');
  const [observation, setObservation] = useState('');
  const [childrenImpact, setChildrenImpact] = useState('');
  const [category, setCategory] = useState<LivsloggCategory>(isStund ? 'positivt' : 'vardag');
  const [saveAsAnchor, setSaveAsAnchor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);
  const [savedAsAnchor, setSavedAsAnchor] = useState(false);

  useEffect(() => {
    return () => {
      setObservation('');
      setChildrenImpact('');
      setCategory(isStund ? 'positivt' : 'vardag');
      setSaveAsAnchor(false);
      setStep('form');
      setSavedLogId(null);
      setSavedAsAnchor(false);
    };
  }, [childAlias, isStund]);

  const resetForm = () => {
    setObservation('');
    setChildrenImpact('');
    setCategory(isStund ? 'positivt' : 'vardag');
    setSaveAsAnchor(false);
    setStep('form');
    setSavedLogId(null);
    setSavedAsAnchor(false);
  };

  const effectiveCategory = resolveStundCategory(category, saveAsAnchor);

  const handleSave = async () => {
    if (!observation.trim()) return;
    setLoading(true);
    try {
      const id = await onSave({
        observation: observation.trim(),
        category: effectiveCategory,
        childrenImpact: childrenImpact.trim() || undefined,
      });
      setSavedLogId(id);
      setSavedAsAnchor(saveAsAnchor);
      setStep('saved');
    } catch {
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'saved' && savedLogId) {
    return (
      <div className="space-y-2 border-t border-border-strong pt-4">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" />
          {isStund ? 'Stund sparad.' : 'Livslogg sparad.'}
          {savedAsAnchor && (
            <span className="inline-flex items-center gap-1 text-accent">
              <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
              Ankare
            </span>
          )}
        </p>
        <SaveAsEvidencePrompt
          userId={userId}
          childAlias={childAlias}
          childrenLogId={savedLogId}
          observation={observation.trim()}
          category={effectiveCategory}
          childrenImpact={childrenImpact.trim() || undefined}
          onDone={resetForm}
        />
      </div>
    );
  }

  const charCount = observation.length;

  return (
    <div className="space-y-3 border-t border-border-strong pt-4">
      <p className="text-xs uppercase tracking-widest text-text-dim">
        {isStund ? `Vad vill du minnas? (${childAlias})` : `Steg 1 — Observation (${childAlias})`}
      </p>

      {!saveAsAnchor && (
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as LivsloggCategory)}
          className="input-glass w-full rounded-xl px-3 py-2"
        >
          {LIVSLOGG_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      )}

      <textarea
        value={observation}
        onChange={(e) =>
          setObservation(
            isStund ? e.target.value.slice(0, STUND_MAX_CHARS) : e.target.value,
          )
        }
        placeholder={
          isStund
            ? 'En kort stund du vill bära med dig…'
            : 'Neutral, faktabaserad observation (vad hände — inte tolkning mot motpart)...'
        }
        rows={isStund ? 4 : 3}
        maxLength={isStund ? STUND_MAX_CHARS : undefined}
        className="input-glass w-full rounded-xl px-3 py-2"
      />
      {isStund && (
        <p className="text-right text-[10px] text-text-dim">
          {charCount}/{STUND_MAX_CHARS}
        </p>
      )}

      {!isStund && (
        <textarea
          value={childrenImpact}
          onChange={(e) => setChildrenImpact(e.target.value)}
          placeholder="Påverkan på barn (valfritt)..."
          rows={2}
          className="input-glass w-full rounded-xl px-3 py-2"
        />
      )}

      {isStund && (
        <button
          type="button"
          role="switch"
          aria-checked={saveAsAnchor}
          onClick={() => setSaveAsAnchor((v) => !v)}
          className={`familjen-anchor-card flex w-full items-center justify-between gap-3 text-left transition ${
            saveAsAnchor ? 'ring-1 ring-accent/40' : ''
          }`}
        >
          <span>
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent/90">
              <Heart
                className={`h-4 w-4 ${saveAsAnchor ? 'fill-accent text-accent' : 'text-accent/70'}`}
                aria-hidden
              />
              Spara som ankare
            </span>
            <span className="mt-1 block text-xs text-text-dim">
              Visas som favorit och kan bli uthållen stund.
            </span>
          </span>
          <span
            className={`h-6 w-10 shrink-0 rounded-full border transition ${
              saveAsAnchor ? 'border-accent bg-accent/30' : 'border-white/20 bg-white/5'
            }`}
          >
            <span
              className={`mt-0.5 block h-5 w-5 rounded-full bg-white shadow transition ${
                saveAsAnchor ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !observation.trim()}
        className="btn-pill--accent disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {isStund ? 'Spara stund' : 'Spara livslogg'}
      </button>
    </div>
  );
}
