import { useState, useEffect } from 'react';
import { Plus, Loader2, Check, Heart } from 'lucide-react';
import { LIVSLOGG_CATEGORIES, type LivsloggCategory } from '../../constants';
import { STUND_MAX_CHARS, resolveStundCategory } from '../../utils/childMomentHelpers';
// import { SaveAsEvidencePrompt } from '../../components/SaveAsEvidencePrompt'; // Not used in 'stund'
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';

export function FamiljenLivsloggStundDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const childAlias = shell.activeChild;
  const onSave = shell.handleSaveObservation;

  const [step, setStep] = useState<'form' | 'saved'>('form');
  const [observation, setObservation] = useState('');
  const [category, setCategory] = useState<LivsloggCategory>('positivt');
  const [saveAsAnchor, setSaveAsAnchor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      setObservation('');
      setCategory('positivt');
      setSaveAsAnchor(false);
      setStep('form');
      setError(null);
    };
  }, [childAlias]);

  const resetForm = () => {
    setObservation('');
    setCategory('positivt');
    setSaveAsAnchor(false);
    setStep('form');
    setError(null);
  };

  const effectiveCategory = resolveStundCategory(category, saveAsAnchor);

  const handleSave = async () => {
    if (!observation.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const id = await onSave({
        observation: observation.trim(),
        category: effectiveCategory,
      });
      setStep('saved');
      onSaved?.(id);
      
      // Auto-reset back to form after 3 seconds for seamless input
      setTimeout(() => {
        setStep((s) => (s === 'saved' ? 'form' : s));
        setObservation('');
      }, 3000);
    } catch (e: any) {
      if (e.message?.includes('Offline')) {
        setError('Du är offline. Denna stund kunde inte sparas just nu.');
      } else {
        setError('Kunde inte spara just nu. Försök igen.');
      }
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'saved') {
    return (
      <div className="space-y-2 pt-2">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" />
          Stund sparad.
          {saveAsAnchor && (
            <span className="inline-flex items-center gap-1 text-accent">
              <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
              Ankare
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="text-xs text-text-dim hover:text-text underline decoration-border-strong underline-offset-4"
        >
          Spara en till
        </button>
      </div>
    );
  }

  const charCount = observation.length;

  return (
    <div className="space-y-3 pt-2">
      <p className="text-xs uppercase tracking-widest text-text-dim">
        Vad vill du minnas? ({childAlias})
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
        onChange={(e) => setObservation(e.target.value.slice(0, STUND_MAX_CHARS))}
        placeholder="En kort stund du vill bära med dig…"
        rows={4}
        maxLength={STUND_MAX_CHARS}
        className="input-glass w-full rounded-xl px-3 py-2"
      />
      <div className="flex items-center justify-between">
        <p className="text-right text-[10px] text-text-dim w-full">
          {charCount}/{STUND_MAX_CHARS}
        </p>
      </div>

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

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !observation.trim()}
        className="ds-btn ds-btn--accent disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Spara stund
      </button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
